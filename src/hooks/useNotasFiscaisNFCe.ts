import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNotasNFCeStats = (empresaId: string) => {
  return useQuery({
    queryKey: ['notas-nfce-stats', empresaId],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Vendas hoje
      const { count: vendasHoje } = await supabase
        .from('notas_fiscais')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', empresaId)
        .eq('tipo', 'NFC-e')
        .gte('data_emissao', today);

      // Faturamento hoje
      const { data: faturamentoData } = await supabase
        .from('notas_fiscais')
        .select('valor_total')
        .eq('empresa_id', empresaId)
        .eq('tipo', 'NFC-e')
        .eq('status', 'Autorizada')
        .gte('data_emissao', today);

      const faturamento = faturamentoData?.reduce((sum, nota) => sum + Number(nota.valor_total), 0) || 0;

      // Ticket médio
      const ticketMedio = vendasHoje ? faturamento / vendasHoje : 0;

      // Total do mês
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const startOfMonthStr = startOfMonth.toISOString().split('T')[0];

      const { count: totalMes } = await supabase
        .from('notas_fiscais')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', empresaId)
        .eq('tipo', 'NFC-e')
        .gte('data_emissao', startOfMonthStr);

      return {
        vendasHoje: vendasHoje || 0,
        faturamento,
        ticketMedio,
        totalMes: totalMes || 0,
      };
    },
    enabled: !!empresaId,
  });
};

export const useNotasNFCeList = (empresaId: string) => {
  return useQuery({
    queryKey: ['notas-nfce-list', empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notas_fiscais')
        .select(`
          *,
          cliente_fornecedor:clientes_fornecedores(nome_razao_social, cpf_cnpj)
        `)
        .eq('empresa_id', empresaId)
        .eq('tipo', 'NFC-e')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!empresaId,
  });
};
