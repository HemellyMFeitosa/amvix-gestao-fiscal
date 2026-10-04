import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import SPEDStatsCards from "@/components/SPEDStatsCards";
import SPEDGenerator from "@/components/SPEDGenerator";
import SPEDHistory from "@/components/SPEDHistory";
import SPEDValidationModal from "@/components/SPEDValidationModal";
import { useSPEDFiscal, ArquivoSPED } from "@/hooks/useSPEDFiscal";

const SPEDFiscal = () => {
  const { historico, loading, estatisticas, gerarSPED, downloadSPED, validarSPED } = useSPEDFiscal();
  const [modalOpen, setModalOpen] = useState(false);
  const [resultadoValidacao, setResultadoValidacao] = useState<any>(null);

  const handleValidar = (arquivo: ArquivoSPED) => {
    const resultado = validarSPED(arquivo);
    setResultadoValidacao(resultado);
    setModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">SPED Fiscal</h1>
          <p className="text-muted-foreground">Geração de SPED</p>
        </div>

        <div className="mb-8">
          <SPEDStatsCards estatisticas={estatisticas} />
        </div>

        <div className="mb-6">
          <SPEDGenerator onGerar={gerarSPED} loading={loading} />
        </div>

        <SPEDHistory 
          historico={historico} 
          onDownload={downloadSPED}
          onValidar={handleValidar}
        />

        <SPEDValidationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          resultado={resultadoValidacao}
        />
      </div>
    </DashboardLayout>
  );
};

export default SPEDFiscal;