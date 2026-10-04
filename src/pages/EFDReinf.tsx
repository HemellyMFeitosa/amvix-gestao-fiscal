import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ReinfStatsCards from "@/components/ReinfStatsCards";
import ReinfEventForm from "@/components/ReinfEventForm";
import ReinfTransmissionStatus from "@/components/ReinfTransmissionStatus";
import ReinfEventsTable from "@/components/ReinfEventsTable";
import ReinfEventDetailsModal from "@/components/ReinfEventDetailsModal";
import { useEFDReinf, EventoReinf } from "@/hooks/useEFDReinf";

const EFDReinf = () => {
  const { eventos, loading, conexaoOnline, estatisticas, enviarEvento, reenviarEvento, ultimoEvento } = useEFDReinf();
  const [modalOpen, setModalOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoReinf | null>(null);

  const handleEventoClick = (evento: EventoReinf) => {
    setEventoSelecionado(evento);
    setModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">EFD-Reinf</h1>
          <p className="text-muted-foreground">Escrituração fiscal digital</p>
        </div>

        <div className="mb-8">
          <ReinfStatsCards estatisticas={estatisticas} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ReinfEventForm onEnviar={enviarEvento} loading={loading} />
          <ReinfTransmissionStatus conexaoOnline={conexaoOnline} ultimoEvento={ultimoEvento} />
        </div>

        <ReinfEventsTable eventos={eventos} onEventoClick={handleEventoClick} />

        <ReinfEventDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          evento={eventoSelecionado}
          onReenviar={reenviarEvento}
        />
      </div>
    </DashboardLayout>
  );
};

export default EFDReinf;