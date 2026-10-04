import { useState, useEffect } from 'react';

export interface ValidacaoNF {
  id: number;
  nomeArquivo: string;
  tipoNota: 'NF-e' | 'NFS-e' | 'NFC-e';
  numero: string;
  cnpj: string;
  chaveAcesso: string;
  dataEmissao: string;
  valorTotal: number;
  status: 'valido' | 'erro' | 'pendente';
  dataValidacao: string;
  conteudoXML?: string;
  erros: {
    codigo: string;
    campo: string;
    mensagem: string;
    valorInformado?: string;
    valorEsperado?: number;
    diferenca?: number;
  }[];
  validacoes: {
    estruturaValida: boolean;
    cnpjValido: boolean;
    chaveValida: boolean;
    assinaturaPresente: boolean;
    totaisConferem: boolean;
  };
}

const STORAGE_KEY = 'validacoes_nf';

const validacoesDemo: ValidacaoNF[] = [
  {
    id: 1,
    nomeArquivo: "NF-e-12345.xml",
    tipoNota: "NF-e",
    numero: "12345",
    cnpj: "12.345.678/0001-99",
    chaveAcesso: "12345678901234567890123456789012345678901234",
    dataEmissao: "2025-01-15",
    valorTotal: 1500.00,
    status: "valido",
    dataValidacao: "2025-01-15T14:32:00",
    erros: [],
    validacoes: {
      estruturaValida: true,
      cnpjValido: true,
      chaveValida: true,
      assinaturaPresente: true,
      totaisConferem: true
    }
  },
  {
    id: 2,
    nomeArquivo: "NFS-e-5678.xml",
    tipoNota: "NFS-e",
    numero: "5678",
    cnpj: "98.765.432/0001-11",
    chaveAcesso: "56789012345678901234567890123456789012345678",
    dataEmissao: "2025-01-15",
    valorTotal: 800.00,
    status: "valido",
    dataValidacao: "2025-01-15T13:18:00",
    erros: [],
    validacoes: {
      estruturaValida: true,
      cnpjValido: true,
      chaveValida: true,
      assinaturaPresente: true,
      totaisConferem: true
    }
  },
  {
    id: 3,
    nomeArquivo: "NF-e-12344.xml",
    tipoNota: "NF-e",
    numero: "12344",
    cnpj: "00.000.000/0000-00",
    chaveAcesso: "12344444444444444444444444444444444444444444",
    dataEmissao: "2025-01-15",
    valorTotal: 1600.00,
    status: "erro",
    dataValidacao: "2025-01-15T11:45:00",
    erros: [
      {
        codigo: "E001",
        campo: "CNPJ",
        mensagem: "CNPJ inválido - dígitos verificadores incorretos",
        valorInformado: "00.000.000/0000-00"
      },
      {
        codigo: "E002",
        campo: "Total",
        mensagem: "Total divergente",
        valorEsperado: 1500.00,
        valorInformado: "1600.00",
        diferenca: 100.00
      },
      {
        codigo: "E004",
        campo: "Assinatura",
        mensagem: "Assinatura digital não encontrada"
      }
    ],
    validacoes: {
      estruturaValida: true,
      cnpjValido: false,
      chaveValida: true,
      assinaturaPresente: false,
      totaisConferem: false
    }
  },
  {
    id: 4,
    nomeArquivo: "NFC-e-9876.xml",
    tipoNota: "NFC-e",
    numero: "9876",
    cnpj: "11.222.333/0001-44",
    chaveAcesso: "98765432109876543210987654321098765432109876",
    dataEmissao: "2025-01-14",
    valorTotal: 250.00,
    status: "valido",
    dataValidacao: "2025-01-14T16:20:00",
    erros: [],
    validacoes: {
      estruturaValida: true,
      cnpjValido: true,
      chaveValida: true,
      assinaturaPresente: true,
      totaisConferem: true
    }
  }
];

function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != Number(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != Number(digitos.charAt(1))) return false;
  
  return true;
}

function detectarTipoNota(conteudo: string): 'NF-e' | 'NFS-e' | 'NFC-e' {
  if (conteudo.includes('NFe') || conteudo.includes('nfe')) {
    if (conteudo.includes('mod>65') || conteudo.includes('NFCe')) {
      return 'NFC-e';
    }
    return 'NF-e';
  }
  if (conteudo.includes('NFS') || conteudo.includes('nfse')) {
    return 'NFS-e';
  }
  return 'NF-e';
}

