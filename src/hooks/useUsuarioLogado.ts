import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Empresa {
  id: string;
  codigo: string;
  nome_fantasia: string;
  cidade: string | null;
  cnpj: string;
}

export interface UsuarioLogado {
  id: string;
  nomeCompleto: string;
  email: string;
  perfil: "admin" | "contador" | "cliente";
  foto: string | null;
  telefone: string | null;
  empresaAtual: Empresa | null;
  empresasDisponiveis: Empresa[];
}

const FOTO_STORAGE_KEY = "usuario_foto";
const EMPRESA_STORAGE_KEY = "empresa_selecionada";

export const useUsuarioLogado = () => {
  const { user, role, signOut, loading: authLoading } = useAuth();
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    
    if (user) {
      carregarUsuario();
    } else {
      setUsuario(null);
      setLoading(false);
    }
  }, [user, role, authLoading]);

  const carregarUsuario = async () => {
    if (!user) return;

    try {
      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Erro ao carregar perfil:", profileError);
      }

      // Buscar empresas do usuário
      const { data: empresas, error: empresasError } = await supabase
        .from("empresas")
        .select("id, codigo, nome_fantasia, cidade, cnpj")
        .eq("status", "Ativa");

      if (empresasError) {
        console.error("Erro ao carregar empresas:", empresasError);
      }

      // Recuperar foto do localStorage
      const fotoSalva = localStorage.getItem(FOTO_STORAGE_KEY);

      // Recuperar empresa selecionada
      const empresaSalvaId = localStorage.getItem(EMPRESA_STORAGE_KEY);
      let empresaAtual: Empresa | null = null;
      
      if (empresas && empresas.length > 0) {
        if (empresaSalvaId) {
          empresaAtual = empresas.find(e => e.id === empresaSalvaId) || empresas[0];
        } else {
          empresaAtual = empresas[0];
        }
      }

      setUsuario({
        id: user.id,
        nomeCompleto: profile?.nome_completo || user.email || "Usuário",
        email: profile?.email || user.email || "",
        perfil: (role || "cliente") as "admin" | "contador" | "cliente",
        foto: fotoSalva,
        telefone: profile?.telefone || null,
        empresaAtual,
        empresasDisponiveis: empresas || [],
      });
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarUsuario = async (dados: Partial<UsuarioLogado>) => {
    if (!usuario) return;

    // Atualizar foto no localStorage se fornecida
    if (dados.foto !== undefined) {
      if (dados.foto) {
        localStorage.setItem(FOTO_STORAGE_KEY, dados.foto);
      } else {
        localStorage.removeItem(FOTO_STORAGE_KEY);
      }
    }

    // Atualizar perfil no Supabase
    if (dados.nomeCompleto || dados.telefone) {
      const updateData: Record<string, string | null> = {};
      if (dados.nomeCompleto) updateData.nome_completo = dados.nomeCompleto;
      if (dados.telefone !== undefined) updateData.telefone = dados.telefone;

      await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", usuario.id);
    }

    setUsuario(prev => prev ? { ...prev, ...dados } : null);
  };

  const trocarEmpresa = (empresaId: string) => {
    if (!usuario) return;
    
    const novaEmpresa = usuario.empresasDisponiveis.find(e => e.id === empresaId);
    if (novaEmpresa) {
      localStorage.setItem(EMPRESA_STORAGE_KEY, empresaId);
      setUsuario(prev => prev ? { ...prev, empresaAtual: novaEmpresa } : null);
    }
  };

  const logout = async () => {
    await signOut();
    setUsuario(null);
    localStorage.removeItem(FOTO_STORAGE_KEY);
  };

  const gerarIniciais = (nomeCompleto: string) => {
    if (!nomeCompleto) return "??";
    const nomes = nomeCompleto.split(' ');
    const primeira = nomes[0]?.[0] || "";
    const ultima = nomes.length > 1 ? nomes[nomes.length - 1]?.[0] || "" : "";
    return (primeira + ultima).toUpperCase() || "??";
  };

  const corAvatar = (perfil: string) => {
    const cores: Record<string, string> = {
      admin: '#EF4444',
      contador: '#10B981',
      cliente: '#F59E0B',
    };
    return cores[perfil] || '#6B7280';
  };

  return {
    usuario,
    loading,
    atualizarUsuario,
    trocarEmpresa,
    logout,
    gerarIniciais,
    corAvatar,
  };
};
