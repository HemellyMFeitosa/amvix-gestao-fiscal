import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Interface segura - NÃO inclui certificado_senha para evitar exposição
export interface Empresa {
  id: string;
  user_id?: string;
  codigo: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  regime_tributario: string;
  status: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
  celular?: string;
  email?: string;
  site?: string;
  certificado_arquivo?: string;
  // certificado_senha removido por segurança - usar RPC get_certificado_senha quando necessário
  certificado_validade?: string;
  certificado_status?: string;
  created_at?: string;
  updated_at?: string;
}

interface EmpresaContextType {
  empresaAtual: Empresa | null;
  empresas: Empresa[];
  loading: boolean;
  selecionarEmpresa: (empresa: Empresa) => void;
  carregarEmpresas: () => Promise<void>;
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

export const EmpresaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [empresaAtual, setEmpresaAtual] = useState<Empresa | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarEmpresas = async () => {
    try {
      setLoading(true);
      // Usar view segura que não expõe certificado_senha
      const { data, error } = await supabase
        .from('empresas_segura')
        .select('*')
        .order('codigo', { ascending: true });

      if (error) throw error;

      const empresasData = (data || []) as Empresa[];
      setEmpresas(empresasData);

      // Carregar empresa selecionada do localStorage
      const empresaSalva = localStorage.getItem('empresaAtual');
      if (empresaSalva && empresasData.length > 0) {
        const empresaEncontrada = empresasData.find((e) => e.id === empresaSalva);
        if (empresaEncontrada && empresaEncontrada.status === 'Ativa') {
          setEmpresaAtual(empresaEncontrada);
        } else {
          // Se não encontrar ou estiver inativa, selecionar a primeira ativa
          const primeiraAtiva = empresasData.find((e) => e.status === 'Ativa');
          if (primeiraAtiva) {
            setEmpresaAtual(primeiraAtiva);
            localStorage.setItem('empresaAtual', primeiraAtiva.id);
          }
        }
      } else if (empresasData.length > 0) {
        // Se não há empresa salva, selecionar a primeira ativa
        const primeiraAtiva = empresasData.find((e) => e.status === 'Ativa');
        if (primeiraAtiva) {
          setEmpresaAtual(primeiraAtiva);
          localStorage.setItem('empresaAtual', primeiraAtiva.id);
        }
      }
    } catch (error: any) {
      console.error('Erro ao carregar empresas:', error);
      toast({
        title: 'Erro ao carregar empresas',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const selecionarEmpresa = (empresa: Empresa) => {
    if (empresa.status !== 'Ativa') {
      toast({
        title: 'Empresa inativa',
        description: 'Não é possível selecionar uma empresa inativa',
        variant: 'destructive',
      });
      return;
    }

    setEmpresaAtual(empresa);
    localStorage.setItem('empresaAtual', empresa.id);
    
    toast({
      title: 'Empresa selecionada',
      description: `${empresa.nome_fantasia} está agora ativa`,
    });
  };

  useEffect(() => {
    // Limpar dados antigos mockados do localStorage
    const usuarioLogadoAntigo = localStorage.getItem('usuario_logado');
    if (usuarioLogadoAntigo) {
      try {
        const dados = JSON.parse(usuarioLogadoAntigo);
        // Se existem empresasDisponiveis mockadas, remover
        if (dados.empresasDisponiveis) {
          delete dados.empresasDisponiveis;
          delete dados.empresaAtual;
          localStorage.setItem('usuario_logado', JSON.stringify(dados));
        }
      } catch (e) {
        console.error('Erro ao limpar dados antigos:', e);
      }
    }
    
    carregarEmpresas();
  }, []);

  return (
    <EmpresaContext.Provider
      value={{
        empresaAtual,
        empresas,
        loading,
        selecionarEmpresa,
        carregarEmpresas,
      }}
    >
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresa = () => {
  const context = useContext(EmpresaContext);
  if (context === undefined) {
    throw new Error('useEmpresa must be used within an EmpresaProvider');
  }
  return context;
};
