import { User, Settings, LogOut, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUsuarioLogado } from "@/hooks/useUsuarioLogado";
import { useState } from "react";
import { MeuPerfilDialog } from "./MeuPerfilDialog";
import { useNavigate } from "react-router-dom";
import EmpresaSelector from "./empresa/EmpresaSelector";
import { useEmpresa } from "@/contexts/EmpresaContext";

export const UserMenu = () => {
  const { usuario, gerarIniciais, corAvatar, logout } = useUsuarioLogado();
  const { empresaAtual } = useEmpresa();
  const [perfilOpen, setPerfilOpen] = useState(false);
  const navigate = useNavigate();

  if (!usuario) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const perfilLabel = usuario.perfil.charAt(0).toUpperCase() + usuario.perfil.slice(1);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full relative group">
            <Avatar className="h-8 w-8">
              {usuario.foto ? (
                <AvatarImage src={usuario.foto} alt={usuario.nomeCompleto} />
              ) : null}
              <AvatarFallback 
                style={{ backgroundColor: corAvatar(usuario.perfil) }}
                className="text-white font-semibold text-sm"
              >
                {gerarIniciais(usuario.nomeCompleto)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <div className="flex gap-3 items-center">
              <Avatar className="h-12 w-12">
                {usuario.foto ? (
                  <AvatarImage src={usuario.foto} alt={usuario.nomeCompleto} />
                ) : null}
                <AvatarFallback 
                  style={{ backgroundColor: corAvatar(usuario.perfil) }}
                  className="text-white font-semibold"
                >
                  {gerarIniciais(usuario.nomeCompleto)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{usuario.nomeCompleto}</p>
                <p className="text-xs text-muted-foreground">{perfilLabel}</p>
                {empresaAtual && (
                  <p className="text-xs text-primary">
                    📍 {empresaAtual.codigo} - {empresaAtual.nome_fantasia.substring(0, 15)}...
                  </p>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <EmpresaSelector />
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setPerfilOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MeuPerfilDialog open={perfilOpen} onOpenChange={setPerfilOpen} />
    </>
  );
};
