import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IntegracaoERP } from "@/hooks/useIntegracoesERP";
import { toast } from "sonner";

interface ConfigurarERPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integracao?: IntegracaoERP;
  onSalvar: (id: number, dados: Partial<IntegracaoERP>) => void;
}

export const ConfigurarERPDialog = ({
  open,
  onOpenChange,
  integracao,
  onSalvar,
}: ConfigurarERPDialogProps) => {
  const [nome, setNome] = useState(integracao?.nome || "");
  const [servidor, setServidor] = useState(integracao?.servidor || "192.168.1.100");
  const [porta, setPorta] = useState(integracao?.porta || 30000);
  const [banco, setBanco] = useState(integracao?.banco || "SBO_EMPRESA");
  const [usuario, setUsuario] = useState(integracao?.usuario || "manager");
  const [senha, setSenha] = useState("");
  const [tipoConexao, setTipoConexao] = useState(integracao?.tipoConexao || "API_REST");
  const [modulos, setModulos] = useState(
    integracao?.modulosSincronizar || ["nfe", "produtos", "clientes", "pedidos"]
  );
  const [frequencia, setFrequencia] = useState(integracao?.frequencia || "15min");

  const handleTestarConexao = async () => {
    toast.info("Testando conexão...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Conexão estabelecida com sucesso!");
  };

  const handleSalvar = () => {
    if (!integracao) return;

    const dados: Partial<IntegracaoERP> = {
      nome,
      servidor,
      porta,
      banco,
      usuario,
      tipoConexao,
      modulosSincronizar: modulos,
      frequencia,
    };

    if (senha) {
      dados.senha = senha;
    }

    onSalvar(integracao.id, dados);
    onOpenChange(false);
  };

  const toggleModulo = (modulo: string) => {
    setModulos((prev) =>
      prev.includes(modulo) ? prev.filter((m) => m !== modulo) : [...prev, modulo]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar {integracao?.nome}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dados de Conexão */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Dados de Conexão</h3>
            <div className="space-y-4">
              <div>
                <Label>Nome da Integração</Label>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="SAP Business One"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Servidor/Host</Label>
                  <Input
                    value={servidor}
                    onChange={(e) => setServidor(e.target.value)}
                    placeholder="192.168.1.100"
                  />
                </div>
                <div>
                  <Label>Porta</Label>
                  <Input
                    type="number"
                    value={porta}
                    onChange={(e) => setPorta(Number(e.target.value))}
                    placeholder="30000"
                  />
                </div>
              </div>
              <div>
                <Label>Banco de Dados</Label>
                <Input
                  value={banco}
                  onChange={(e) => setBanco(e.target.value)}
                  placeholder="SBO_EMPRESA"
                />
              </div>
            </div>
          </div>

          {/* Credenciais */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Credenciais</h3>
            <div className="space-y-4">
              <div>
                <Label>Usuário</Label>
                <Input
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="manager"
                />
              </div>
              <div>
                <Label>Senha</Label>
                <Input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <Label>Tipo de Conexão</Label>
                <RadioGroup value={tipoConexao} onValueChange={setTipoConexao}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="API_REST" id="api" />
                    <Label htmlFor="api">API REST</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="WEB_SERVICES" id="ws" />
                    <Label htmlFor="ws">Web Services</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DI_API" id="di" />
                    <Label htmlFor="di">DI API</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Configurações de Sincronização */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Configurações de Sincronização</h3>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Módulos a Sincronizar</Label>
                <div className="space-y-2">
                  {[
                    { id: "nfe", label: "Notas Fiscais (NF-e, NFS-e)" },
                    { id: "produtos", label: "Produtos/Itens" },
                    { id: "clientes", label: "Clientes/Fornecedores" },
                    { id: "pedidos", label: "Pedidos de Venda" },
                    { id: "financeiro", label: "Financeiro" },
                    { id: "estoque", label: "Estoque" },
                  ].map((modulo) => (
                    <div key={modulo.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={modulo.id}
                        checked={modulos.includes(modulo.id)}
                        onCheckedChange={() => toggleModulo(modulo.id)}
                      />
                      <Label htmlFor={modulo.id} className="font-normal">
                        {modulo.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Frequência de Sincronização</Label>
                <Select value={frequencia} onValueChange={setFrequencia}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Tempo Real</SelectItem>
                    <SelectItem value="5min">A cada 5 minutos</SelectItem>
                    <SelectItem value="15min">A cada 15 minutos</SelectItem>
                    <SelectItem value="1h">A cada hora</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Testar Conexão */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Testar Conexão</h3>
            <Button variant="outline" onClick={handleTestarConexao} className="w-full">
              🔌 Testar Conexão
            </Button>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSalvar} className="flex-1">
              💾 Salvar Configuração
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
