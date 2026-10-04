import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Usuario } from "@/hooks/useUsuarios";

interface ExcluirUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null;
  onConfirmar: () => void;
}

export const ExcluirUsuarioDialog = ({ open, onOpenChange, usuario, onConfirmar }: ExcluirUsuarioDialogProps) => {
  if (!usuario) return null;

  const perfilLabel = {
    admin: "Administrador",
    contador: "Contador",
    cliente: "Cliente",
  }[usuario.perfil] || usuario.perfil;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-warning">
                <span className="text-2xl">⚠️</span>
                <span className="font-semibold text-foreground">Atenção!</span>
              </div>
              
              <p className="text-foreground">Tem certeza que deseja excluir o usuário?</p>
              
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div>
                  <span className="text-muted-foreground text-sm">Nome:</span>
                  <p className="font-medium text-foreground">{usuario.nomeCompleto}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">E-mail:</span>
                  <p className="font-medium text-foreground">{usuario.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Perfil:</span>
                  <p className="font-medium text-foreground">{perfilLabel}</p>
                </div>
              </div>
              
              <p className="text-destructive font-medium">Esta ação não pode ser desfeita.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirmar}>
            🗑️ Sim, Excluir
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
