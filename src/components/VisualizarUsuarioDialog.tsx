import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Usuario, formatarDataHora } from "@/hooks/useUsuarios";

interface VisualizarUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null;
  onEditar: () => void;
}

export const VisualizarUsuarioDialog = ({ open, onOpenChange, usuario, onEditar }: VisualizarUsuarioDialogProps) => {
  if (!usuario) return null;

  const perfilLabel = {
    admin: "Administrador",
    contador: "Contador",
    cliente: "Cliente",
  }[usuario.perfil] || usuario.perfil;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4 text-primary">Informações</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome:</p>
                <p className="font-medium">{usuario.nomeCompleto}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">E-mail:</p>
                <p className="font-medium">{usuario.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Perfil:</p>
                <p className="font-medium">{perfilLabel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status:</p>
                <p className="font-medium">{usuario.status}</p>
              </div>
              {usuario.telefone && (
                <div>
                  <p className="text-sm text-muted-foreground">Telefone:</p>
                  <p className="font-medium">{usuario.telefone}</p>
                </div>
              )}
              {usuario.departamento && (
                <div>
                  <p className="text-sm text-muted-foreground">Departamento:</p>
                  <p className="font-medium">{usuario.departamento}</p>
                </div>
              )}
              {usuario.observacoes && (
                <div>
                  <p className="text-sm text-muted-foreground">Observações:</p>
                  <p className="font-medium">{usuario.observacoes}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary">Acesso</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Último Acesso:</p>
                <p className="font-medium">{formatarDataHora(usuario.ultimoAcesso)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Cadastro:</p>
                <p className="font-medium">{formatarDataHora(usuario.dataCadastro)}</p>
              </div>
              {usuario.cadastradoPor && (
                <div>
                  <p className="text-sm text-muted-foreground">Cadastrado por:</p>
                  <p className="font-medium">{usuario.cadastradoPor}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={onEditar}>
            ✏️ Editar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