function extrairCNPJ(conteudo: string): string {
  const match = conteudo.match(/<CNPJ>(\d+)<\/CNPJ>/i);
  if (match) {
    const cnpj = match[1];
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return '00.000.000/0000-00';
}

function extrairChave(conteudo: string): string {
  const match = conteudo.match(/<chNFe>(\d+)<\/chNFe>/i);
  return match ? match[1] : '';
}

function extrairNumero(conteudo: string): string {
  const match = conteudo.match(/<nNF>(\d+)<\/nNF>/i);
  return match ? match[1] : '0';
}

function extrairValorTotal(conteudo: string): number {
  const match = conteudo.match(/<vNF>([\d.]+)<\/vNF>/i);
  return match ? parseFloat(match[1]) : 0;
}

function extrairDataEmissao(conteudo: string): string {
  const match = conteudo.match(/<dhEmi>(\d{4}-\d{2}-\d{2})/i);
  return match ? match[1] : new Date().toISOString().split('T')[0];
}

export function validarXML(arquivo: File, conteudo: string): ValidacaoNF {
  const resultado: ValidacaoNF = {
    id: Date.now(),
    nomeArquivo: arquivo.name,
    tipoNota: detectarTipoNota(conteudo),
    numero: '0',
    cnpj: '',
    chaveAcesso: '',
    dataEmissao: '',
    valorTotal: 0,
    status: "valido",
    dataValidacao: new Date().toISOString(),
    conteudoXML: conteudo,
    erros: [],
    validacoes: {
      estruturaValida: true,
      cnpjValido: true,
      chaveValida: true,
      assinaturaPresente: true,
      totaisConferem: true
    }
  };

  // 1. Validar estrutura XML
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(conteudo, "text/xml");
    const erroXML = xmlDoc.getElementsByTagName("parsererror");
    
    if (erroXML.length > 0) {
      resultado.validacoes.estruturaValida = false;
      resultado.erros.push({
        codigo: "E000",
        campo: "XML",
        mensagem: "Estrutura XML inválida ou mal formatada"
      });
      resultado.status = "erro";
      return resultado;
    }
  } catch (e) {
    resultado.validacoes.estruturaValida = false;
    resultado.erros.push({
      codigo: "E000",
      campo: "XML",
      mensagem: "Erro ao processar arquivo XML"
    });
    resultado.status = "erro";
    return resultado;
  }

  // 2. Extrair informações
  resultado.cnpj = extrairCNPJ(conteudo);
  resultado.chaveAcesso = extrairChave(conteudo);
  resultado.numero = extrairNumero(conteudo);
  resultado.valorTotal = extrairValorTotal(conteudo);
  resultado.dataEmissao = extrairDataEmissao(conteudo);

  // 3. Validar CNPJ
  if (!validarCNPJ(resultado.cnpj)) {
    resultado.validacoes.cnpjValido = false;
    resultado.erros.push({
      codigo: "E001",
      campo: "CNPJ",
      mensagem: "CNPJ inválido - dígitos verificadores incorretos",
      valorInformado: resultado.cnpj
    });
    resultado.status = "erro";
  }

  // 4. Validar chave de acesso
  if (!resultado.chaveAcesso || resultado.chaveAcesso.length !== 44) {
    resultado.validacoes.chaveValida = false;
    resultado.erros.push({
      codigo: "E003",
      campo: "Chave",
      mensagem: "Chave de acesso deve ter exatamente 44 dígitos",
      valorInformado: resultado.chaveAcesso || "não encontrada"
    });
    resultado.status = "erro";
  }

  // 5. Verificar assinatura
  if (!conteudo.includes("<Signature") && !conteudo.includes("<signature")) {
    resultado.validacoes.assinaturaPresente = false;
    resultado.erros.push({
      codigo: "E004",
      campo: "Assinatura",
      mensagem: "Assinatura digital não encontrada no XML"
    });
    resultado.status = "erro";
  }

  // 6. Validar valor total
  if (resultado.valorTotal <= 0) {
    resultado.validacoes.totaisConferem = false;
    resultado.erros.push({
      codigo: "E005",
      campo: "Valor Total",
      mensagem: "Valor total da nota inválido",
      valorInformado: resultado.valorTotal.toString()
    });
    resultado.status = "erro";
  }

  return resultado;
}

export function useValidacoesNF() {
  const [validacoes, setValidacoes] = useState<ValidacaoNF[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setValidacoes(JSON.parse(stored));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validacoesDemo));
      setValidacoes(validacoesDemo);
    }
  }, []);

  const adicionarValidacao = (validacao: ValidacaoNF) => {
    const novasValidacoes = [validacao, ...validacoes];
    setValidacoes(novasValidacoes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novasValidacoes));
  };

  const getContadores = () => {
    const validadas = validacoes.filter(v => v.status === 'valido').length;
    const comErro = validacoes.filter(v => v.status === 'erro').length;
    const pendentes = validacoes.filter(v => v.status === 'pendente').length;
    return { validadas, comErro, pendentes };
  };

  return {
    validacoes,
    adicionarValidacao,
    getContadores
  };
}
