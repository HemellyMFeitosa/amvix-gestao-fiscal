import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";

export interface ArquivoXML {
  id: string;
  nome: string;
  tipo: "NF-e" | "NFS-e" | "NFC-e";
  data: string;
  dataOriginal: Date;
  tamanho: string;
  tamanhoBytes: number;
  chave: string;
}

const DADOS_MOCK: ArquivoXML[] = [
  {
    id: "1",
    nome: "NFe-20251015-001234.xml",
    tipo: "NF-e",
    data: "15/10/2025",
    dataOriginal: new Date("2025-10-15"),
    tamanho: "28 KB",
    tamanhoBytes: 28672,
    chave: "3525...4581"
  },
  {
    id: "2",
    nome: "NFSe-20251015-005678.xml",
    tipo: "NFS-e",
    data: "15/10/2025",
    dataOriginal: new Date("2025-10-15"),
    tamanho: "15 KB",
    tamanhoBytes: 15360,
    chave: "3525...7823"
  },
  {
    id: "3",
    nome: "NFCe-20251014-009876.xml",
    tipo: "NFC-e",
    data: "14/10/2025",
    dataOriginal: new Date("2025-10-14"),
    tamanho: "12 KB",
    tamanhoBytes: 12288,
    chave: "3525...2341"
  },
  {
    id: "4",
    nome: "NFe-20251014-001233.xml",
    tipo: "NF-e",
    data: "14/10/2025",
    dataOriginal: new Date("2025-10-14"),
    tamanho: "32 KB",
    tamanhoBytes: 32768,
    chave: "3525...8765"
  },
  {
    id: "5",
    nome: "NFe-20250914-002345.xml",
    tipo: "NF-e",
    data: "14/09/2025",
    dataOriginal: new Date("2025-09-14"),
    tamanho: "25 KB",
    tamanhoBytes: 25600,
    chave: "3525...9012"
  },
  {
    id: "6",
    nome: "NFSe-20250913-006789.xml",
    tipo: "NFS-e",
    data: "13/09/2025",
    dataOriginal: new Date("2025-09-13"),
    tamanho: "18 KB",
    tamanhoBytes: 18432,
    chave: "3525...3456"
  },
  {
    id: "7",
    nome: "NFCe-20250815-001111.xml",
    tipo: "NFC-e",
    data: "15/08/2025",
    dataOriginal: new Date("2025-08-15"),
    tamanho: "10 KB",
    tamanhoBytes: 10240,
    chave: "3525...7890"
  },
  {
    id: "8",
    nome: "NFe-20250715-003456.xml",
    tipo: "NF-e",
    data: "15/07/2025",
    dataOriginal: new Date("2025-07-15"),
    tamanho: "30 KB",
    tamanhoBytes: 30720,
    chave: "3525...1234"
  }
];

export const useArquivosXML = () => {
  const [arquivos, setArquivos] = useState<ArquivoXML[]>(DADOS_MOCK);
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");
  const [periodoFiltro, setPeriodoFiltro] = useState<string>("ultimo-mes");

  const arquivosFiltrados = useMemo(() => {
    let resultado = [...arquivos];

    // Filtro de busca
    if (busca) {
      const buscaLower = busca.toLowerCase();
      resultado = resultado.filter(
        (arq) =>
          arq.nome.toLowerCase().includes(buscaLower) ||
          arq.chave.toLowerCase().includes(buscaLower)
      );
    }

    // Filtro de tipo
    if (tipoFiltro !== "todos") {
      resultado = resultado.filter((arq) => arq.tipo === tipoFiltro);
    }

    // Filtro de período
    if (periodoFiltro !== "todos") {
      const hoje = new Date();
      const dataLimite = new Date();

      switch (periodoFiltro) {
        case "ultimo-mes":
          dataLimite.setMonth(hoje.getMonth() - 1);
          break;
        case "3-meses":
          dataLimite.setMonth(hoje.getMonth() - 3);
          break;
        case "6-meses":
          dataLimite.setMonth(hoje.getMonth() - 6);
          break;
        case "ultimo-ano":
          dataLimite.setFullYear(hoje.getFullYear() - 1);
          break;
      }

      resultado = resultado.filter((arq) => arq.dataOriginal >= dataLimite);
    }

    return resultado;
  }, [arquivos, busca, tipoFiltro, periodoFiltro]);

  const excluirArquivo = (id: string) => {
    const arquivo = arquivos.find((a) => a.id === id);
    setArquivos((prev) => prev.filter((a) => a.id !== id));
    
    toast({
      title: "Arquivo excluído",
      description: `${arquivo?.nome} foi removido com sucesso.`,
    });
  };

  const downloadArquivo = (arquivo: ArquivoXML) => {
    // Simular download
    toast({
      title: "Download iniciado",
      description: `Baixando ${arquivo.nome}...`,
    });
  };

  const estatisticas = useMemo(() => {
    const totalBytes = arquivos.reduce((sum, arq) => sum + arq.tamanhoBytes, 0);
    const espacoUsadoGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
    
    const hoje = new Date();
    const mesAtual = arquivos.filter(
      (arq) =>
        arq.dataOriginal.getMonth() === hoje.getMonth() &&
        arq.dataOriginal.getFullYear() === hoje.getFullYear()
    ).length;

    return {
      totalArmazenado: arquivos.length,
      espacoUsado: `${espacoUsadoGB} GB`,
      esteMes: mesAtual,
      espacoDisponivel: `${(10 - parseFloat(espacoUsadoGB)).toFixed(1)} GB`,
    };
  }, [arquivos]);

  return {
    arquivos: arquivosFiltrados,
    busca,
    setBusca,
    tipoFiltro,
    setTipoFiltro,
    periodoFiltro,
    setPeriodoFiltro,
    excluirArquivo,
    downloadArquivo,
    estatisticas,
  };
};
