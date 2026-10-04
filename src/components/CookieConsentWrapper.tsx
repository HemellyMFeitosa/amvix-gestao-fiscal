import { useState } from "react";
import CookieBanner from "./CookieBanner";
import ConfigurarCookiesDialog from "./ConfigurarCookiesDialog";
import { useLGPDConsentimento } from "@/hooks/useLGPDConsentimento";

const CookieConsentWrapper = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { 
    mostrarBanner, 
    consentimento,
    aceitarTodos, 
    rejeitarNaoEssenciais, 
    salvarPreferencias 
  } = useLGPDConsentimento();

  if (!mostrarBanner) return null;

  return (
    <>
      <CookieBanner 
        onAccept={aceitarTodos}
        onConfigure={() => setShowSettings(true)}
        onRejectNonEssential={rejeitarNaoEssenciais}
      />
      
      <ConfigurarCookiesDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        onSave={salvarPreferencias}
        onReject={rejeitarNaoEssenciais}
        onAcceptAll={aceitarTodos}
        currentSettings={consentimento?.cookies}
      />
    </>
  );
};

export default CookieConsentWrapper;
