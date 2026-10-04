import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEmpresa } from "@/contexts/EmpresaContext";
import { useToast } from "@/hooks/use-toast";

export interface FormaPagamento {
  id: string;
  empresa_id: string;
  codigo: string;
  descricao: string;
  aceita_parcelamento: boolean;
  max_parcelas: number | null;
  taxa_desconto: number | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export type FormaPagamentoInput = Omit<FormaPagamento, "id" | "empresa_id" | "created_at" | "updated_at">;

export const CODIGOS_PAGAMENTO = [
  { codigo: "01", descricao: "Dinheiro" },
  { codigo: "02", descricao: "Cheque" },
  { codigo: "03", descricao: "Cartão de Crédito" },
  { codigo: "04", descricao: "Cartão de Débito" },
  { codigo: "05", descricao: "Crédito Loja" },
  { codigo: "10", descricao: "Vale Alimentação" },
  { codigo: "11", descricao: "Vale Refeição" },
  { codigo: "12", descricao: "Vale Presente" },
  { codigo: "13", descricao: "Vale Combustível" },
  { codigo: "14", descricao: "Duplicata Mercantil" },
  { codigo: "15", descricao: "Boleto Bancário" },
  { codigo: "16", descricao: "Depósito Bancário" },
  { codigo: "17", descricao: "PIX" },
  { codigo: "18", descricao: "Transferência bancária, Carteira Digital" },
  { codigo: "19", descricao: "Programa de fidelidade, Cashback, Crédito Virtual" },
  { codigo: "90", descricao: "Sem pagamento" },
  { codigo: "99", descricao: "Outros" },
];

export const useFormasPagamento = () => {
  const [formas, setFormas] = useState<FormaPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { empresaAtual: empresaSelecionada } = useEmpresa();
  const { toast } = useToast();

  const fetchFormas = async () => {
    if (!empresaSelecionada) {
      setFormas([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("formas_pagamento")
        .select("*")
        .eq("empresa_id", empresaSelecionada.id)
        .order("codigo");

      if (error) throw error;
      setFormas((data || []) as FormaPagamento[]);
    } catch (error: unknown) {
      console.error("Erro ao carregar formas de pagamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as formas de pagamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormas();
  }, [empresaSelecionada]);

  const criarForma = async (forma: FormaPagamentoInput) => {
    if (!empresaSelecionada) return null;

    try {
      const { data, error } = await supabase
        .from("formas_pagamento")
        .insert({
          ...forma,
          empresa_id: empresaSelecionada.id,
        })
        .select()
        .single();

      if (error) throw error;

      setFormas((prev) => [...prev, data as FormaPagamento]);
      toast({
        title: "Sucesso",
        description: "Forma de pagamento cadastrada com sucesso!",
      });
      return data;
    } catch (error: unknown) {
      console.error("Erro ao criar forma de pagamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar a forma de pagamento.",
        variant: "destructive",
      });
      return null;
    }
  };

  const atualizarForma = async (id: string, forma: Partial<FormaPagamentoInput>) => {
    try {
      const { data, error } = await supabase
        .from("formas_pagamento")
        .update(forma)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setFormas((prev) => prev.map((f) => (f.id === id ? (data as FormaPagamento) : f)));
      toast({
        title: "Sucesso",
        description: "Forma de pagamento atualizada com sucesso!",
      });
      return data;
    } catch (error: unknown) {
      console.error("Erro ao atualizar forma de pagamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a forma de pagamento.",
        variant: "destructive",
      });
      return null;
    }
  };

  const excluirForma = async (id: string) => {
    try {
      const { error } = await supabase.from("formas_pagamento").delete().eq("id", id);

      if (error) throw error;

      setFormas((prev) => prev.filter((f) => f.id !== id));
      toast({
        title: "Sucesso",
        description: "Forma de pagamento excluída com sucesso!",
      });
      return true;
    } catch (error: unknown) {
      console.error("Erro ao excluir forma de pagamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a forma de pagamento.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    formas,
    loading,
    fetchFormas,
    criarForma,
    atualizarForma,
    excluirForma,
  };
};
