import { ReactNode, useEffect, useState } from "react";
import { usePermissoes } from "@/hooks/usePermissoes";
import { Loader2 } from "lucide-react";

interface ProtectedActionProps {
  modulo: string;
  acao: "visualizar" | "criar" | "editar" | "excluir" | "exportar";
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente para proteger ações baseado em permissões
 * 
 * Exemplo de uso:
 * 
 * <ProtectedAction modulo="nfe" acao="criar">
 *   <Button>Criar Nova NF-e</Button>
 * </ProtectedAction>
 */
export const ProtectedAction = ({ modulo, acao, children, fallback = null }: ProtectedActionProps) => {
  const { verificarPermissao } = usePermissoes();
  const [temPermissao, setTemPermissao] = useState<boolean | null>(null);

  useEffect(() => {
    const verificar = async () => {
      const permitido = await verificarPermissao(modulo, acao);
      setTemPermissao(permitido);
    };

    verificar();
  }, [modulo, acao]);

  if (temPermissao === null) {
    return <Loader2 className="w-4 h-4 animate-spin" />;
  }

  if (!temPermissao) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
