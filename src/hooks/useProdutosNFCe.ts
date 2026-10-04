import { useState, useEffect } from 'react';

export interface ProdutoNFCe {
  id: number;
  codigoBarras: string;
  codigoInterno: string;
  descricao: string;
  categoria: string;
  unidade: string;
  valorVenda: number;
  valorCusto: number;
  estoqueAtual: number;
  estoqueMinimo: number;
  ncm: string;
  cest: string;
  icms: {
    cst: string;
    aliquota: number;
  };
  pis: {
    cst: string;
    aliquota: number;
  };
  cofins: {
    cst: string;
    aliquota: number;
  };
  observacoes: string;
  dataCadastro: string;
}

const STORAGE_KEY = 'produtos_nfce';

const produtosDemo: ProdutoNFCe[] = [
  {
    id: 1,
    codigoBarras: "7891234567890",
    codigoInterno: "001",
    descricao: "Coca-Cola 2L",
    categoria: "Bebidas",
    unidade: "UN",
    valorVenda: 8.50,
    valorCusto: 5.00,
    estoqueAtual: 100,
    estoqueMinimo: 20,
    ncm: "22.02.10",
    cest: "",
    icms: { cst: "00", aliquota: 18 },
    pis: { cst: "01", aliquota: 1.65 },
    cofins: { cst: "01", aliquota: 7.6 },
    observacoes: "",
    dataCadastro: new Date().toISOString()
  },
  {
    id: 2,
    codigoBarras: "7899876543210",
    codigoInterno: "002",
    descricao: "Arroz Tipo 1 - 5kg",
    categoria: "Alimentos",
    unidade: "UN",
    valorVenda: 25.90,
    valorCusto: 18.00,
    estoqueAtual: 50,
    estoqueMinimo: 10,
    ncm: "10.06.30",
    cest: "",
    icms: { cst: "00", aliquota: 7 },
    pis: { cst: "01", aliquota: 1.65 },
    cofins: { cst: "01", aliquota: 7.6 },
    observacoes: "",
    dataCadastro: new Date().toISOString()
  },
  {
    id: 3,
    codigoBarras: "7891111222333",
    codigoInterno: "003",
    descricao: "Sabão em Pó 1kg",
    categoria: "Limpeza",
    unidade: "UN",
    valorVenda: 12.90,
    valorCusto: 8.50,
    estoqueAtual: 75,
    estoqueMinimo: 15,
    ncm: "34.02.20",
    cest: "",
    icms: { cst: "00", aliquota: 18 },
    pis: { cst: "01", aliquota: 1.65 },
    cofins: { cst: "01", aliquota: 7.6 },
    observacoes: "",
    dataCadastro: new Date().toISOString()
  },
  {
    id: 4,
    codigoBarras: "7894444555666",
    codigoInterno: "004",
    descricao: "Leite Integral 1L",
    categoria: "Alimentos",
    unidade: "UN",
    valorVenda: 4.50,
    valorCusto: 3.20,
    estoqueAtual: 120,
    estoqueMinimo: 30,
    ncm: "04.01.10",
    cest: "",
    icms: { cst: "00", aliquota: 12 },
    pis: { cst: "01", aliquota: 1.65 },
    cofins: { cst: "01", aliquota: 7.6 },
    observacoes: "",
    dataCadastro: new Date().toISOString()
  },
  {
    id: 5,
    codigoBarras: "7897777888999",
    codigoInterno: "005",
    descricao: "Pão Francês",
    categoria: "Alimentos",
    unidade: "KG",
    valorVenda: 12.00,
    valorCusto: 7.00,
    estoqueAtual: 30,
    estoqueMinimo: 5,
    ncm: "19.05.90",
    cest: "",
    icms: { cst: "00", aliquota: 12 },
    pis: { cst: "01", aliquota: 1.65 },
    cofins: { cst: "01", aliquota: 7.6 },
    observacoes: "",
    dataCadastro: new Date().toISOString()
  }
];

export const useProdutosNFCe = () => {
  const [produtos, setProdutos] = useState<ProdutoNFCe[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProdutos(JSON.parse(stored));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(produtosDemo));
      setProdutos(produtosDemo);
    }
  }, []);

  const salvarProdutos = (novosProdutos: ProdutoNFCe[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosProdutos));
    setProdutos(novosProdutos);
  };

  const adicionarProduto = (produto: Omit<ProdutoNFCe, 'id' | 'dataCadastro'>) => {
    const novoProduto: ProdutoNFCe = {
      ...produto,
      id: Date.now(),
      dataCadastro: new Date().toISOString(),
    };
    const novosProdutos = [...produtos, novoProduto];
    salvarProdutos(novosProdutos);
    return novoProduto;
  };

  const atualizarProduto = (id: number, produtoAtualizado: Partial<ProdutoNFCe>) => {
    const novosProdutos = produtos.map(p =>
      p.id === id ? { ...p, ...produtoAtualizado } : p
    );
    salvarProdutos(novosProdutos);
  };

  const removerProduto = (id: number) => {
    const novosProdutos = produtos.filter(p => p.id !== id);
    salvarProdutos(novosProdutos);
  };

  const buscarProdutos = (termo: string) => {
    if (!termo) return produtos;
    const termoLower = termo.toLowerCase();
    return produtos.filter(p =>
      p.descricao.toLowerCase().includes(termoLower) ||
      p.codigoInterno.toLowerCase().includes(termoLower) ||
      p.codigoBarras.toLowerCase().includes(termoLower)
    );
  };

  const baixarEstoque = (id: number, quantidade: number) => {
    const produto = produtos.find(p => p.id === id);
    if (produto && produto.estoqueAtual >= quantidade) {
      atualizarProduto(id, { estoqueAtual: produto.estoqueAtual - quantidade });
      return true;
    }
    return false;
  };

  return {
    produtos,
    adicionarProduto,
    atualizarProduto,
    removerProduto,
    buscarProdutos,
    baixarEstoque,
  };
};
