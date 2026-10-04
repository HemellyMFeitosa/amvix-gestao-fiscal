import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import XMLStatsCards from "@/components/XMLStatsCards";
import XMLFilters from "@/components/XMLFilters";
import XMLTable from "@/components/XMLTable";
import { useArquivosXML } from "@/hooks/useArquivosXML";

const ArmazenamentoXML = () => {
  const {
    arquivos,
    busca,
    setBusca,
    tipoFiltro,
    setTipoFiltro,
    periodoFiltro,
    setPeriodoFiltro,
    excluirArquivo,
    downloadArquivo,
    estatisticas,
  } = useArquivosXML();

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Armazenamento XML</h1>
          <p className="text-muted-foreground">Gestão de arquivos XML</p>
        </div>

        <XMLStatsCards
          totalArmazenado={estatisticas.totalArmazenado}
          espacoUsado={estatisticas.espacoUsado}
          esteMes={estatisticas.esteMes}
          espacoDisponivel={estatisticas.espacoDisponivel}
        />

        <Card className="p-6">
          <XMLFilters
            busca={busca}
            onBuscaChange={setBusca}
            tipoFiltro={tipoFiltro}
            onTipoChange={setTipoFiltro}
            periodoFiltro={periodoFiltro}
            onPeriodoChange={setPeriodoFiltro}
          />

          <XMLTable
            arquivos={arquivos}
            onDownload={downloadArquivo}
            onDelete={excluirArquivo}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ArmazenamentoXML;