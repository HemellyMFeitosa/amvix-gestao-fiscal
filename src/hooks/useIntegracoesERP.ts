import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface IntegracaoERP {
  id: number;
  nome: string;
  tipo: string;
  status: "conectado" | "desconectado" | "erro";
  servidor?: string;
  porta?: number;
  banco?: string;
  usuario?: string;
  senha?: string;
  tipoConexao?: string;
  modulosSincronizar?: string[];
  frequencia?: string;
  horario?: { inicio: string; fim: string };
  ultimaSincronizacao: string;
  registrosSincronizados: number;
  errosRecentes: number;
  dataCriacao: string;
}

const STORAGE_KEY = "integracoes_erp";

const integracoesDemo: IntegracaoERP[] = [
  {
    id: 1,
    nome: "SAP Business One",
    tipo: "SAP",
    status: "conectado",
    ultimaSincronizacao: new Date(Date.now() - 5 * 60000).toISOString(),
    registrosSincronizados: 2847,
    errosRecentes: 0,
    dataCriacao: "2024-12-01T10:00:00",
  },
  {
    id: 2,
    nome: "TOTVS Protheus",
    tipo: "TOTVS",
    status: "conectado",
    ultimaSincronizacao: new Date(Date.now() - 10 * 60000).toISOString(),
    registrosSincronizados: 1542,
    errosRecentes: 0,
    dataCriacao: "2024-12-05T14:30:00",
  },
  {
    id: 3,
    nome: "Sankhya",
    tipo: "Sankhya",
    status: "desconectado",
    ultimaSincronizacao: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
    registrosSincronizados: 0,
    errosRecentes: 3,
    dataCriacao: "2024-11-20T09:15:00",
  },
  {
    id: 4,
    nome: "Bling ERP",
    tipo: "Bling",
    status: "conectado",
    ultimaSincronizacao: new Date(Date.now() - 8 * 60000).toISOString(),
    registrosSincronizados: 987,
    errosRecentes: 0,
    dataCriacao: "2024-12-10T16:45:00",
  },
];

export const useIntegracoesERP = () => {
  const [integracoes, setIntegracoes] = useState<IntegracaoERP[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setIntegracoes(JSON.parse(stored));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(integracoesDemo));
      setIntegracoes(integracoesDemo);
    }
  }, []);

  const salvarIntegracoes = (novasIntegracoes: IntegracaoERP[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novasIntegracoes));
    setIntegracoes(novasIntegracoes);
  };

  const adicionarIntegracao = (integracao: Omit<IntegracaoERP, "id" | "dataCriacao">) => {
    const novaIntegracao: IntegracaoERP = {
      ...integracao,
      id: Date.now(),
      dataCriacao: new Date().toISOString(),
    };
    const novasIntegracoes = [...integracoes, novaIntegracao];
    salvarIntegracoes(novasIntegracoes);
    toast.success("Integração adicionada com sucesso!");
    return novaIntegracao;
  };

  const atualizarIntegracao = (id: number, dados: Partial<IntegracaoERP>) => {
    const novasIntegracoes = integracoes.map((integracao) =>
      integracao.id === id ? { ...integracao, ...dados } : integracao
    );
    salvarIntegracoes(novasIntegracoes);
    toast.success("Integração atualizada!");
  };

  const sincronizar = async (id: number) => {
    const integracao = integracoes.find((i) => i.id === id);
    if (!integracao) return;

    toast.info(`Sincronizando com ${integracao.nome}...`);

    // Simular sincronização (2-3 segundos)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Simular dados sincronizados
    const novosRegistros = Math.floor(Math.random() * 200) + 50;
    const nfes = Math.floor(Math.random() * 20) + 5;
    const produtos = Math.floor(Math.random() * 150) + 30;
    const clientes = novosRegistros - nfes - produtos;

    atualizarIntegracao(id, {
      registrosSincronizados: integracao.registrosSincronizados + novosRegistros,
      ultimaSincronizacao: new Date().toISOString(),
    });

    toast.success("Sincronização concluída!", {
      description: `• ${novosRegistros} registros importados\n• ${nfes} notas fiscais\n• ${produtos} produtos atualizados\n• ${clientes} clientes sincronizados`,
    });
  };

  const reconectar = async (id: number) => {
    const integracao = integracoes.find((i) => i.id === id);
    if (!integracao) return;

    toast.info(`Reconectando com ${integracao.nome}...`);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    atualizarIntegracao(id, {
      status: "conectado",
      errosRecentes: 0,
      ultimaSincronizacao: new Date().toISOString(),
    });

    toast.success("Reconectado com sucesso!");
  };

  const calcularEstatisticas = () => {
    const totalSincronizacoes = integracoes
      .filter((i) => i.status === "conectado")
      .reduce((sum, i) => sum + i.registrosSincronizados, 0);

    const totalErros = integracoes.reduce((sum, i) => sum + i.errosRecentes, 0);

    const ultimaSincDatas = integracoes
      .map((i) => new Date(i.ultimaSincronizacao))
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => b.getTime() - a.getTime());

    const ultimaSinc = ultimaSincDatas.length > 0 ? ultimaSincDatas[0] : null;
    const minutosAtras = ultimaSinc
      ? Math.floor((Date.now() - ultimaSinc.getTime()) / 60000)
      : 0;

    return {
      totalSincronizacoes,
      totalErros,
      ultimaSinc: minutosAtras > 0 ? `Há ${minutosAtras} min` : "Agora",
    };
  };

  return {
    integracoes,
    adicionarIntegracao,
    atualizarIntegracao,
    sincronizar,
    reconectar,
    calcularEstatisticas,
  };
};
