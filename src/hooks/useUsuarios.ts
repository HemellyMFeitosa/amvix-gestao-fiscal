import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Usuario {
  id: string;
  nomeCompleto: string;
  email: string;
  perfil: "admin" | "contador" | "cliente";
  status: string;
  telefone: string | null;
  departamento: string | null;
  observacoes: string | null;
  ultimoAcesso: string | null;
  dataCadastro: string | null;
  cadastradoPor: string | null;
}

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) {
        console.error("Erro ao carregar perfis:", profilesError);
        return;
      }

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) {
        console.error("Erro ao carregar roles:", rolesError);
        return;
      }

      // Create a map of user_id to role
      const roleMap = new Map<string, "admin" | "contador" | "cliente">();
      roles?.forEach((r) => {
        roleMap.set(r.user_id, r.role as "admin" | "contador" | "cliente");
      });

      // Combine profiles with roles
      const usuariosFormatados: Usuario[] = (profiles || []).map((profile) => ({
        id: profile.id,
        nomeCompleto: profile.nome_completo,
        email: profile.email,
        perfil: roleMap.get(profile.id) || "cliente",
        status: profile.status || "Ativo",
        telefone: profile.telefone,
        departamento: profile.departamento,
        observacoes: profile.observacoes,
        ultimoAcesso: profile.ultimo_acesso,
        dataCadastro: profile.data_cadastro,
        cadastradoPor: profile.cadastrado_por,
      }));

      setUsuarios(usuariosFormatados);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const atualizarUsuario = async (id: string, dados: Partial<Usuario>) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        nome_completo: dados.nomeCompleto,
        telefone: dados.telefone,
        departamento: dados.departamento,
        observacoes: dados.observacoes,
        status: dados.status,
      })
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar usuário:", error);
      return false;
    }

    await carregarUsuarios();
    return true;
  };

  const atualizarRole = async (userId: string, novaRole: "admin" | "contador" | "cliente") => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: novaRole })
      .eq("user_id", userId);

    if (error) {
      console.error("Erro ao atualizar role:", error);
      return false;
    }

    await carregarUsuarios();
    return true;
  };

  const emailJaExiste = (email: string, idAtual?: string) => {
    return usuarios.some((u) => u.email === email && u.id !== idAtual);
  };

  return {
    usuarios,
    loading,
    atualizarUsuario,
    atualizarRole,
    emailJaExiste,
    recarregar: carregarUsuarios,
  };
};

export const validarEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const formatarTelefone = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
};

export const formatarDataHora = (isoString: string | null) => {
  if (!isoString) return "-";
  const data = new Date(isoString);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
