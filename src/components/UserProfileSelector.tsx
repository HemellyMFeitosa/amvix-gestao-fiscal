import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useUsuarioLogado } from "@/hooks/useUsuarioLogado";
import { useEmpresa } from "@/contexts/EmpresaContext";
import { cn } from "@/lib/utils";
import { Check, Building2 } from "lucide-react";

export const UserProfileSelector = () => {
  const { usuario, gerarIniciais, corAvatar } = useUsuarioLogado();
  const { empresaAtual, empresas, selecionarEmpresa } = useEmpresa();

  const empresasAtivas = empresas.filter((e) => e.status === 'Ativa');
  const iniciais = usuario ? gerarIniciais(usuario.nomeCompleto) : 'U';
  const cor = usuario ? corAvatar(usuario.perfil) : '#6B7280';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent/50 transition-smooth cursor-pointer">
          <Avatar className="h-10 w-10">
            {usuario?.foto && (
              <AvatarImage src={usuario.foto} alt={usuario.nomeCompleto} />
            )}
            <AvatarFallback 
              className="font-semibold text-sm text-white"
              style={{ backgroundColor: cor }}
            >
              {iniciais}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-sidebar-foreground">
              {usuario?.nomeCompleto || 'Usuário'}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {empresaAtual ? (
                <span className="truncate">
                  {empresasAtivas.length} empresa{empresasAtivas.length !== 1 ? 's' : ''}
                </span>
              ) : (
                'Selecione uma empresa'
              )}
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-background" align="start">
        <DropdownMenuLabel>Empresas Disponíveis</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {empresasAtivas.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            Nenhuma empresa disponível
          </div>
        ) : (
          empresasAtivas.map((empresa) => (
            <DropdownMenuItem
              key={empresa.id}
              onClick={() => selecionarEmpresa(empresa)}
              className={cn(
                "cursor-pointer",
                empresaAtual?.id === empresa.id && "bg-primary/10"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {empresa.nome_fantasia}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {empresa.codigo}
                  </span>
                </div>
                {empresaAtual?.id === empresa.id && (
                  <Check className="w-4 h-4 ml-2 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
