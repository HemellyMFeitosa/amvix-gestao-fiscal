import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { validarEmail, formatarTelefone } from "@/hooks/useUsuarios";
import { supabase } from "@/integrations/supabase/client";
import { getSafeErrorMessage, logError } from "@/lib/errorMapper";
interface NovoUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSalvar: () => void;
  emailJaExiste: (email: string) => boolean;
}

export const NovoUsuarioDialog = ({ open, onOpenChange, onSalvar, emailJaExiste }: NovoUsuarioDialogProps) => {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const limparForm = () => {
    setNomeCompleto("");
    setEmail("");
    setSenha("");
    setConfirmarSenha("");
    setTelefone("");
    setDepartamento("");
    setObservacoes("");
  };

  const handleSalvar = async () => {
    // Validações
    if (!nomeCompleto || nomeCompleto.length < 3) {
      toast({ title: "❌ Nome deve ter no mínimo 3 caracteres", variant: "destructive" });
      return;
    }

    if (!email || !validarEmail(email)) {
      toast({ title: "❌ E-mail inválido", variant: "destructive" });
      return;
    }

    if (emailJaExiste(email)) {
      toast({ title: "❌ E-mail já cadastrado no sistema", variant: "destructive" });
      return;
    }

    if (!senha || senha.length < 8) {
      toast({ title: "❌ Senha deve ter no mínimo 8 caracteres", variant: "destructive" });
      return;
    }

    if (senha !== confirmarSenha) {
      toast({ title: "❌ As senhas não conferem", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Usar edge function para criar usuário sem fazer login
      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: {
          email,
          password: senha,
          nome_completo: nomeCompleto,
          role: 'cliente'
        }
      });

      if (error) {
        logError('NovoUsuarioDialog', error);
        toast({ title: "❌ " + getSafeErrorMessage(error), variant: "destructive" });
        return;
      }

      if (data?.error) {
        toast({ title: "❌ " + data.error, variant: "destructive" });
        return;
      }

      // Atualizar perfil com informações adicionais
      if (data?.user?.id) {
        const { error: profileError } = await supabase.from("profiles").update({
          telefone: telefone || null,
          departamento: departamento || null,
          observacoes: observacoes || null,
        }).eq('id', data.user.id);

        if (profileError) {
          logError('NovoUsuarioDialog.profile', profileError);
        }
      }

      limparForm();
      onOpenChange(false);
      onSalvar();
      toast({ title: "✅ Usuário cadastrado com sucesso!" });
    } catch (error) {
      logError('NovoUsuarioDialog', error);
      toast({ title: "❌ " + getSafeErrorMessage(error), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
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
                  placeholder="Digite o nome completo"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com.br"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="senha">Senha *</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    disabled={isSubmitting}
                  >
                    {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                <div className="relative">
                  <Input
                    id="confirmarSenha"
                    type={mostrarConfirmarSenha ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Digite a senha novamente"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                    disabled={isSubmitting}
                  >
                    {mostrarConfirmarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Informações Adicionais</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="telefone">Telefone (opcional)</Label>
                <Input
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="departamento">Departamento (opcional)</Label>
                <Input
                  id="departamento"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  placeholder="Ex: TI, Contabilidade, Financeiro"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="observacoes">Observações (opcional)</Label>
                <Textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Observações adicionais"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            O usuário será criado com perfil "Cliente". Para alterar o perfil, use a seção de Configurar Permissões após o cadastro.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "💾 Salvar Usuário"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
