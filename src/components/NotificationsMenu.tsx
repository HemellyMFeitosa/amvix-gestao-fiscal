import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificacoes } from "@/hooks/useNotificacoes";
import { cn } from "@/lib/utils";

export const NotificationsMenu = () => {
  const { notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas, excluirNotificacao } = useNotificacoes();

  const getIconColor = (tipo: string) => {
    switch (tipo) {
      case "info": return "text-blue-500";
      case "success": return "text-green-500";
      case "warning": return "text-yellow-500";
      case "error": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const formatarTempo = (timestamp: string) => {
    const agora = new Date();
    const data = new Date(timestamp);
    const diff = agora.getTime() - data.getTime();
    
    const minutos = Math.floor(diff / 60000);
    if (minutos < 60) return `Há ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `Há ${horas} hora${horas !== 1 ? 's' : ''}`;
    
    const dias = Math.floor(horas / 24);
    return `Há ${dias} dia${dias !== 1 ? 's' : ''}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {naoLidas > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
              {naoLidas > 9 ? '9+' : naoLidas}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-lg">Notificações</h3>
          {naoLidas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={marcarTodasComoLidas}
              className="text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[400px]">
          {notificacoes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notificacoes.map((notificacao) => (
                <div
                  key={notificacao.id}
                  className={cn(
                    "p-4 hover:bg-accent/50 transition-colors cursor-pointer relative group",
                    !notificacao.lida && "bg-accent/20"
                  )}
                  onClick={() => marcarComoLida(notificacao.id)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      excluirNotificacao(notificacao.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex gap-3">
                    <div className={cn("mt-1", getIconColor(notificacao.tipo))}>
                      <div className="h-2 w-2 rounded-full bg-current" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-sm">{notificacao.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {notificacao.descricao}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatarTempo(notificacao.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
