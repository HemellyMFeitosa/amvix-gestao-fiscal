import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { usePermissoes } from "@/hooks/usePermissoes";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface ConfigurarPermissoesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConfigurarPermissoesDialog = ({ open, onOpenChange }: ConfigurarPermissoesDialogProps) => {
  const { obterPermissoesPorRole, atualizarPermissao, loading } = usePermissoes();
  const [roleSelecionada, setRoleSelecionada] = useState<"admin" | "contador" | "cliente">("contador");
  const [salvando, setSalvando] = useState(false);

  const permissoesPorModulo = obterPermissoesPorRole(roleSelecionada);

  const handlePermissaoChange = async (
    moduloId: string,
    acao: "visualizar" | "criar" | "editar" | "excluir" | "exportar",
    permitido: boolean
  ) => {
    setSalvando(true);
    const sucesso = await atualizarPermissao(roleSelecionada, moduloId, acao, permitido);
    
    if (sucesso) {
      toast({ title: "✅ Permissão atualizada com sucesso!" });
    }
    
    setSalvando(false);
  };

  const roleLabels = {
    admin: "Administrador",
    contador: "Contador",
    cliente: "Cliente",
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Permissões por Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="perfil">Perfil de Usuário</Label>
            <Select
              value={roleSelecionada}
              onValueChange={(value) => setRoleSelecionada(value as "admin" | "contador" | "cliente")}
            >
              <SelectTrigger id="perfil" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador - Acesso Total</SelectItem>
                <SelectItem value="contador">Contador - Operacional</SelectItem>
                <SelectItem value="cliente">Cliente - Consulta</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              Configure as permissões específicas para o perfil <strong>{roleLabels[roleSelecionada]}</strong>
            </p>
          </div>

          <div className="border border-border rounded-lg">
            <div className="bg-muted/30 px-4 py-3 font-semibold border-b border-border">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-2">Módulo</div>
                <div className="text-center">Ver</div>
                <div className="text-center">Criar</div>
                <div className="text-center">Editar</div>
                <div className="text-center">Excluir</div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {permissoesPorModulo.map(({ modulo, permissoes }) => (
                <div key={modulo.id} className="px-4 py-3 hover:bg-muted/10 transition-colors">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="col-span-2">
                      <div className="font-medium">{modulo.descricao}</div>
                      <div className="text-xs text-muted-foreground">{modulo.rota}</div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Checkbox
                        checked={permissoes.visualizar}
                        onCheckedChange={(checked) =>
                          handlePermissaoChange(modulo.id, "visualizar", checked as boolean)
                        }
                        disabled={salvando || roleSelecionada === "admin"}
                      />
                    </div>
                    
                    <div className="flex justify-center">
                      <Checkbox
                        checked={permissoes.criar}
                        onCheckedChange={(checked) =>
                          handlePermissaoChange(modulo.id, "criar", checked as boolean)
                        }
                        disabled={salvando || roleSelecionada === "admin"}
                      />
                    </div>
                    
                    <div className="flex justify-center">
                      <Checkbox
                        checked={permissoes.editar}
                        onCheckedChange={(checked) =>
                          handlePermissaoChange(modulo.id, "editar", checked as boolean)
                        }
                        disabled={salvando || roleSelecionada === "admin"}
                      />
                    </div>
                    
                    <div className="flex justify-center">
                      <Checkbox
                        checked={permissoes.excluir}
                        onCheckedChange={(checked) =>
                          handlePermissaoChange(modulo.id, "excluir", checked as boolean)
                        }
                        disabled={salvando || roleSelecionada === "admin"}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {roleSelecionada === "admin" && (
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                ℹ️ <strong>Administradores</strong> têm acesso total a todos os módulos por padrão e não podem ter suas permissões alteradas.
              </p>
            </div>
          )}

          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Sobre as Permissões:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Ver:</strong> Permite visualizar e acessar o módulo</li>
              <li>• <strong>Criar:</strong> Permite criar novos registros/dados</li>
              <li>• <strong>Editar:</strong> Permite modificar registros existentes</li>
              <li>• <strong>Excluir:</strong> Permite remover registros</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
