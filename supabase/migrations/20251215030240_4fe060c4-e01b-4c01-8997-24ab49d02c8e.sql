-- 1. Corrigir política de modulos_sistema - apenas usuários autenticados
DROP POLICY IF EXISTS "Todos podem ver módulos ativos" ON public.modulos_sistema;

CREATE POLICY "Usuários autenticados podem ver módulos ativos"
ON public.modulos_sistema
FOR SELECT
TO authenticated
USING (ativo = true);

-- 2. Restringir acesso de contadores aos perfis de clientes (apenas campos necessários)
-- Remover a política atual que expõe todos os dados
DROP POLICY IF EXISTS "Contadores podem ver perfis de clientes" ON public.profiles;

-- Criar função segura para contadores verem apenas dados básicos de clientes
CREATE OR REPLACE FUNCTION public.get_client_profiles_for_contador()
RETURNS TABLE (
  id uuid,
  nome_completo text,
  status text,
  departamento text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.nome_completo, p.status, p.departamento
  FROM public.profiles p
  JOIN public.user_roles ur ON ur.user_id = p.id
  WHERE ur.role = 'cliente'
    AND has_role(auth.uid(), 'contador')
$$;

-- 3. Corrigir a view empresas_segura para herdar RLS da tabela base
-- A view com SECURITY INVOKER já herda as políticas da tabela empresas
-- Mas precisamos garantir que funcione corretamente

-- Recriar a view com as configurações corretas
DROP VIEW IF EXISTS public.empresas_segura;

CREATE VIEW public.empresas_segura 
WITH (security_invoker = true, security_barrier = true)
AS
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
  created_at,
  updated_at
FROM public.empresas;

-- Adicionar comentário explicando a segurança da view
COMMENT ON VIEW public.empresas_segura IS 'View segura que exclui certificado_senha. Usa SECURITY INVOKER para herdar RLS da tabela empresas.';