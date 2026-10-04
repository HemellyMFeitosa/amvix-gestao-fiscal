import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NovaIntegracaoERPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelecionar: (tipo: string, nome: string) => void;
}

const sistemasERP = [
  { id: "sap", nome: "SAP Business One", descricao: "Sistema ERP completo" },
  { id: "totvs", nome: "TOTVS Protheus", descricao: "ERP da TOTVS" },
  { id: "sankhya", nome: "Sankhya", descricao: "Gestão empresarial" },
  { id: "bling", nome: "Bling ERP", descricao: "ERP para e-commerce" },
  { id: "omie", nome: "Omie", descricao: "Gestão online" },
  { id: "contaazul", nome: "Conta Azul", descricao: "Gestão financeira" },
  { id: "senior", nome: "Senior Sistemas", descricao: "ERP corporativo" },
  { id: "outro", nome: "Outro / Personalizado", descricao: "Configuração customizada" },
];

export const NovaIntegracaoERPDialog = ({
  open,
  onOpenChange,
  onSelecionar,
}: NovaIntegracaoERPDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Integração ERP</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Selecione o Sistema ERP:</p>

          <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-2">
            {sistemasERP.map((sistema) => (
              <Card
                key={sistema.id}
                className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => {
                  onSelecionar(sistema.id, sistema.nome);
                  onOpenChange(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📊</div>
                  <div>
                    <h4 className="font-semibold">{sistema.nome}</h4>
                    <p className="text-sm text-muted-foreground">{sistema.descricao}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
