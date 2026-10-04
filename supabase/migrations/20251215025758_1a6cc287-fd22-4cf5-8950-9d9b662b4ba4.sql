-- Remover a view com SECURITY DEFINER (problema de segurança)
DROP VIEW IF EXISTS public.empresas_segura;

-- Criar view SECURITY INVOKER (usa permissões do usuário que consulta)
CREATE VIEW public.empresas_segura 
WITH (security_invoker = true)
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