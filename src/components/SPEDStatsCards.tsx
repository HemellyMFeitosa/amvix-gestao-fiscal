import { Card } from "@/components/ui/card";
import { Database, FileSpreadsheet, TrendingUp, Calendar } from "lucide-react";

interface SPEDStatsCardsProps {
  estatisticas: {
    total: number;
    esteMes: number;
    totalRegistros: number;
    ultimoEnvio: string;
  };
}

const SPEDStatsCards = ({ estatisticas }: SPEDStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Arquivos Gerados</div>
            <div className="text-3xl font-bold">{estatisticas.total}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Este Mês</div>
            <div className="text-3xl font-bold text-green-400">{estatisticas.esteMes}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Registros</div>
            <div className="text-3xl font-bold text-blue-400">
              {estatisticas.totalRegistros.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Último Envio</div>
            <div className="text-lg font-bold">{estatisticas.ultimoEnvio}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SPEDStatsCards;
