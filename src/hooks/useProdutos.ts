import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEmpresa } from "@/contexts/EmpresaContext";
import { useToast } from "@/hooks/use-toast";

export interface Produto {
  id: string;
  empresa_id: string;
  codigo_sku: string;
  descricao: string;
  ncm: string | null;
  cest: string | null;
  unidade: string;
  preco_custo: number;
  preco_venda: number;
  estoque_atual: number;
  estoque_minimo: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export type ProdutoInput = Omit<Produto, "id" | "empresa_id" | "created_at" | "updated_at">;

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const { empresaAtual: empresaSelecionada } = useEmpresa();
  const { toast } = useToast();

  const fetchProdutos = async () => {
    if (!empresaSelecionada) {
      setProdutos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .eq("empresa_id", empresaSelecionada.id)
        .order("descricao");

      if (error) throw error;
      setProdutos(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar produtos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, [empresaSelecionada]);

  const criarProduto = async (produto: ProdutoInput) => {
    if (!empresaSelecionada) return null;

    try {
      const { data, error } = await supabase
        .from("produtos")
        .insert({
          ...produto,
          empresa_id: empresaSelecionada.id,
        })
        .select()
        .single();

      if (error) throw error;

      setProdutos((prev) => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Produto cadastrado com sucesso!",
      });
      return data;
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o produto.",
        variant: "destructive",
      });
      return null;
    }
  };

  const atualizarProduto = async (id: string, produto: Partial<ProdutoInput>) => {
    try {
      const { data, error } = await supabase
        .from("produtos")
        .update(produto)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setProdutos((prev) => prev.map((p) => (p.id === id ? data : p)));
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!",
      });
      return data;
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto.",
        variant: "destructive",
      });
      return null;
    }
  };

  const excluirProduto = async (id: string) => {
    try {
      const { error } = await supabase.from("produtos").delete().eq("id", id);

      if (error) throw error;

      setProdutos((prev) => prev.filter((p) => p.id !== id));
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!",
      });
      return true;
    } catch (error: any) {
      console.error("Erro ao excluir produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    produtos,
    loading,
    fetchProdutos,
    criarProduto,
    atualizarProduto,
    excluirProduto,
  };
};
