import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Modulo {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  rota: string;
  ordem: number;
  ativo: boolean;
}

export interface Permissao {
  id: string;
  role: "admin" | "contador" | "cliente";
  modulo_id: string;
  acao: "visualizar" | "criar" | "editar" | "excluir" | "exportar";
  permitido: boolean;
}

export interface PermissoesPorModulo {
  modulo: Modulo;
  permissoes: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
    exportar: boolean;
  };
}

export const usePermissoes = () => {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const carregarModulos = async () => {
    const { data, error } = await supabase
      .from("modulos_sistema")
      .select("*")
      .order("ordem");

    if (error) {
      console.error("Erro ao carregar módulos:", error);
      return;
    }

    setModulos(data || []);
  };

  const carregarPermissoes = async () => {
    const { data, error } = await supabase
      .from("permissoes")
      .select("*");

    if (error) {
      console.error("Erro ao carregar permissões:", error);
      return;
    }

    setPermissoes(data || []);
  };

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      await Promise.all([carregarModulos(), carregarPermissoes()]);
      setLoading(false);
    };

    carregar();
  }, []);

  const obterPermissoesPorRole = (role: "admin" | "contador" | "cliente"): PermissoesPorModulo[] => {
    return modulos.map((modulo) => {
      const permsDoModulo = permissoes.filter(
        (p) => p.role === role && p.modulo_id === modulo.id
      );

      return {
        modulo,
        permissoes: {
          visualizar: permsDoModulo.find((p) => p.acao === "visualizar")?.permitido || false,
          criar: permsDoModulo.find((p) => p.acao === "criar")?.permitido || false,
          editar: permsDoModulo.find((p) => p.acao === "editar")?.permitido || false,
          excluir: permsDoModulo.find((p) => p.acao === "excluir")?.permitido || false,
          exportar: permsDoModulo.find((p) => p.acao === "exportar")?.permitido || false,
        },
      };
    });
  };

  const atualizarPermissao = async (
    role: "admin" | "contador" | "cliente",
    moduloId: string,
    acao: "visualizar" | "criar" | "editar" | "excluir" | "exportar",
    permitido: boolean
  ) => {
    const { error } = await supabase
      .from("permissoes")
      .update({ permitido })
      .eq("role", role)
      .eq("modulo_id", moduloId)
      .eq("acao", acao);

    if (error) {
      console.error("Erro ao atualizar permissão:", error);
      toast({ title: "❌ Erro ao atualizar permissão", variant: "destructive" });
      return false;
    }

    await carregarPermissoes();
    return true;
  };

  const verificarPermissao = async (
    modulo: string,
    acao: "visualizar" | "criar" | "editar" | "excluir" | "exportar"
  ): Promise<boolean> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return false;

    const { data, error } = await supabase.rpc("tem_permissao", {
      _user_id: session.session.user.id,
      _modulo: modulo,
      _acao: acao,
    });

    if (error) {
      console.error("Erro ao verificar permissão:", error);
      return false;
    }

    return data || false;
  };

  return {
    modulos,
    permissoes,
    loading,
    obterPermissoesPorRole,
    atualizarPermissao,
    verificarPermissao,
  };
};
