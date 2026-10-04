import { useState, useEffect } from "react";

export interface LogLGPD {
  id: number;
  timestamp: string;
  usuario: string;
  acao: "leitura" | "criacao" | "alteracao" | "exclusao";
  entidade: string;
  registroId?: number | string;
  dadosAntigos?: any;
  dadosNovos?: any;
  ip?: string;
  navegador: string;
}

export interface SolicitacaoLGPD {
  id: number;
  tipo: "exportar" | "corrigir" | "excluir" | "revogar" | "confirmar";
  status: "pendente" | "processando" | "concluido" | "rejeitado";
  dataSolicitacao: string;
  dataConclusao?: string;
  descricao: string;
  dados?: any;
}

const LOGS_KEY = "lgpd_logs";
const SOLICITACOES_KEY = "lgpd_solicitacoes";
const MAX_LOGS = 1000;

export const useLGPDLogs = () => {
  const [logs, setLogs] = useState<LogLGPD[]>(() => {
    const stored = localStorage.getItem(LOGS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoLGPD[]>(() => {
    const stored = localStorage.getItem(SOLICITACOES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(SOLICITACOES_KEY, JSON.stringify(solicitacoes));
  }, [solicitacoes]);

  const registrarLog = (log: Omit<LogLGPD, "id" | "timestamp" | "navegador">) => {
    const novoLog: LogLGPD = {
      ...log,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      navegador: navigator.userAgent,
    };
    setLogs(prev => [novoLog, ...prev]);
  };

  const criarSolicitacao = (
    tipo: SolicitacaoLGPD["tipo"],
    descricao: string,
    dados?: any
  ): number => {
    const novaSolicitacao: SolicitacaoLGPD = {
      id: Date.now(),
      tipo,
      status: "pendente",
      dataSolicitacao: new Date().toISOString(),
      descricao,
      dados,
    };
    setSolicitacoes(prev => [novaSolicitacao, ...prev]);
    return novaSolicitacao.id;
  };

  const atualizarSolicitacao = (
    id: number,
    status: SolicitacaoLGPD["status"],
    dados?: any
  ) => {
    setSolicitacoes(prev =>
      prev.map(s =>
        s.id === id
          ? {
              ...s,
              status,
              dataConclusao: status === "concluido" ? new Date().toISOString() : s.dataConclusao,
              dados: dados || s.dados,
            }
          : s
      )
    );
  };

  const exportarDados = () => {
    const usuarioLogado = localStorage.getItem("usuario_logado");
    const notificacoes = localStorage.getItem("notificacoes_sistema");
    const consentimento = localStorage.getItem("lgpd_consentimento");

    const dadosExportacao = {
      usuario: usuarioLogado ? JSON.parse(usuarioLogado) : null,
      notificacoes: notificacoes ? JSON.parse(notificacoes) : [],
      consentimento: consentimento ? JSON.parse(consentimento) : null,
      logs: logs,
      solicitacoes: solicitacoes,
      dataExportacao: new Date().toISOString(),
    };

    return dadosExportacao;
  };

  const limparLogs = () => {
    setLogs([]);
  };

  return {
    logs,
    solicitacoes,
    registrarLog,
    criarSolicitacao,
    atualizarSolicitacao,
    exportarDados,
    limparLogs,
  };
};
