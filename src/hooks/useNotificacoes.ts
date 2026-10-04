import { useState, useEffect } from "react";

export type TipoNotificacao = "info" | "success" | "warning" | "error";

export interface Notificacao {
  id: number;
  tipo: TipoNotificacao;
  titulo: string;
  descricao: string;
  timestamp: string;
  lida: boolean;
  link?: string;
}

const STORAGE_KEY = "notificacoes_sistema";
const MAX_NOTIFICACOES = 50;

const notificacoesDemo: Notificacao[] = [
  {
    id: 1,
    tipo: "info",
    titulo: "Nova NF-e emitida",
    descricao: "NF-e 12345 - R$ 1.500,00",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    lida: false,
  },
  {
    id: 2,
    tipo: "success",
    titulo: "Sincronização concluída",
    descricao: "SAP Business One - 145 registros",
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    lida: false,
  },
  {
    id: 3,
    tipo: "warning",
    titulo: "Certificado próximo do vencimento",
    descricao: "Certificado A1 vence em 30 dias",
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    lida: true,
  },
];

export const useNotificacoes = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notificacoesDemo));
    return notificacoesDemo;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notificacoes));
  }, [notificacoes]);

  const adicionarNotificacao = (notificacao: Omit<Notificacao, "id" | "timestamp" | "lida">) => {
    const nova: Notificacao = {
      ...notificacao,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      lida: false,
    };

    setNotificacoes(prev => {
      const atualizada = [nova, ...prev].slice(0, MAX_NOTIFICACOES);
      return atualizada;
    });
  };

  const marcarComoLida = (id: number) => {
    setNotificacoes(prev =>
      prev.map(n => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev =>
      prev.map(n => ({ ...n, lida: true }))
    );
  };

  const excluirNotificacao = (id: number) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  };

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  return {
    notificacoes,
    adicionarNotificacao,
    marcarComoLida,
    marcarTodasComoLidas,
    excluirNotificacao,
    naoLidas,
  };
};
