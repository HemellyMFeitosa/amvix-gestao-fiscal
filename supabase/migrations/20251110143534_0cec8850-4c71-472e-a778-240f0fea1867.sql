-- Adicionar colunas que faltam na tabela empresas
ALTER TABLE public.empresas 
ADD COLUMN IF NOT EXISTS codigo TEXT,
ADD COLUMN IF NOT EXISTS nome_fantasia TEXT,
ADD COLUMN IF NOT EXISTS inscricao_municipal TEXT,
ADD COLUMN IF NOT EXISTS regime_tributario TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Ativa',
ADD COLUMN IF NOT EXISTS cep TEXT,
ADD COLUMN IF NOT EXISTS logradouro TEXT,
ADD COLUMN IF NOT EXISTS numero TEXT,
ADD COLUMN IF NOT EXISTS complemento TEXT,
ADD COLUMN IF NOT EXISTS bairro TEXT,
ADD COLUMN IF NOT EXISTS cidade TEXT,
ADD COLUMN IF NOT EXISTS estado TEXT,
ADD COLUMN IF NOT EXISTS celular TEXT,
ADD COLUMN IF NOT EXISTS site TEXT,
ADD COLUMN IF NOT EXISTS certificado_arquivo TEXT,
ADD COLUMN IF NOT EXISTS certificado_senha TEXT,
ADD COLUMN IF NOT EXISTS certificado_validade DATE,
ADD COLUMN IF NOT EXISTS certificado_status TEXT;

-- Atualizar registros existentes para terem valores padrão
UPDATE public.empresas
SET 
  codigo = COALESCE(codigo, id::text),
  nome_fantasia = COALESCE(nome_fantasia, razao_social),
  regime_tributario = COALESCE(regime_tributario, 'Lucro Real'),
  status = COALESCE(status, 'Ativa')
WHERE codigo IS NULL OR nome_fantasia IS NULL OR regime_tributario IS NULL;

-- Tornar campos obrigatórios após popular os dados
ALTER TABLE public.empresas
ALTER COLUMN codigo SET NOT NULL,
ALTER COLUMN nome_fantasia SET NOT NULL,
ALTER COLUMN regime_tributario SET NOT NULL,
ALTER COLUMN status SET NOT NULL;