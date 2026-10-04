import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CertificadoInfo {
  empresa_id: string;
  certificado_arquivo: string | null;
  certificado_validade: string | null;
  certificado_status: string | null;
}

export const useCertificados = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Salva a senha do certificado de forma segura usando RPC
   * A senha é criptografada no banco com pgcrypto
   */
  const salvarSenhaCertificado = async (empresaId: string, senha: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('set_certificado_senha', {
        _empresa_id: empresaId,
        _senha: senha
      });

      if (error) {
        console.error('Erro ao salvar senha do certificado:', error);
        toast({
          title: 'Erro ao salvar senha',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: 'Senha salva com segurança',
        description: 'A senha do certificado foi criptografada e armazenada',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao salvar senha do certificado:', error);
      toast({
        title: 'Erro ao salvar senha',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtém a senha do certificado descriptografada via RPC
   * Apenas o dono da empresa pode acessar
   */
  const obterSenhaCertificado = async (empresaId: string): Promise<string | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('get_certificado_senha', {
        _empresa_id: empresaId
      });

      if (error) {
        console.error('Erro ao obter senha do certificado:', error);
        toast({
          title: 'Erro ao obter senha',
          description: error.message,
          variant: 'destructive',
        });
        return null;
      }

      return data;
    } catch (error: any) {
      console.error('Erro ao obter senha do certificado:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualiza informações do certificado (arquivo, validade, status)
   * NÃO atualiza a senha - use salvarSenhaCertificado para isso
   */
  const atualizarCertificado = async (
    empresaId: string, 
    dados: { 
      certificado_arquivo?: string;
      certificado_validade?: string;
      certificado_status?: string;
    }
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('empresas')
        .update(dados)
        .eq('id', empresaId);

      if (error) {
        console.error('Erro ao atualizar certificado:', error);
        toast({
          title: 'Erro ao atualizar certificado',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: 'Certificado atualizado',
        description: 'As informações do certificado foram salvas',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar certificado:', error);
      toast({
        title: 'Erro ao atualizar certificado',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cadastra um novo certificado completo
   * 1. Atualiza arquivo, validade e status na tabela
   * 2. Salva senha via RPC (criptografada)
   */
  const cadastrarCertificado = async (
    empresaId: string,
    dados: {
      certificado_arquivo: string;
      certificado_validade: string;
      certificado_status: string;
      senha: string;
    }
  ): Promise<boolean> => {
    try {
      setLoading(true);

      // Primeiro atualiza os dados do certificado
      const { error: updateError } = await supabase
        .from('empresas')
        .update({
          certificado_arquivo: dados.certificado_arquivo,
          certificado_validade: dados.certificado_validade,
          certificado_status: dados.certificado_status,
        })
        .eq('id', empresaId);

      if (updateError) {
        throw updateError;
      }

      // Depois salva a senha via RPC (criptografada)
      const { error: rpcError } = await supabase.rpc('set_certificado_senha', {
        _empresa_id: empresaId,
        _senha: dados.senha
      });

      if (rpcError) {
        throw rpcError;
      }

      toast({
        title: 'Certificado cadastrado',
        description: 'O certificado foi configurado com sucesso',
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao cadastrar certificado:', error);
      toast({
        title: 'Erro ao cadastrar certificado',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove o certificado da empresa
   */
  const removerCertificado = async (empresaId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('empresas')
        .update({
          certificado_arquivo: null,
          certificado_validade: null,
          certificado_status: null,
        })
        .eq('id', empresaId);

      if (error) {
        throw error;
      }

      // Também limpa a senha
      await supabase.rpc('set_certificado_senha', {
        _empresa_id: empresaId,
        _senha: ''
      });

      toast({
        title: 'Certificado removido',
        description: 'O certificado foi removido da empresa',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao remover certificado:', error);
      toast({
        title: 'Erro ao remover certificado',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    salvarSenhaCertificado,
    obterSenhaCertificado,
    atualizarCertificado,
    cadastrarCertificado,
    removerCertificado,
  };
};
