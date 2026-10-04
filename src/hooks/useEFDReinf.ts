import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export interface EventoReinf {
  id: number;
  tipo: string;
  competencia: string;
  dataEnvio: string;
  protocolo: string;
  status: "Aceito" | "Pendente" | "Rejeitado";
  recibo?: string;
  hash?: string;
  dataProcessamento?: string;
  motivosRejeicao?: string[];
}

export const tiposEventos = [
  { codigo: "R-1000", nome: "R-1000: Informações do Contribuinte" },
  { codigo: "R-1070", nome: "R-1070: Tabela de Processos Administrativos/Judiciais" },
  { codigo: "R-2010", nome: "R-2010: Serviços Tomados mediante Cessão de Mão de Obra" },
  { codigo: "R-2020", nome: "R-2020: Serviços Prestados mediante Cessão de Mão de Obra" },
  { codigo: "R-2030", nome: "R-2030: Recursos Recebidos por Associação Desportiva" },
  { codigo: "R-2040", nome: "R-2040: Recursos Repassados para Associação Desportiva" },
  { codigo: "R-2050", nome: "R-2050: Comercialização da Produção por Produtor Rural PJ/Agroindústria" },
  { codigo: "R-2055", nome: "R-2055: Aquisição de Produção Rural" },
  { codigo: "R-2060", nome: "R-2060: CPRB - Contribuição Previdenciária sobre Receita Bruta" },
  { codigo: "R-2098", nome: "R-2098: Reabertura dos Eventos Periódicos" },
  { codigo: "R-2099", nome: "R-2099: Fechamento dos Eventos Periódicos" },
  { codigo: "R-3010", nome: "R-3010: Receita de Espetáculo Desportivo" },
  { codigo: "R-4010", nome: "R-4010: Pagamentos/Créditos a Beneficiário PF" },
  { codigo: "R-4020", nome: "R-4020: Pagamentos/Créditos a Beneficiário PJ" },
  { codigo: "R-4040", nome: "R-4040: Pagamentos/Créditos a Beneficiários Não Identificados" },
  { codigo: "R-4080", nome: "R-4080: Retenção no Recebimento" },
  { codigo: "R-4099", nome: "R-4099: Fechamento/Reabertura dos Eventos da Série R-4000" },
  { codigo: "R-9000", nome: "R-9000: Exclusão de Eventos" }
];

export const competencias = [
  "10/2025", "09/2025", "08/2025", "07/2025", 
  "06/2025", "05/2025", "04/2025", "03/2025",
  "02/2025", "01/2025", "12/2024", "11/2024"
];

const eventosIniciaisData: EventoReinf[] = [
  {
    id: 1,
    tipo: "R-2010",
    competencia: "10/2025",
    dataEnvio: "15/10/2025 13:45",
    protocolo: "1.2.987654.321",
    status: "Aceito",
    recibo: "REC-987654321",
    hash: "a1b2c3d4e5f6",
    dataProcessamento: "15/10/2025 13:46"
  },
  {
    id: 2,
    tipo: "R-2020",
    competencia: "10/2025",
    dataEnvio: "15/10/2025 13:30",
    protocolo: "1.2.987654.320",
    status: "Aceito",
    recibo: "REC-987654320",
    hash: "f6e5d4c3b2a1",
    dataProcessamento: "15/10/2025 13:31"
  },
  {
    id: 3,
    tipo: "R-1000",
    competencia: "10/2025",
    dataEnvio: "14/10/2025 10:15",
    protocolo: "1.2.987654.319",
    status: "Aceito",
    recibo: "REC-987654319",
    hash: "1a2b3c4d5e6f",
    dataProcessamento: "14/10/2025 10:16"
  }
];

const gerarProtocolo = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `1.2.${timestamp}.${random}`;
};

const gerarHash = () => {
  return Math.random().toString(36).substring(2, 14);
};

