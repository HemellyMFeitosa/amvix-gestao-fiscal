-- Criar tabela de empresas
CREATE TABLE IF NOT EXISTS public.empresas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  razao_social TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  inscricao_estadual TEXT,
  endereco TEXT,
  telefone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de clientes e fornecedores
CREATE TABLE IF NOT EXISTS public.clientes_fornecedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('cliente', 'fornecedor')),
  cpf_cnpj TEXT NOT NULL,
  nome_razao_social TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de produtos e serviços
CREATE TABLE IF NOT EXISTS public.produtos_servicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor_unitario DECIMAL(10, 2) NOT NULL,
  aliquotas JSONB,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de notas fiscais
CREATE TABLE IF NOT EXISTS public.notas_fiscais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  cliente_fornecedor_id UUID NOT NULL REFERENCES public.clientes_fornecedores(id),
  numero INTEGER NOT NULL,
  serie INTEGER NOT NULL DEFAULT 1,
  tipo TEXT NOT NULL CHECK (tipo IN ('NF-e', 'NFC-e', 'NFS-e')),
  natureza_operacao TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Autorizada', 'Cancelada')),
  data_emissao DATE NOT NULL DEFAULT CURRENT_DATE,
  valor_total DECIMAL(10, 2) NOT NULL,
  dados_fiscais JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(empresa_id, serie, numero)
);

-- Enable RLS
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas_fiscais ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para empresas
CREATE POLICY "Usuários podem ver suas próprias empresas"
  ON public.empresas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias empresas"
  ON public.empresas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias empresas"
  ON public.empresas FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas RLS para clientes_fornecedores
CREATE POLICY "Usuários podem ver clientes/fornecedores de suas empresas"
  ON public.clientes_fornecedores FOR SELECT
  USING (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem criar clientes/fornecedores em suas empresas"
  ON public.clientes_fornecedores FOR INSERT
  WITH CHECK (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem atualizar clientes/fornecedores de suas empresas"
  ON public.clientes_fornecedores FOR UPDATE
  USING (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem deletar clientes/fornecedores de suas empresas"
  ON public.clientes_fornecedores FOR DELETE
  USING (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()));

-- Políticas RLS para produtos_servicos
CREATE POLICY "Usuários podem ver produtos/serviços de suas empresas"
  ON public.produtos_servicos FOR SELECT
  USING (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem criar produtos/serviços em suas empresas"
  ON public.produtos_servicos FOR INSERT
  WITH CHECK (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem atualizar produtos/serviços de suas empresas"
  ON public.produtos_servicos FOR UPDATE
  USING (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem deletar produtos/serviços de suas empresas"
  ON public.produtos_servicos FOR DELETE
  USING (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()));

-- Políticas RLS para notas_fiscais
CREATE POLICY "Usuários podem ver notas fiscais de suas empresas"
  ON public.notas_fiscais FOR SELECT
  USING (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem criar notas fiscais em suas empresas"
  ON public.notas_fiscais FOR INSERT
  WITH CHECK (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem atualizar notas fiscais de suas empresas"
  ON public.notas_fiscais FOR UPDATE
  USING (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem deletar notas fiscais de suas empresas"
  ON public.notas_fiscais FOR DELETE
  USING (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()));

-- Criar índices para melhor performance
CREATE INDEX idx_clientes_fornecedores_empresa ON public.clientes_fornecedores(empresa_id);
CREATE INDEX idx_produtos_servicos_empresa ON public.produtos_servicos(empresa_id);
CREATE INDEX idx_notas_fiscais_empresa ON public.notas_fiscais(empresa_id);
CREATE INDEX idx_notas_fiscais_status ON public.notas_fiscais(status);
CREATE INDEX idx_notas_fiscais_data ON public.notas_fiscais(data_emissao);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_empresas_updated_at
  BEFORE UPDATE ON public.empresas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clientes_fornecedores_updated_at
  BEFORE UPDATE ON public.clientes_fornecedores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_produtos_servicos_updated_at
  BEFORE UPDATE ON public.produtos_servicos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notas_fiscais_updated_at
  BEFORE UPDATE ON public.notas_fiscais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();