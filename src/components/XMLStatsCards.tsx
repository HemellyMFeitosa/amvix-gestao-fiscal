import { Card } from "@/components/ui/card";
import { Database, HardDrive, TrendingUp, Archive } from "lucide-react";

interface XMLStatsCardsProps {
  totalArmazenado: number;
  espacoUsado: string;
  esteMes: number;
  espacoDisponivel: string;
}

const XMLStatsCards = ({
  totalArmazenado,
  espacoUsado,
  esteMes,
  espacoDisponivel,
}: XMLStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Database className="w-8 h-8 text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">Total Armazenado</div>
            <div className="text-2xl font-bold">{totalArmazenado.toLocaleString()}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <HardDrive className="w-8 h-8 text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">Espaço Usado</div>
            <div className="text-2xl font-bold">{espacoUsado}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <TrendingUp className="w-8 h-8 text-green-400" />
          <div>
            <div className="text-sm text-muted-foreground">Este Mês</div>
            <div className="text-2xl font-bold text-green-400">{esteMes}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Archive className="w-8 h-8 text-blue-400" />
          <div>
            <div className="text-sm text-muted-foreground">Espaço Disponível</div>
            <div className="text-2xl font-bold text-blue-400">{espacoDisponivel}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default XMLStatsCards;
