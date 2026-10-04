import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface AutomacaoRPA {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;
  status: "ativo" | "pausado" | "erro";
  execucoesHoje: number;
  execucoesTotal: number;
  taxaSucesso: number;
  tempoEconomizado: number; // em minutos
  ultimaExecucao: string | null;
  proximaExecucao?: string;
  dataCriacao: string;
}

const STORAGE_KEY = "automacoes_rpa";

const automacoesDemo: AutomacaoRPA[] = [
  {
    id: 1,
    nome: "Importação Automática NF-e",
    descricao: "Importa XMLs do e-mail automaticamente",
    tipo: "importacao_nfe",
    status: "ativo",
    execucoesHoje: 45,
    execucoesTotal: 1234,
    taxaSucesso: 100,
    tempoEconomizado: 120,
    ultimaExecucao: new Date(Date.now() - 30 * 60000).toISOString(),
    dataCriacao: "2024-11-01T09:00:00",
  },
  {
    id: 2,
    nome: "Sincronização ERP",
    descricao: "Sincroniza dados periodicamente",
    tipo: "sincronizacao",
    status: "ativo",
    execucoesHoje: 12,
    execucoesTotal: 456,
    taxaSucesso: 98,
    tempoEconomizado: 90,
    ultimaExecucao: new Date(Date.now() - 15 * 60000).toISOString(),
    dataCriacao: "2024-11-05T10:30:00",
  },
  {
    id: 3,
    nome: "Validação de XMLs",
    descricao: "Valida XMLs recebidos",
    tipo: "validacao",
    status: "pausado",
    execucoesHoje: 0,
    execucoesTotal: 234,
    taxaSucesso: 0,
    tempoEconomizado: 45,
    ultimaExecucao: null,
    dataCriacao: "2024-11-10T14:00:00",
  },
  {
    id: 4,
    nome: "Backup Automático",
    descricao: "Backup diário dos dados",
    tipo: "backup",
    status: "ativo",
    execucoesHoje: 2,
    execucoesTotal: 120,
    taxaSucesso: 100,
    tempoEconomizado: 60,
    ultimaExecucao: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    dataCriacao: "2024-10-20T08:00:00",
  },
];

export const useAutomacoesRPA = () => {
  const [automacoes, setAutomacoes] = useState<AutomacaoRPA[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAutomacoes(JSON.parse(stored));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(automacoesDemo));
      setAutomacoes(automacoesDemo);
    }
  }, []);

  const salvarAutomacoes = (novasAutomacoes: AutomacaoRPA[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novasAutomacoes));
    setAutomacoes(novasAutomacoes);
  };

  const adicionarAutomacao = (automacao: Omit<AutomacaoRPA, "id" | "dataCriacao">) => {
    const novaAutomacao: AutomacaoRPA = {
      ...automacao,
      id: Date.now(),
      dataCriacao: new Date().toISOString(),
    };
    const novasAutomacoes = [...automacoes, novaAutomacao];
    salvarAutomacoes(novasAutomacoes);
    toast.success("Automação criada com sucesso!");
    return novaAutomacao;
  };

  const atualizarAutomacao = (id: number, dados: Partial<AutomacaoRPA>) => {
    const novasAutomacoes = automacoes.map((automacao) =>
      automacao.id === id ? { ...automacao, ...dados } : automacao
    );
    salvarAutomacoes(novasAutomacoes);
  };

  const toggleStatus = (id: number) => {
    const automacao = automacoes.find((a) => a.id === id);
    if (!automacao) return;

    const novoStatus = automacao.status === "ativo" ? "pausado" : "ativo";
    atualizarAutomacao(id, { status: novoStatus });

    if (novoStatus === "ativo") {
      toast.success("Automação ativada!");
    } else {
      toast.info("Automação pausada");
    }
  };

  const executarAutomacao = async (id: number) => {
    const automacao = automacoes.find((a) => a.id === id);
    if (!automacao) return;

    toast.info(`🤖 Automação em execução`, {
      description: `${automacao.nome}\nProcessando...`,
    });

    // Simular execução
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const xmlsImportados = Math.floor(Math.random() * 20) + 5;
    const novaTaxaSucesso = automacao.execucoesHoje > 0 
      ? ((automacao.taxaSucesso * automacao.execucoesHoje + 100) / (automacao.execucoesHoje + 1))
      : 100;

    atualizarAutomacao(id, {
      execucoesHoje: automacao.execucoesHoje + 1,
      execucoesTotal: automacao.execucoesTotal + 1,
      taxaSucesso: Math.round(novaTaxaSucesso * 10) / 10,
      ultimaExecucao: new Date().toISOString(),
    });

    toast.success("Automação concluída", {
      description: `${automacao.nome}\n• ${xmlsImportados} XMLs importados\n• ${xmlsImportados} NF-e cadastradas\n• 0 erros`,
    });
  };

  const calcularEstatisticas = () => {
    const processosAtivos = automacoes.filter((a) => a.status === "ativo").length;
    const execucoesHoje = automacoes.reduce((sum, a) => sum + a.execucoesHoje, 0);
    
    const automacoesComExecucoes = automacoes.filter((a) => a.execucoesHoje > 0);
    const taxaSucesso = automacoesComExecucoes.length > 0
      ? automacoesComExecucoes.reduce((sum, a) => sum + a.taxaSucesso, 0) / automacoesComExecucoes.length
      : 0;

    const tempoTotal = automacoes.reduce((sum, a) => sum + a.tempoEconomizado, 0);
    const tempoHoras = Math.floor(tempoTotal / 60);

    return {
      processosAtivos,
      execucoesHoje,
      taxaSucesso: Math.round(taxaSucesso * 10) / 10,
      tempoEconomizado: `${tempoHoras}h`,
    };
  };

  return {
    automacoes,
    adicionarAutomacao,
    atualizarAutomacao,
    toggleStatus,
    executarAutomacao,
    calcularEstatisticas,
  };
};
