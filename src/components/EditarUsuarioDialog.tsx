import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Usuario, validarEmail, formatarTelefone } from "@/hooks/useUsuarios";

interface EditarUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null;
  onSalvar: (id: string, dados: Partial<Usuario>) => Promise<boolean>;
  onAtualizarRole?: (userId: string, novaRole: "admin" | "contador" | "cliente") => Promise<boolean>;
  emailJaExiste: (email: string, idAtual?: string) => boolean;
  isAdmin?: boolean;
}

export const EditarUsuarioDialog = ({ open, onOpenChange, usuario, onSalvar, onAtualizarRole, emailJaExiste, isAdmin = false }: EditarUsuarioDialogProps) => {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState<"admin" | "contador" | "cliente">("cliente");
  const [status, setStatus] = useState<string>("Ativo");
  const [telefone, setTelefone] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNomeCompleto(usuario.nomeCompleto);
      setEmail(usuario.email);
      setPerfil(usuario.perfil);
      setStatus(usuario.status || "Ativo");
      setTelefone(usuario.telefone || "");
      setDepartamento(usuario.departamento || "");
      setObservacoes(usuario.observacoes || "");
    }
  }, [usuario]);

  const handleSalvar = async () => {
    if (!usuario) return;

    // Validações
    if (!nomeCompleto || nomeCompleto.length < 3) {
      toast({ title: "❌ Nome deve ter no mínimo 3 caracteres", variant: "destructive" });
      return;
    }

    if (!email || !validarEmail(email)) {
      toast({ title: "❌ E-mail inválido", variant: "destructive" });
      return;
    }

    if (emailJaExiste(email, usuario.id)) {
      toast({ title: "❌ E-mail já cadastrado no sistema", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const dadosAtualizados: Partial<Usuario> = {
      nomeCompleto,
      telefone: telefone || null,
      departamento: departamento || null,
      observacoes: observacoes || null,
      status,
    };

    // Atualizar role se mudou e é admin
    if (isAdmin && onAtualizarRole && perfil !== usuario.perfil) {
      const roleAtualizada = await onAtualizarRole(usuario.id, perfil);
      if (!roleAtualizada) {
        setIsSubmitting(false);
        toast({ title: "❌ Erro ao atualizar perfil de acesso", variant: "destructive" });
        return;
      }
    }

    const sucesso = await onSalvar(usuario.id, dadosAtualizados);
    
    setIsSubmitting(false);
    
    if (sucesso) {
      onOpenChange(false);
      toast({ title: "✅ Usuário atualizado com sucesso!" });
    } else {
      toast({ title: "❌ Erro ao atualizar usuário", variant: "destructive" });
    }
  };

  if (!usuario) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Informações Básicas</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  O e-mail não pode ser alterado (usado para autenticação)
                </p>
              </div>

              <div>
                <Label htmlFor="perfil">Perfil de Acesso</Label>
                {isAdmin ? (
                  <Select value={perfil} onValueChange={(value) => setPerfil(value as "admin" | "contador" | "cliente")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="contador">Contador</SelectItem>
                      <SelectItem value="cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <>
                    <Input
                      id="perfil"
                      value={perfil === "admin" ? "Administrador" : perfil === "contador" ? "Contador" : "Cliente"}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Apenas administradores podem alterar o perfil de acesso
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Configurações</h3>
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                  maxLength={15}
                />
              </div>

              <div>
                <Label htmlFor="departamento">Departamento</Label>
                <Input
                  id="departamento"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "💾 Salvar Alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
