import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Empresa } from '@/contexts/EmpresaContext';
import { getSafeErrorMessage, logError } from '@/lib/errorMapper';

export const useEmpresas = () => {
  const [loading, setLoading] = useState(false);

  const criarEmpresa = async (empresa: Omit<Empresa, 'id'>) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('empresas')
        .insert({
          ...empresa,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const empresaData = data as Empresa;

      toast({
        title: 'Empresa criada com sucesso',
        description: `${empresa.nome_fantasia} foi cadastrada`,
      });

      return empresaData;
    } catch (error: unknown) {
      logError('useEmpresas.criarEmpresa', error);
      toast({
        title: 'Erro ao criar empresa',
        description: getSafeErrorMessage(error),
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const atualizarEmpresa = async (id: string, empresa: Partial<Empresa>) => {
    try {
      setLoading(true);

      // Remover campos que não devem ser atualizados diretamente
      const { certificado_validade, certificado_status, certificado_arquivo, ...dadosAtualizacao } = empresa;
      
      const { data, error } = await supabase
        .from('empresas')
        .update(dadosAtualizacao)
        .eq('id', id)
        .select('id, codigo, cnpj, razao_social, nome_fantasia, inscricao_estadual, inscricao_municipal, regime_tributario, status, cep, logradouro, numero, complemento, bairro, cidade, estado, telefone, celular, email, site, certificado_arquivo, certificado_validade, certificado_status, created_at, updated_at')
        .single();

      if (error) throw error;

      const empresaData = data as Empresa;

      toast({
        title: 'Empresa atualizada',
        description: 'As informações foram salvas com sucesso',
      });

      return empresaData;
    } catch (error: unknown) {
      logError('useEmpresas.atualizarEmpresa', error);
      toast({
        title: 'Erro ao atualizar empresa',
        description: getSafeErrorMessage(error),
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const excluirEmpresa = async (id: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('empresas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Empresa excluída',
        description: 'A empresa foi removida do sistema',
      });

      return true;
    } catch (error: unknown) {
      logError('useEmpresas.excluirEmpresa', error);
      toast({
        title: 'Erro ao excluir empresa',
        description: getSafeErrorMessage(error),
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    criarEmpresa,
    atualizarEmpresa,
    excluirEmpresa,
  };
};
