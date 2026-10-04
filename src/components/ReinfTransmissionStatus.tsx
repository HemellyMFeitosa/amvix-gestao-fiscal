import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EventoReinf } from "@/hooks/useEFDReinf";

interface ReinfTransmissionStatusProps {
  conexaoOnline: boolean;
  ultimoEvento: EventoReinf | null;
}

const ReinfTransmissionStatus = ({ conexaoOnline, ultimoEvento }: ReinfTransmissionStatusProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">Status da Transmissão</h3>
      
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          {conexaoOnline ? (
            <>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="font-semibold text-green-400">Conexão Estabelecida</div>
                <div className="text-sm text-muted-foreground">Ambiente de produção online</div>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="font-semibold text-red-400">Sem Conexão</div>
                <div className="text-sm text-muted-foreground">Ambiente de produção offline</div>
              </div>
            </>
          )}
        </div>

        {ultimoEvento && (
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Último envio:</span>
              <span className="text-sm font-medium">{ultimoEvento.dataEnvio}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Protocolo:</span>
              <span className="text-sm font-mono">{ultimoEvento.protocolo}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Situação:</span>
              <Badge 
                variant={
                  ultimoEvento.status === "Aceito" ? "default" : 
                  ultimoEvento.status === "Pendente" ? "outline" : 
                  "destructive"
                }
                className={
                  ultimoEvento.status === "Aceito" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                  ultimoEvento.status === "Pendente" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                  ""
                }
              >
                {ultimoEvento.status}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReinfTransmissionStatus;
