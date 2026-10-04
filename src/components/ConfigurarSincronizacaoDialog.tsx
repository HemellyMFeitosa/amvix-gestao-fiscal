import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ConfigurarSincronizacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConfigurarSincronizacaoDialog = ({
  open,
  onOpenChange,
}: ConfigurarSincronizacaoDialogProps) => {
  const handleSalvar = () => {
    toast.success("Configuração salva e ativada!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Sincronização Automática</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Configure a sincronização automática entre o AMVIX e seus sistemas ERP.
          </p>

          {/* Regras de Sincronização */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Regras de Sincronização</h3>
            <div className="space-y-3">
              <p className="text-sm mb-2">Sincronizar automaticamente:</p>
              {[
                { id: "nfe", label: "Novas NF-e emitidas" },
                { id: "produtos", label: "Produtos cadastrados/atualizados" },
                { id: "clientes", label: "Clientes novos" },
                { id: "pedidos", label: "Pedidos de venda" },
                { id: "estoque", label: "Movimentações de estoque" },
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox id={item.id} defaultChecked={["nfe", "produtos", "clientes"].includes(item.id)} />
                  <Label htmlFor={item.id} className="font-normal">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Direção da Sincronização */}
          <div>
            <Label className="mb-3 block">Direção da Sincronização</Label>
            <RadioGroup defaultValue="bidirecional">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bidirecional" id="bi" />
                <Label htmlFor="bi">Bidirecional (AMVIX ⇄ ERP)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amvix-erp" id="ae" />
                <Label htmlFor="ae">Apenas AMVIX → ERP</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="erp-amvix" id="ea" />
                <Label htmlFor="ea">Apenas ERP → AMVIX</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Frequência */}
          <div>
            <Label>Frequência</Label>
            <Select defaultValue="realtime">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Tempo Real</SelectItem>
                <SelectItem value="5min">A cada 5 minutos</SelectItem>
                <SelectItem value="15min">A cada 15 minutos</SelectItem>
                <SelectItem value="1h">A cada hora</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Em caso de conflito */}
          <div>
            <Label className="mb-3 block">Em caso de conflito</Label>
            <RadioGroup defaultValue="amvix">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amvix" id="pa" />
                <Label htmlFor="pa">Priorizar dados do AMVIX</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="erp" id="pe" />
                <Label htmlFor="pe">Priorizar dados do ERP</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="duplicar" id="pd" />
                <Label htmlFor="pd">Criar registro duplicado para revisão</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Notificações */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Notificações</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="notif-erro" defaultChecked />
                <Label htmlFor="notif-erro" className="font-normal">
                  Enviar e-mail em caso de erro
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="notif-sucesso" defaultChecked />
                <Label htmlFor="notif-sucesso" className="font-normal">
                  Notificar sincronizações bem-sucedidas
                </Label>
              </div>
              <div className="mt-4">
                <Label>E-mails para notificação</Label>
                <Input
                  type="email"
                  placeholder="admin@empresa.com.br"
                  defaultValue="admin@empresa.com.br"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSalvar} className="flex-1">
              💾 Salvar e Ativar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
