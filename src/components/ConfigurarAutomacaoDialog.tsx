import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AutomacaoRPA } from "@/hooks/useAutomacoesRPA";
import { toast } from "sonner";

interface ConfigurarAutomacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  automacao?: AutomacaoRPA;
  onSalvar: (id: number, dados: Partial<AutomacaoRPA>) => void;
  onTestar?: (id: number) => void;
}

export const ConfigurarAutomacaoDialog = ({
  open,
  onOpenChange,
  automacao,
  onSalvar,
  onTestar,
}: ConfigurarAutomacaoDialogProps) => {
  const handleSalvar = () => {
    toast.success("Configuração salva!");
    onOpenChange(false);
  };

  const handleTestar = () => {
    if (automacao && onTestar) {
      onTestar(automacao.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Automação: {automacao?.nome}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configuração Geral */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Configuração Geral</h3>
            <div className="space-y-4">
              <div>
                <Label>Nome da Automação</Label>
                <Input
                  defaultValue={automacao?.nome}
                  placeholder="Importação Automática NF-e"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  defaultValue={automacao?.descricao}
                  placeholder="Importa NF-e do e-mail automaticamente"
                  rows={2}
                />
              </div>
              <div>
                <Label className="mb-3 block">Status</Label>
                <RadioGroup defaultValue={automacao?.status || "ativo"}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ativo" id="ativo" />
                    <Label htmlFor="ativo">Ativa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pausado" id="pausado" />
                    <Label htmlFor="pausado">Pausada</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Trigger (Gatilho) */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Trigger (Gatilho)</h3>
            <div className="space-y-4">
              <div>
                <Label>Quando executar</Label>
                <Select defaultValue="agendamento">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendamento">Agendamento - Periodicamente</SelectItem>
                    <SelectItem value="email">Ao receber e-mail</SelectItem>
                    <SelectItem value="nfe">Ao emitir nota fiscal</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Frequência</Label>
                <Select defaultValue="1h">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5min">A cada 5 minutos</SelectItem>
                    <SelectItem value="15min">A cada 15 minutos</SelectItem>
                    <SelectItem value="30min">A cada 30 minutos</SelectItem>
                    <SelectItem value="1h">A cada hora</SelectItem>
                    <SelectItem value="dia">Uma vez por dia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Horário de execução</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Das</span>
                  <Input type="time" defaultValue="08:00" className="w-32" />
                  <span className="text-sm">às</span>
                  <Input type="time" defaultValue="18:00" className="w-32" />
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia, idx) => (
                    <div key={dia} className="flex items-center space-x-1">
                      <Checkbox id={`dia-${idx}`} defaultChecked={idx < 5} />
                      <Label htmlFor={`dia-${idx}`} className="font-normal text-sm">
                        {dia}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ação */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Ação</h3>
            <div className="space-y-4">
              <div className="text-sm space-y-3 bg-muted/30 p-4 rounded-lg">
                <p className="font-medium">O que fazer:</p>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Conectar na caixa de e-mail</li>
                  <li>Buscar e-mails com anexos XML</li>
                  <li>Baixar anexos XML</li>
                  <li>Validar XMLs</li>
                  <li>Importar para o sistema</li>
                  <li>Marcar e-mail como lido</li>
                </ol>
              </div>
              <div>
                <Label>E-mail</Label>
                <Input placeholder="nfe@empresa.com.br" defaultValue="nfe@empresa.com.br" />
              </div>
            </div>
          </div>

          {/* Notificações */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Notificações</h3>
            <div className="space-y-3">
              <p className="text-sm">Notificar quando:</p>
              <div className="flex items-center space-x-2">
                <Checkbox id="notif-sucesso" defaultChecked />
                <Label htmlFor="notif-sucesso" className="font-normal">
                  Automação executada com sucesso
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="notif-erro" defaultChecked />
                <Label htmlFor="notif-erro" className="font-normal">
                  Erro na execução
                </Label>
              </div>
              <div className="mt-4">
                <Label>Enviar para</Label>
                <Input
                  type="email"
                  placeholder="admin@empresa.com.br"
                  defaultValue="admin@empresa.com.br"
                />
              </div>
            </div>
          </div>

          {/* Logs e Histórico */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Logs e Histórico</h3>
            <div className="flex items-center gap-2">
              <Label>Manter logs por</Label>
              <Select defaultValue="30">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="60">60</SelectItem>
                  <SelectItem value="90">90</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm">dias</span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="outline" onClick={handleTestar}>
              🧪 Testar Agora
            </Button>
            <Button onClick={handleSalvar} className="flex-1">
              💾 Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
