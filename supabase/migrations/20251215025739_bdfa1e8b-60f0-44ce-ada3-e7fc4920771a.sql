-- 1. Adicionar política DELETE faltante para a tabela empresas
CREATE POLICY "Usuários podem deletar suas próprias empresas"
ON public.empresas
FOR DELETE
USING (auth.uid() = user_id);

-- 2. Criar extensão pgcrypto para criptografia
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 3. Criar função segura para salvar senha do certificado (criptografada)
CREATE OR REPLACE FUNCTION public.set_certificado_senha(
  _empresa_id uuid,
  _senha text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Verificar se o usuário é dono da empresa
  SELECT user_id INTO _user_id FROM empresas WHERE id = _empresa_id;
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Empresa não encontrada';
  END IF;
  
  IF _user_id != auth.uid() THEN
    RAISE EXCEPTION 'Acesso não autorizado';
  END IF;
  
  -- Atualizar senha criptografada usando pgcrypto
  UPDATE empresas 
  SET certificado_senha = encode(pgp_sym_encrypt(_senha, current_setting('app.encryption_key', true)), 'base64'),
      updated_at = now()
  WHERE id = _empresa_id;
  
  RETURN true;
END;
$$;

-- 4. Criar função segura para obter senha do certificado (descriptografada)
-- Esta função só deve ser chamada quando realmente necessário (ex: assinar NF-e)
CREATE OR REPLACE FUNCTION public.get_certificado_senha(_empresa_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _senha_encrypted text;
BEGIN
  -- Verificar se o usuário é dono da empresa
  SELECT user_id, certificado_senha INTO _user_id, _senha_encrypted 
  FROM empresas WHERE id = _empresa_id;
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Empresa não encontrada';
  END IF;
  
  IF _user_id != auth.uid() THEN
    RAISE EXCEPTION 'Acesso não autorizado';
  END IF;
  
  -- Se não há senha, retorna null
  IF _senha_encrypted IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Descriptografar e retornar
  RETURN pgp_sym_decrypt(decode(_senha_encrypted, 'base64'), current_setting('app.encryption_key', true));
EXCEPTION
  WHEN OTHERS THEN
    -- Se falhar a descriptografia (senha antiga em texto plano), retorna como está
    RETURN _senha_encrypted;
END;
$$;

-- 5. Criar view segura que exclui dados sensíveis para consultas normais
CREATE OR REPLACE VIEW public.empresas_segura AS
SELECT 
  id,
  user_id,
  codigo,
  cnpj,
  razao_social,
  nome_fantasia,
  inscricao_estadual,
  inscricao_municipal,
  regime_tributario,
  status,
  cep,
  logradouro,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
  telefone,
  celular,
  email,
  site,
  certificado_arquivo,
  certificado_validade,
  certificado_status,
  -- NÃO inclui certificado_senha
  created_at,
  updated_at
FROM public.empresas
WHERE auth.uid() = user_id;