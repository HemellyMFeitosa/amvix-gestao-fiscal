import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EventoReinf, tiposEventos } from "@/hooks/useEFDReinf";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ReinfEventDetailsModalProps {
  open: boolean;
  onClose: () => void;
  evento: EventoReinf | null;
  onReenviar: (evento: EventoReinf) => void;
}

const ReinfEventDetailsModal = ({ open, onClose, evento, onReenviar }: ReinfEventDetailsModalProps) => {
  if (!evento) return null;

  const eventoNome = tiposEventos.find(t => t.codigo === evento.tipo)?.nome || evento.tipo;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Evento {evento.tipo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Tipo:</span>
              <span className="text-sm font-medium text-right max-w-md">{eventoNome}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Competência:</span>
              <span className="text-sm font-medium">{evento.competencia}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Data de Envio:</span>
              <span className="text-sm font-medium">{evento.dataEnvio}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Protocolo:</span>
              <span className="text-sm font-mono">{evento.protocolo}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge 
                variant={
                  evento.status === "Aceito" ? "default" : 
                  evento.status === "Pendente" ? "outline" : 
                  "destructive"
                }
                className={
                  evento.status === "Aceito" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                  evento.status === "Pendente" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                  ""
                }
              >
                {evento.status}
              </Badge>
            </div>
          </div>

          {(evento.dataProcessamento || evento.recibo || evento.hash) && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Informações Adicionais</h4>
                <div className="space-y-2">
                  {evento.dataProcessamento && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Data de Processamento:</span>
                      <span className="text-sm">{evento.dataProcessamento}</span>
                    </div>
                  )}
                  
                  {evento.recibo && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Recibo:</span>
                      <span className="text-sm font-mono">{evento.recibo}</span>
                    </div>
                  )}
                  
                  {evento.hash && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Hash:</span>
                      <span className="text-sm font-mono">{evento.hash}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {evento.status === "Rejeitado" && evento.motivosRejeicao && (
            <>
              <Separator />
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-red-400 font-semibold">Motivos da Rejeição:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 ml-7">
                  {evento.motivosRejeicao.map((motivo, index) => (
                    <li key={index} className="text-sm text-muted-foreground">{motivo}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          {evento.status === "Rejeitado" && (
            <Button 
              variant="outline"
              onClick={() => {
                onReenviar(evento);
                onClose();
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reenviar
            </Button>
          )}
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReinfEventDetailsModal;
