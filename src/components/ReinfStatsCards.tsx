import { Card } from "@/components/ui/card";
import { Send, Clock, CheckCircle, XCircle } from "lucide-react";

interface ReinfStatsCardsProps {
  estatisticas: {
    total: number;
    pendentes: number;
    aceitos: number;
    rejeitados: number;
  };
}

const ReinfStatsCards = ({ estatisticas }: ReinfStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Send className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Eventos Enviados</div>
            <div className="text-3xl font-bold">{estatisticas.total}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Pendentes</div>
            <div className="text-3xl font-bold text-yellow-400">{estatisticas.pendentes}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Aceitos</div>
            <div className="text-3xl font-bold text-green-400">{estatisticas.aceitos}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Rejeitados</div>
            <div className="text-3xl font-bold text-red-400">{estatisticas.rejeitados}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReinfStatsCards;
