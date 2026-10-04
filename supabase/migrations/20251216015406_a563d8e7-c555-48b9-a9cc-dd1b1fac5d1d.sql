-- 1. Permitir que usuários vejam suas próprias permissões (necessário para UI)
CREATE POLICY "Usuários podem ver permissões de suas roles"
ON public.permissoes
FOR SELECT
TO authenticated
USING (
  role IN (SELECT role FROM public.user_roles WHERE user_id = auth.uid())
);

-- 2. Adicionar comentário na view empresas_segura explicando security_invoker
-- A view já tem security_invoker=true que herda RLS automaticamente
COMMENT ON VIEW public.empresas_segura IS 
'View segura que exclui certificado_senha. 
Usa security_invoker=true para herdar RLS da tabela empresas.
Usuários só podem ver empresas onde auth.uid() = user_id.';