export const useEFDReinf = () => {
  const [eventos, setEventos] = useState<EventoReinf[]>(eventosIniciaisData);
  const [loading, setLoading] = useState(false);
  const [conexaoOnline, setConexaoOnline] = useState(true);

  // Simular verificação de conexão
  useEffect(() => {
    const checkConnection = setInterval(() => {
      setConexaoOnline(Math.random() > 0.1); // 90% de chance de estar online
    }, 30000); // Verificar a cada 30 segundos

    return () => clearInterval(checkConnection);
  }, []);

  // Processar eventos pendentes automaticamente
  useEffect(() => {
    const processPendingEvents = setInterval(() => {
      setEventos(prevEventos => {
        return prevEventos.map(evento => {
          if (evento.status === "Pendente" && !evento.dataProcessamento) {
            // 20% de chance de rejeição
            const isRejeitado = Math.random() < 0.2;
            const novoStatus: "Aceito" | "Rejeitado" = isRejeitado ? "Rejeitado" : "Aceito";
            
            const eventoAtualizado: EventoReinf = {
              ...evento,
              status: novoStatus,
              dataProcessamento: new Date().toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              recibo: `REC-${Math.floor(Math.random() * 1000000000)}`,
              motivosRejeicao: isRejeitado ? [
                "901: Erro de validação do XML",
                "902: CNPJ inválido"
              ] : undefined
            };

            toast({
              title: `Evento ${novoStatus}`,
              description: `O evento ${evento.tipo} foi ${novoStatus.toLowerCase()}. Protocolo: ${evento.protocolo}`,
              variant: isRejeitado ? "destructive" : "default",
            });

            return eventoAtualizado;
          }
          return evento;
        });
      });
    }, 5000); // Verificar a cada 5 segundos

    return () => clearInterval(processPendingEvents);
  }, []);

  const calcularEstatisticas = () => {
    const total = eventos.length;
    const pendentes = eventos.filter(e => e.status === "Pendente").length;
    const aceitos = eventos.filter(e => e.status === "Aceito").length;
    const rejeitados = eventos.filter(e => e.status === "Rejeitado").length;

    return { total, pendentes, aceitos, rejeitados };
  };

  const enviarEvento = async (tipo: string, competencia: string) => {
    // Verificar se já existe evento do mesmo tipo e competência
    const jaExiste = eventos.some(
      e => e.tipo === tipo && e.competencia === competencia
    );

    if (jaExiste) {
      toast({
        title: "Evento já existe",
        description: "Já existe um evento deste tipo para esta competência",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);

    // Simular envio (2-3 segundos)
    await new Promise(resolve => setTimeout(resolve, 2500));

    const protocolo = gerarProtocolo();
    const novoEvento: EventoReinf = {
      id: Date.now(),
      tipo,
      competencia,
      dataEnvio: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      protocolo,
      status: "Pendente",
      hash: gerarHash(),
    };

    setEventos([novoEvento, ...eventos]);
    setLoading(false);

    toast({
      title: "Evento enviado com sucesso!",
      description: `Protocolo: ${protocolo}`,
    });

    return true;
  };

  const reenviarEvento = async (evento: EventoReinf) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const novoProtocolo = gerarProtocolo();
    const eventoAtualizado: EventoReinf = {
      ...evento,
      id: Date.now(),
      protocolo: novoProtocolo,
      status: "Pendente",
      dataEnvio: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      dataProcessamento: undefined,
      recibo: undefined,
      motivosRejeicao: undefined,
    };

    setEventos([eventoAtualizado, ...eventos]);
    setLoading(false);

    toast({
      title: "Evento reenviado com sucesso!",
      description: `Novo protocolo: ${novoProtocolo}`,
    });
  };

  const getUltimoEvento = () => {
    if (eventos.length === 0) return null;
    return eventos[0];
  };

  return {
    eventos,
    loading,
    conexaoOnline,
    estatisticas: calcularEstatisticas(),
    enviarEvento,
    reenviarEvento,
    ultimoEvento: getUltimoEvento(),
  };
};
