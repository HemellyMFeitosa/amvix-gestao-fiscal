import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEmpresa } from "@/contexts/EmpresaContext";
import { useToast } from "@/hooks/use-toast";

export interface ClienteFornecedor {
  id: string;
  empresa_id: string;
  tipo: "cliente" | "fornecedor" | "ambos";
  tipo_pessoa: "fisica" | "juridica";
  cpf_cnpj: string;
  nome_razao_social: string;
  nome_fantasia: string | null;
  ie: string | null;
  telefone: string | null;
  email: string | null;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export type ClienteFornecedorInput = Omit<ClienteFornecedor, "id" | "empresa_id" | "created_at" | "updated_at">;

export const useClientesFornecedores = () => {
  const [registros, setRegistros] = useState<ClienteFornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const { empresaAtual: empresaSelecionada } = useEmpresa();
  const { toast } = useToast();

  const fetchRegistros = async () => {
    if (!empresaSelecionada) {
      setRegistros([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("clientes_fornecedores")
        .select("*")
        .eq("empresa_id", empresaSelecionada.id)
        .order("nome_razao_social");

      if (error) throw error;
      setRegistros((data || []) as ClienteFornecedor[]);
    } catch (error: any) {
      console.error("Erro ao carregar registros:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os registros.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, [empresaSelecionada]);

  const criarRegistro = async (registro: ClienteFornecedorInput) => {
    if (!empresaSelecionada) return null;

    try {
      const { data, error } = await supabase
        .from("clientes_fornecedores")
        .insert({
          ...registro,
          empresa_id: empresaSelecionada.id,
        })
        .select()
        .single();

      if (error) throw error;

      setRegistros((prev) => [...prev, data as ClienteFornecedor]);
      toast({
        title: "Sucesso",
        description: "Cadastro realizado com sucesso!",
      });
      return data;
    } catch (error: any) {
      console.error("Erro ao criar registro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar o cadastro.",
        variant: "destructive",
      });
      return null;
    }
  };

  const atualizarRegistro = async (id: string, registro: Partial<ClienteFornecedorInput>) => {
    try {
      const { data, error } = await supabase
        .from("clientes_fornecedores")
        .update(registro)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setRegistros((prev) => prev.map((r) => (r.id === id ? (data as ClienteFornecedor) : r)));
      toast({
        title: "Sucesso",
        description: "Cadastro atualizado com sucesso!",
      });
      return data;
    } catch (error: any) {
      console.error("Erro ao atualizar registro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cadastro.",
        variant: "destructive",
      });
      return null;
    }
  };

  const excluirRegistro = async (id: string) => {
    try {
      const { error } = await supabase.from("clientes_fornecedores").delete().eq("id", id);

      if (error) throw error;

      setRegistros((prev) => prev.filter((r) => r.id !== id));
      toast({
        title: "Sucesso",
        description: "Cadastro excluído com sucesso!",
      });
      return true;
    } catch (error: any) {
      console.error("Erro ao excluir registro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cadastro.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    registros,
    loading,
    fetchRegistros,
    criarRegistro,
    atualizarRegistro,
    excluirRegistro,
  };
};
