import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Lock, BarChart3, Megaphone, Settings } from "lucide-react";
import type { CookieConsentimento } from "@/hooks/useLGPDConsentimento";

interface ConfigurarCookiesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (cookies: CookieConsentimento["cookies"]) => void;
  onReject: () => void;
  onAcceptAll: () => void;
  currentSettings?: CookieConsentimento["cookies"];
}

const ConfigurarCookiesDialog = ({
  open,
  onOpenChange,
  onSave,
  onReject,
  onAcceptAll,
  currentSettings,
}: ConfigurarCookiesDialogProps) => {
  const [cookies, setCookies] = useState<CookieConsentimento["cookies"]>(
    currentSettings || {
      necessarios: true,
      analiticos: true,
      marketing: true,
      funcionais: true,
    }
  );

  const handleSave = () => {
    onSave(cookies);
    onOpenChange(false);
  };

  const handleReject = () => {
    onReject();
    onOpenChange(false);
  };

  const handleAccept = () => {
    onAcceptAll();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Configurações de Cookies e Privacidade</DialogTitle>
          <DialogDescription>
            Nós utilizamos cookies para melhorar sua experiência no AMVIX. Você pode gerenciar suas
            preferências abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            {/* Cookies Necessários */}
            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">Cookies Necessários</h4>
                </div>
                <div className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full">
                  SEMPRE ATIVO
                </div>
              </div>
              <p className="text-sm text-muted-foreground ml-8">
                Essenciais para o funcionamento do site. Não podem ser desativados.
                <br />
                <span className="text-xs">Exemplos: sessão, autenticação, segurança</span>
              </p>
            </div>

            {/* Cookies Analíticos */}
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Cookies Analíticos</h4>
                    <p className="text-sm text-muted-foreground">
                      Ajudam a entender como você usa o site. Coletam informações de forma anônima.
                      <br />
                      <span className="text-xs">Exemplos: Google Analytics, métricas de uso</span>
                    </p>
                  </div>
                </div>
                <Switch
                  checked={cookies.analiticos}
                  onCheckedChange={(checked) =>
                    setCookies({ ...cookies, analiticos: checked })
                  }
                />
              </div>
            </div>

            {/* Cookies de Marketing */}
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  <Megaphone className="w-5 h-5 text-purple-400" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Cookies de Marketing</h4>
                    <p className="text-sm text-muted-foreground">
                      Usados para personalizar anúncios. Rastreiam suas preferências e interesses.
                      <br />
                      <span className="text-xs">Exemplos: Google Ads, Facebook Pixel</span>
                    </p>
                  </div>
                </div>
                <Switch
                  checked={cookies.marketing}
                  onCheckedChange={(checked) =>
                    setCookies({ ...cookies, marketing: checked })
                  }
                />
              </div>
            </div>

            {/* Cookies Funcionais */}
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  <Settings className="w-5 h-5 text-green-400" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Cookies Funcionais</h4>
                    <p className="text-sm text-muted-foreground">
                      Melhoram a funcionalidade e personalização. Lembram suas preferências.
                      <br />
                      <span className="text-xs">
                        Exemplos: idioma, tema, preferências de exibição
                      </span>
                    </p>
                  </div>
                </div>
                <Switch
                  checked={cookies.funcionais}
                  onCheckedChange={(checked) =>
                    setCookies({ ...cookies, funcionais: checked })
                  }
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Suas escolhas:</strong> Você pode alterar suas preferências a qualquer momento
              através das configurações do sistema.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleReject} className="flex-1">
            Rejeitar Não Essenciais
          </Button>
          <Button variant="secondary" onClick={handleSave} className="flex-1">
            Salvar Preferências
          </Button>
          <Button onClick={handleAccept} className="flex-1">
            Aceitar Tudo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurarCookiesDialog;
