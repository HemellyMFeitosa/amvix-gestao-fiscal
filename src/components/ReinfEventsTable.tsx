import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EventoReinf } from "@/hooks/useEFDReinf";

interface ReinfEventsTableProps {
  eventos: EventoReinf[];
  onEventoClick: (evento: EventoReinf) => void;
}

const ReinfEventsTable = ({ eventos, onEventoClick }: ReinfEventsTableProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">Eventos Recentes</h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Competência</TableHead>
              <TableHead>Data Envio</TableHead>
              <TableHead>Protocolo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventos.map((evento) => (
              <TableRow 
                key={evento.id}
                onClick={() => onEventoClick(evento)}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <TableCell className="font-medium">{evento.tipo}</TableCell>
                <TableCell>{evento.competencia}</TableCell>
                <TableCell>{evento.dataEnvio}</TableCell>
                <TableCell className="font-mono text-sm">{evento.protocolo}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      evento.status === "Aceito" ? "default" : 
                      evento.status === "Pendente" ? "outline" : 
                      "destructive"
                    }
                    className={
                      evento.status === "Aceito" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      evento.status === "Pendente" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse" :
                      ""
                    }
                  >
                    {evento.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ReinfEventsTable;
