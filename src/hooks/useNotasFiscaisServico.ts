import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, format } from "date-fns";

export const useNotasServicoStats = (empresaId: string | undefined) => {
  return useQuery({
    queryKey: ["notas-servico-stats", empresaId],
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
        .eq("tipo", "NFS-e")
        .eq("data_emissao", hoje);

      // Pendentes
      const { count: pendentes } = await supabase
        .from("notas_fiscais")
        .select("*", { count: "exact", head: true })
        .eq("empresa_id", empresaId)
        .eq("tipo", "NFS-e")
        .eq("status", "Pendente");

      // Canceladas
      const { count: canceladas } = await supabase
        .from("notas_fiscais")
        .select("*", { count: "exact", head: true })
        .eq("empresa_id", empresaId)
        .eq("tipo", "NFS-e")
        .eq("status", "Cancelada");

      // Total do mês
      const { count: totalMes } = await supabase
        .from("notas_fiscais")
        .select("*", { count: "exact", head: true })
        .eq("empresa_id", empresaId)
        .eq("tipo", "NFS-e")
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

export const useNotasServicoList = (empresaId: string | undefined) => {
  return useQuery({
    queryKey: ["notas-servico-list", empresaId],
    queryFn: async () => {
      if (!empresaId) throw new Error("Empresa ID não fornecido");

      const { data, error } = await supabase
        .from("notas_fiscais")
        .select(`
          *,
          clientes_fornecedores (
            nome_razao_social
          )
        `)
        .eq("empresa_id", empresaId)
        .eq("tipo", "NFS-e")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!empresaId,
  });
};
