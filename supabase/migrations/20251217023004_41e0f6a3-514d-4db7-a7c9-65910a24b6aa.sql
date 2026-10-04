-- Create produtos table
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  codigo_sku TEXT NOT NULL,
  descricao TEXT NOT NULL,
  ncm TEXT,
  cest TEXT,
  unidade TEXT NOT NULL DEFAULT 'UN',
  preco_custo NUMERIC NOT NULL DEFAULT 0,
  preco_venda NUMERIC NOT NULL DEFAULT 0,
  estoque_atual NUMERIC NOT NULL DEFAULT 0,
  estoque_minimo NUMERIC NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add missing columns to clientes_fornecedores
ALTER TABLE public.clientes_fornecedores 
ADD COLUMN IF NOT EXISTS tipo_pessoa TEXT DEFAULT 'juridica',
ADD COLUMN IF NOT EXISTS nome_fantasia TEXT,
ADD COLUMN IF NOT EXISTS ie TEXT,
ADD COLUMN IF NOT EXISTS cep TEXT,
ADD COLUMN IF NOT EXISTS numero TEXT,
ADD COLUMN IF NOT EXISTS complemento TEXT,
ADD COLUMN IF NOT EXISTS bairro TEXT,
ADD COLUMN IF NOT EXISTS cidade TEXT,
ADD COLUMN IF NOT EXISTS uf TEXT,
ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- Create formas_pagamento table
CREATE TABLE public.formas_pagamento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  aceita_parcelamento BOOLEAN NOT NULL DEFAULT false,
  max_parcelas INTEGER DEFAULT 1,
  taxa_desconto NUMERIC DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formas_pagamento ENABLE ROW LEVEL SECURITY;

-- RLS policies for produtos
CREATE POLICY "Usuários podem ver produtos de suas empresas"
ON public.produtos FOR SELECT
USING (empresa_id IN (SELECT id FROM empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem criar produtos em suas empresas"
ON public.produtos FOR INSERT
WITH CHECK (empresa_id IN (SELECT id FROM empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem atualizar produtos de suas empresas"
ON public.produtos FOR UPDATE
USING (empresa_id IN (SELECT id FROM empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem deletar produtos de suas empresas"
ON public.produtos FOR DELETE
USING (empresa_id IN (SELECT id FROM empresas WHERE user_id = auth.uid()));

-- RLS policies for formas_pagamento
CREATE POLICY "Usuários podem ver formas de pagamento de suas empresas"
ON public.formas_pagamento FOR SELECT
USING (empresa_id IN (SELECT id FROM empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem criar formas de pagamento em suas empresas"
ON public.formas_pagamento FOR INSERT
WITH CHECK (empresa_id IN (SELECT id FROM empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem atualizar formas de pagamento de suas empresas"
ON public.formas_pagamento FOR UPDATE
USING (empresa_id IN (SELECT id FROM empresas WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem deletar formas de pagamento de suas empresas"
ON public.formas_pagamento FOR DELETE
USING (empresa_id IN (SELECT id FROM empresas WHERE user_id = auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_produtos_empresa_id ON public.produtos(empresa_id);
CREATE INDEX idx_formas_pagamento_empresa_id ON public.formas_pagamento(empresa_id);

-- Triggers for updated_at
CREATE TRIGGER update_produtos_updated_at
BEFORE UPDATE ON public.produtos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_formas_pagamento_updated_at
BEFORE UPDATE ON public.formas_pagamento
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();