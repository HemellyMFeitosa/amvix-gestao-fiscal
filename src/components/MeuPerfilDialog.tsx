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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUsuarioLogado } from "@/hooks/useUsuarioLogado";
import { Camera, Lock } from "lucide-react";
import { toast } from "sonner";
import { UploadFotoDialog } from "./UploadFotoDialog";
import { AvatarImage } from "@/components/ui/avatar";

interface MeuPerfilDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MeuPerfilDialog = ({ open, onOpenChange }: MeuPerfilDialogProps) => {
  const { usuario, atualizarUsuario, gerarIniciais, corAvatar } = useUsuarioLogado();
  const [nomeCompleto, setNomeCompleto] = useState(usuario?.nomeCompleto || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [telefone, setTelefone] = useState(usuario?.telefone || "");
  const [tema, setTema] = useState("escuro");
  const [notifEmissao, setNotifEmissao] = useState(true);
  const [notifErros, setNotifErros] = useState(true);
  const [notifRelatorios, setNotifRelatorios] = useState(false);
  const [uploadFotoOpen, setUploadFotoOpen] = useState(false);

  if (!usuario) return null;

  const handleSalvar = () => {
    atualizarUsuario({
      nomeCompleto,
      email,
      telefone,
    });
    toast.success("Perfil atualizado com sucesso!");
    onOpenChange(false);
  };

  const handleAlterarSenha = () => {
    toast.info("Funcionalidade de alteração de senha em breve!");
  };

  const handleSalvarFoto = (fotoBase64: string) => {
    atualizarUsuario({ foto: fotoBase64 || null });
  };

  const formatarTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const perfilLabel = usuario.perfil.charAt(0).toUpperCase() + usuario.perfil.slice(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Meu Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar e Info Básica */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 cursor-pointer group relative" onClick={() => setUploadFotoOpen(true)}>
              {usuario.foto ? (
                <AvatarImage src={usuario.foto} alt={usuario.nomeCompleto} />
              ) : null}
              <AvatarFallback 
                style={{ backgroundColor: corAvatar(usuario.perfil) }}
                className="text-white font-bold text-2xl"
              >
                {gerarIniciais(usuario.nomeCompleto)}
              </AvatarFallback>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </Avatar>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold">{usuario.nomeCompleto}</h3>
              <p className="text-sm text-muted-foreground">{perfilLabel}</p>
              <p className="text-sm text-muted-foreground">{usuario.email}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setUploadFotoOpen(true)}
              >
                <Camera className="h-4 w-4" />
                Alterar Foto
              </Button>
            </div>
          </div>

          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground">
              INFORMAÇÕES PESSOAIS
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          {/* Segurança */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground">
              SEGURANÇA
            </h4>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleAlterarSenha}
            >
              <Lock className="h-4 w-4" />
              Alterar Senha
            </Button>
          </div>

          {/* Preferências */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground">
              PREFERÊNCIAS
            </h4>
            
            <div className="space-y-2">
              <Label>Tema</Label>
              <RadioGroup value={tema} onValueChange={setTema}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="escuro" id="escuro" />
                  <Label htmlFor="escuro" className="font-normal cursor-pointer">
                    Escuro
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="claro" id="claro" />
                  <Label htmlFor="claro" className="font-normal cursor-pointer">
                    Claro
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Notificações por E-mail</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notif-emissao"
                    checked={notifEmissao}
                    onCheckedChange={(checked) => setNotifEmissao(checked as boolean)}
                  />
                  <Label htmlFor="notif-emissao" className="font-normal cursor-pointer">
                    Emissão de notas fiscais
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notif-erros"
                    checked={notifErros}
                    onCheckedChange={(checked) => setNotifErros(checked as boolean)}
                  />
                  <Label htmlFor="notif-erros" className="font-normal cursor-pointer">
                    Erros de sincronização
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notif-relatorios"
                    checked={notifRelatorios}
                    onCheckedChange={(checked) => setNotifRelatorios(checked as boolean)}
                  />
                  <Label htmlFor="notif-relatorios" className="font-normal cursor-pointer">
                    Relatórios diários
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} className="gap-2">
              💾 Salvar Alterações
            </Button>
          </div>
        </div>

        <UploadFotoDialog
          open={uploadFotoOpen}
          onOpenChange={setUploadFotoOpen}
          onSave={handleSalvarFoto}
          fotoAtual={usuario.foto}
        />
      </DialogContent>
    </Dialog>
  );
};
