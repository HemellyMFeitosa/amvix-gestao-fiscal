import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export interface ArquivoSPED {
  id: number;
  periodo: string;
  perfil: string;
  dataGeracao: string;
  tamanho: string;
  validado: boolean;
}

const historicoInicial: ArquivoSPED[] = [
  {
    id: 1,
    periodo: "Outubro/2025",
    perfil: "A",
    dataGeracao: "15/10/2025 10:30",
    tamanho: "2.4",
    validado: true,
  },
  {
    id: 2,
    periodo: "Setembro/2025",
    perfil: "A",
    dataGeracao: "10/10/2025 14:15",
    tamanho: "2.1",
    validado: true,
  },
  {
    id: 3,
    periodo: "Agosto/2025",
    perfil: "A",
    dataGeracao: "12/09/2025 09:45",
    tamanho: "2.3",
    validado: true,
  },
  {
    id: 4,
    periodo: "Julho/2025",
    perfil: "A",
    dataGeracao: "08/08/2025 11:20",
    tamanho: "1.9",
    validado: true,
  },
];

export const useSPEDFiscal = () => {
  const [historico, setHistorico] = useState<ArquivoSPED[]>(historicoInicial);
  const [loading, setLoading] = useState(false);

  const calcularEstatisticas = () => {
    const total = historico.length;
    const mesAtual = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    const esteMes = historico.filter(arquivo => {
      const [mes, ano] = arquivo.periodo.split('/');
      const arquivoData = `${mes.toLowerCase()}/${ano}`;
      return arquivoData.includes(mesAtual.split(' ')[0]);
    }).length;
    
    const totalRegistros = historico.reduce((acc, arquivo) => {
      return acc + Math.floor(parseFloat(arquivo.tamanho) * 3500); // Estimativa de registros
    }, 0);

    const ultimoEnvio = historico.length > 0 ? historico[0].dataGeracao.split(' ')[0] : '10/10/25';

    return {
      total,
      esteMes,
      totalRegistros,
      ultimoEnvio,
    };
  };

  const gerarSPED = async (periodo: string, perfil: string) => {
    // Verificar se já existe SPED para o período
    const jaExiste = historico.some(arquivo => arquivo.periodo === periodo);
    
    if (jaExiste) {
      toast({
        title: "Erro ao gerar SPED",
        description: `Já existe um SPED gerado para ${periodo}`,
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);

    // Simular geração (2-3 segundos)
    await new Promise(resolve => setTimeout(resolve, 2500));

    const novoArquivo: ArquivoSPED = {
      id: Date.now(),
      periodo,
      perfil,
      dataGeracao: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      tamanho: (Math.random() * (2.5 - 1.8) + 1.8).toFixed(1),
      validado: true,
    };

    setHistorico([novoArquivo, ...historico]);
    setLoading(false);

    toast({
      title: "SPED gerado com sucesso!",
      description: `Arquivo SPED para ${periodo} foi gerado e está pronto para download.`,
    });

    return true;
  };

  const downloadSPED = (arquivo: ArquivoSPED) => {
    toast({
      title: "Download iniciado",
      description: `Baixando SPED ${arquivo.periodo}...`,
    });
    
    // Simular download
    console.log('Baixando arquivo:', arquivo);
  };

  const validarSPED = (arquivo: ArquivoSPED) => {
    return {
      periodo: arquivo.periodo,
      valido: arquivo.validado,
      verificacoes: [
        { item: "Estrutura do arquivo validada", status: true },
        { item: "Registros obrigatórios presentes", status: true },
        { item: "Dados fiscais consistentes", status: true },
        { item: "Totalizadores conferidos", status: true },
      ],
      erros: arquivo.validado ? [] : [
        "Registro C100: Campo obrigatório não preenchido",
        "Registro E110: Valor inválido no campo VL_TOT_CREDITOS",
      ],
    };
  };

  return {
    historico,
    loading,
    estatisticas: calcularEstatisticas(),
    gerarSPED,
    downloadSPED,
    validarSPED,
  };
};
