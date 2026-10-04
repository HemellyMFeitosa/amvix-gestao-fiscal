import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NovaAutomacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelecionar: (template: string) => void;
}

const templates = [
  {
    id: "importacao_nfe",
    icon: "📥",
    nome: "Importação Automática de NF-e",
    descricao: "Importa XMLs do e-mail automaticamente",
  },
  {
    id: "sincronizacao",
    icon: "🔄",
    nome: "Sincronização com ERP",
    descricao: "Sincroniza dados periodicamente",
  },
  {
    id: "validacao",
    icon: "✅",
    nome: "Validação Automática de XMLs",
    descricao: "Valida XMLs recebidos",
  },
  {
    id: "backup",
    icon: "💾",
    nome: "Backup Automático",
    descricao: "Backup diário dos dados",
  },
  {
    id: "relatorios",
    icon: "📧",
    nome: "Envio de Relatórios por E-mail",
    descricao: "Envia relatórios programados",
  },
  {
    id: "sped",
    icon: "📊",
    nome: "Geração Automática de SPED",
    descricao: "Gera SPED no final do mês",
  },
  {
    id: "custom",
    icon: "🔧",
    nome: "Criar do Zero",
    descricao: "Configure manualmente",
  },
];

export const NovaAutomacaoDialog = ({
  open,
  onOpenChange,
  onSelecionar,
}: NovaAutomacaoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Nova Automação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Escolha um template ou crie do zero:
          </p>

          <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-2">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => {
                  onSelecionar(template.id);
                  onOpenChange(false);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{template.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{template.nome}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.descricao}
                    </p>
                    <Button size="sm" variant="outline">
                      {template.id === "custom" ? "Criar Personalizada" : "Usar Template"}
                    </Button>
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
