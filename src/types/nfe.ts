// Tipos do conteúdo JSON gravado em notas_fiscais.dados_fiscais

export interface DestinatarioNFe {
  razao_social?: string;
  cnpj_cpf?: string;
  ie?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
}

export interface ItemNFe {
  codigo?: string;
  descricao?: string;
  ncm?: string;
  cst?: string;
  cfop?: string;
  unidade?: string;
  quantidade?: number;
  valor_unitario?: number;
  valor_total?: number;
  icms_aliquota?: number;
  icms_valor?: number;
  ipi_valor?: number;
  pis_valor?: number;
  cofins_valor?: number;
}

export interface TotaisNFe {
  baseIcms?: number;
  totalProdutos?: number;
  valorIcms?: number;
  valorIpi?: number;
  valorPis?: number;
  valorCofins?: number;
}

export interface TransporteNFe {
  modalidade_frete?: string;
  transportadora?: {
    cnpj?: string;
    razao_social?: string;
    ie?: string;
    endereco?: string;
  };
  volumes?: {
    quantidade?: number;
    especie?: string;
    peso_bruto?: number;
    peso_liquido?: number;
  };
}

export interface CobrancaNFe {
  forma_pagamento?: string;
  meio_pagamento?: string;
}

export interface DadosFiscaisNFe {
  destinatario?: DestinatarioNFe;
  itens?: ItemNFe[];
  totais?: TotaisNFe;
  transporte?: TransporteNFe;
  cobranca?: CobrancaNFe;
  informacoes_complementares?: string;
  [chave: string]: unknown;
}

export interface ClienteNFe {
  nome_razao_social: string;
  cpf_cnpj?: string;
  email?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  ie?: string;
}

export interface NotaFiscal {
  id: string;
  numero: number;
  serie: number;
  data_emissao: string;
  natureza_operacao: string;
  status: string;
  valor_total: number;
  /** JSON gravado no banco; lido como DadosFiscaisNFe */
  dados_fiscais: unknown;
  clientes_fornecedores?: ClienteNFe | null;
}

export interface EmpresaNFe {
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  inscricao_estadual?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  email?: string;
}
