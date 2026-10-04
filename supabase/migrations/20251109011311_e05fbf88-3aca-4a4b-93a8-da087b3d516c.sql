-- Tabela de módulos do sistema
CREATE TABLE public.modulos_sistema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  icone TEXT,
  rota TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tipos de ações possíveis
CREATE TYPE public.tipo_acao AS ENUM ('visualizar', 'criar', 'editar', 'excluir', 'exportar');

-- Tabela de permissões (relaciona roles com módulos e ações)
CREATE TABLE public.permissoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  modulo_id UUID NOT NULL REFERENCES public.modulos_sistema(id) ON DELETE CASCADE,
  acao tipo_acao NOT NULL,
  permitido BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role, modulo_id, acao)
);

-- Adicionar campos de controle ao profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telefone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS departamento TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS observacoes TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cadastrado_por TEXT;

-- Enable RLS
ALTER TABLE public.modulos_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissoes ENABLE ROW LEVEL SECURITY;

-- Policies para modulos_sistema
CREATE POLICY "Todos podem ver módulos ativos"
ON public.modulos_sistema FOR SELECT
USING (ativo = true);

CREATE POLICY "Apenas admins podem gerenciar módulos"
ON public.modulos_sistema FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Policies para permissoes
CREATE POLICY "Admins podem ver todas permissões"
ON public.permissoes FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Apenas admins podem gerenciar permissões"
ON public.permissoes FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Função para verificar permissão específica
CREATE OR REPLACE FUNCTION public.tem_permissao(
  _user_id UUID,
  _modulo TEXT,
  _acao tipo_acao
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.permissoes p ON p.role = ur.role
    JOIN public.modulos_sistema m ON m.id = p.modulo_id
    WHERE ur.user_id = _user_id
      AND m.nome = _modulo
      AND p.acao = _acao
      AND p.permitido = true
      AND m.ativo = true
  )
$$;

-- Inserir módulos padrão do sistema
INSERT INTO public.modulos_sistema (nome, descricao, icone, rota, ordem) VALUES
('dashboard', 'Dashboard Principal', 'LayoutDashboard', '/dashboard', 1),
('nfe', 'Notas Fiscais Eletrônicas (NF-e)', 'FileText', '/nfe', 2),
('nfse', 'Notas Fiscais de Serviço (NFS-e)', 'FileCheck', '/nfse', 3),
('nfce', 'Notas Fiscais ao Consumidor (NFC-e)', 'Receipt', '/nfce', 4),
('validacao', 'Validação de Notas Fiscais', 'CheckCircle', '/validacao-nf', 5),
('integracao_erp', 'Integração com ERP', 'Database', '/integracao-erp', 6),
('automacao_rpa', 'Automação RPA', 'Bot', '/automacao-rpa', 7),
('sped_fiscal', 'SPED Fiscal', 'FileSpreadsheet', '/sped-fiscal', 8),
('efd_reinf', 'EFD-Reinf', 'FileCog', '/efd-reinf', 9),
('certificados', 'Certificados Digitais', 'Shield', '/certificados-digitais', 10),
('empresas', 'Empresas e Filiais', 'Building', '/empresas-filiais', 11),
('parametros', 'Parâmetros Fiscais', 'Settings', '/parametros-fiscais', 12),
('indicadores', 'Indicadores Fiscais', 'BarChart3', '/indicadores-fiscais', 13),
('armazenamento', 'Armazenamento de XML', 'HardDrive', '/armazenamento-xml', 14),
('lgpd', 'Controle LGPD', 'Lock', '/controle-lgpd', 15),
('monitoramento', 'Monitoramento', 'Activity', '/monitoramento', 16),
('admin', 'Administração de Usuários', 'Users', '/admin', 17);

-- Inserir permissões padrão para administrador (acesso total)
INSERT INTO public.permissoes (role, modulo_id, acao, permitido)
SELECT 
  'admin'::app_role,
  id,
  acao::tipo_acao,
  true
FROM public.modulos_sistema
CROSS JOIN unnest(ARRAY['visualizar', 'criar', 'editar', 'excluir', 'exportar']) AS acao;

-- Inserir permissões padrão para contador (operacional completo, sem admin)
INSERT INTO public.permissoes (role, modulo_id, acao, permitido)
SELECT 
  'contador'::app_role,
  m.id,
  acao::tipo_acao,
  CASE 
    WHEN m.nome = 'admin' THEN false
    ELSE true
  END
FROM public.modulos_sistema m
CROSS JOIN unnest(ARRAY['visualizar', 'criar', 'editar', 'excluir', 'exportar']) AS acao;

-- Inserir permissões padrão para cliente (apenas visualização básica)
INSERT INTO public.permissoes (role, modulo_id, acao, permitido)
SELECT 
  'cliente'::app_role,
  m.id,
  acao::tipo_acao,
  CASE 
    WHEN m.nome IN ('dashboard', 'nfe', 'nfse', 'nfce', 'indicadores') AND acao::tipo_acao = 'visualizar' THEN true
    ELSE false
  END
FROM public.modulos_sistema m
CROSS JOIN unnest(ARRAY['visualizar', 'criar', 'editar', 'excluir', 'exportar']) AS acao;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_modulos_sistema_updated_at
BEFORE UPDATE ON public.modulos_sistema
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_permissoes_updated_at
BEFORE UPDATE ON public.permissoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();