import { useState, useCallback } from "react";
import { useUsuarioLogado } from "./useUsuarioLogado";

export const useEmpresaAtual = () => {
  const { usuario, trocarEmpresa } = useUsuarioLogado();
  const [isLoading, setIsLoading] = useState(false);

  const handleTrocarEmpresa = useCallback(async (empresaId: string) => {
    if (!usuario || !usuario.empresaAtual || empresaId === usuario.empresaAtual.id) return;

    setIsLoading(true);
    
    // Simular delay de carregamento (em produção, aqui viriam chamadas à API)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    trocarEmpresa(empresaId);
    
    // Disparar evento customizado para notificar outros componentes
    window.dispatchEvent(new CustomEvent('empresaChanged', { 
      detail: { empresaId } 
    }));
    
    setIsLoading(false);
  }, [usuario, trocarEmpresa]);

  return {
    empresaAtual: usuario?.empresaAtual,
    empresasDisponiveis: usuario?.empresasDisponiveis || [],
    isLoading,
    trocarEmpresa: handleTrocarEmpresa
  };
};
