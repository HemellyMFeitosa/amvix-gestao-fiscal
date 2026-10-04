import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, format } from "date-fns";

export const useNotasFiscaisStats = (empresaId: string | undefined) => {
  return useQuery({
    queryKey: ["notas-fiscais-stats", empresaId],
    queryFn: async () => {
      if (!empresaId) throw new Error("Empresa ID não fornecido");

      const hoje = format(new Date(), "yyyy-MM-dd");
      const primeiroDiaMes = format(startOfMonth(new Date()), "yyyy-MM-dd");
      const ultimoDiaMes = format(endOfMonth(new Date()), "yyyy-MM-dd");

      // Emitidas hoje
      const { count: emitidasHoje } = await supabase
        .from("notas_fiscais")
        .select("*", { count: "exact", head: true })
        .eq("empresa_id", empresaId)
        .eq("data_emissao", hoje);

      // Pendentes
      const { count: pendentes } = await supabase
        .from("notas_fiscais")
        .select("*", { count: "exact", head: true })
        .eq("empresa_id", empresaId)
        .eq("status", "Pendente");

      // Canceladas
      const { count: canceladas } = await supabase
        .from("notas_fiscais")
        .select("*", { count: "exact", head: true })
        .eq("empresa_id", empresaId)
        .eq("status", "Cancelada");

      // Total do mês
      const { count: totalMes } = await supabase
        .from("notas_fiscais")
        .select("*", { count: "exact", head: true })
        .eq("empresa_id", empresaId)
        .gte("data_emissao", primeiroDiaMes)
        .lte("data_emissao", ultimoDiaMes);

      return {
        emitidasHoje: emitidasHoje || 0,
        pendentes: pendentes || 0,
        canceladas: canceladas || 0,
        totalMes: totalMes || 0,
      };
    },
    enabled: !!empresaId,
  });
};

export const useNotasFiscaisList = (empresaId: string | undefined) => {
  return useQuery({
    queryKey: ["notas-fiscais-list", empresaId],
    queryFn: async () => {
      if (!empresaId) throw new Error("Empresa ID não fornecido");

      const { data, error } = await supabase
        .from("notas_fiscais")
        .select(`
          *,
          clientes_fornecedores (
            nome_razao_social,
            email
          )
        `)
        .eq("empresa_id", empresaId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!empresaId,
  });
};

export const useEmpresaAtual = () => {
  return useQuery({
    queryKey: ["empresa-atual"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("empresas")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

export const useClientesFornecedores = (empresaId: string | undefined) => {
  return useQuery({
    queryKey: ["clientes-fornecedores", empresaId],
    queryFn: async () => {
      if (!empresaId) throw new Error("Empresa ID não fornecido");

      const { data, error } = await supabase
        .from("clientes_fornecedores")
        .select("*")
        .eq("empresa_id", empresaId)
        .order("nome_razao_social");

      if (error) throw error;
      return data;
    },
    enabled: !!empresaId,
  });
};

export const useProdutosServicos = (empresaId: string | undefined) => {
  return useQuery({
    queryKey: ["produtos-servicos", empresaId],
    queryFn: async () => {
      if (!empresaId) throw new Error("Empresa ID não fornecido");

      const { data, error } = await supabase
        .from("produtos_servicos")
        .select("*")
        .eq("empresa_id", empresaId)
        .eq("ativo", true)
        .order("descricao");

      if (error) throw error;
      return data;
    },
    enabled: !!empresaId,
  });
};
