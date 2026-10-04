import { useState, useEffect } from "react";

export interface CookieConsentimento {
  aceito: boolean;
  dataConsentimento: string;
  cookies: {
    necessarios: boolean;
    analiticos: boolean;
    marketing: boolean;
    funcionais: boolean;
  };
  navegador: string;
}

const STORAGE_KEY = "lgpd_consentimento";

export const useLGPDConsentimento = () => {
  const [consentimento, setConsentimento] = useState<CookieConsentimento | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [mostrarBanner, setMostrarBanner] = useState(!consentimento);

  useEffect(() => {
    if (consentimento) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentimento));
    }
  }, [consentimento]);

  const aceitarTodos = () => {
    const novoConsentimento: CookieConsentimento = {
      aceito: true,
      dataConsentimento: new Date().toISOString(),
      cookies: {
        necessarios: true,
        analiticos: true,
        marketing: true,
        funcionais: true,
      },
      navegador: navigator.userAgent,
    };
    setConsentimento(novoConsentimento);
    setMostrarBanner(false);
  };

  const rejeitarNaoEssenciais = () => {
    const novoConsentimento: CookieConsentimento = {
      aceito: true,
      dataConsentimento: new Date().toISOString(),
      cookies: {
        necessarios: true,
        analiticos: false,
        marketing: false,
        funcionais: false,
      },
      navegador: navigator.userAgent,
    };
    setConsentimento(novoConsentimento);
    setMostrarBanner(false);
  };

  const salvarPreferencias = (cookies: CookieConsentimento["cookies"]) => {
    const novoConsentimento: CookieConsentimento = {
      aceito: true,
      dataConsentimento: new Date().toISOString(),
      cookies: {
        necessarios: true, // sempre true
        analiticos: cookies.analiticos,
        marketing: cookies.marketing,
        funcionais: cookies.funcionais,
      },
      navegador: navigator.userAgent,
    };
    setConsentimento(novoConsentimento);
    setMostrarBanner(false);
  };

  const revogarConsentimento = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConsentimento(null);
    setMostrarBanner(true);
  };

  return {
    consentimento,
    mostrarBanner,
    aceitarTodos,
    rejeitarNaoEssenciais,
    salvarPreferencias,
    revogarConsentimento,
  };
};
