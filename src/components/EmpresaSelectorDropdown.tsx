import { useState, useMemo } from "react";
import { Building2, Check, ChevronDown, Search, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useUsuarioLogado } from "@/hooks/useUsuarioLogado";
import { useEmpresaAtual } from "@/hooks/useEmpresaAtual";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const EmpresaSelectorDropdown = () => {
  const { usuario, gerarIniciais, corAvatar } = useUsuarioLogado();
  const { empresaAtual, empresasDisponiveis, isLoading, trocarEmpresa } = useEmpresaAtual();
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState("");

  if (!usuario) return null;

  const handleSelectEmpresa = async (empresaId: string) => {
    const empresa = empresasDisponiveis.find(e => e.id === empresaId);
    if (!empresa) return;

    setOpen(false);
    setBusca("");
    
    await trocarEmpresa(empresaId);
    toast.success(`Dashboard atualizado para ${empresa.nome_fantasia}`);
  };

  const empresasFiltradas = useMemo(() => {
    if (!busca.trim()) return empresasDisponiveis;
    
    const buscaLower = busca.toLowerCase();
    return empresasDisponiveis.filter(empresa => 
      empresa.nome_fantasia.toLowerCase().includes(buscaLower) ||
      empresa.codigo.toString().includes(buscaLower) ||
      (empresa.cidade && empresa.cidade.toLowerCase().includes(buscaLower)) ||
      (empresa.cnpj && empresa.cnpj.includes(busca))
    );
  }, [busca, empresasDisponiveis]);

  const temMuitasEmpresas = empresasDisponiveis.length > 8;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={isLoading}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg transition-smooth",
            "hover:bg-sidebar-accent/50 cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            isLoading && "opacity-50 cursor-wait"
          )}
        >
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            {usuario.foto ? (
              <AvatarImage src={usuario.foto} alt={usuario.nomeCompleto} />
            ) : null}
            <AvatarFallback 
              style={{ backgroundColor: corAvatar(usuario.perfil) }}
              className="text-white font-bold"
            >
              {gerarIniciais(usuario.nomeCompleto)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0 text-left">
            <p className="font-semibold text-sm text-sidebar-foreground truncate">
              {usuario.nomeCompleto}
            </p>
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground truncate">
                {empresaAtual ? `${empresaAtual.codigo} - ${empresaAtual.nome_fantasia}` : "Selecione uma empresa"}
              </p>
            </div>
          </div>

          {isLoading ? (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-0 bg-card border-border shadow-xl" 
        align="start"
        side="bottom"
      >
        <div className="p-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground mb-3">
            Selecionar Empresa/Filial
          </p>
          
          {temMuitasEmpresas && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empresa..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9 h-9 bg-background"
              />
            </div>
          )}
        </div>

        <ScrollArea className="h-[320px]">
          <div className="p-2 space-y-1">
            {empresasFiltradas.length > 0 ? (
              empresasFiltradas.map((empresa) => (
                <button
                  key={empresa.id}
                  onClick={() => handleSelectEmpresa(empresa.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-lg transition-smooth",
                    "hover:bg-accent/50 cursor-pointer text-left",
                    empresaAtual && empresa.id === empresaAtual.id && "bg-accent"
                  )}
                >
                  <Building2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {empresa.codigo} - {empresa.nome_fantasia}
                      </span>
                      {empresa.cnpj?.includes('/0001-') && (
                        <Badge variant="outline" className="text-xs py-0 h-5">
                          Matriz
                        </Badge>
                      )}
                    </div>
                    {empresa.cidade && (
                      <p className="text-xs text-muted-foreground">
                        {empresa.cidade}
                      </p>
                    )}
                    {empresa.cnpj && (
                      <p className="text-xs text-muted-foreground/70 mt-0.5">
                        {empresa.cnpj}
                      </p>
                    )}
                  </div>

                  {empresaAtual && empresa.id === empresaAtual.id && (
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  )}
                </button>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {empresasDisponiveis.length === 0 
                    ? "Nenhuma empresa cadastrada" 
                    : "Nenhuma empresa encontrada"}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
