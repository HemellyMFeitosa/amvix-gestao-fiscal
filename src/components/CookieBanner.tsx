import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Cookie, Shield, Settings } from "lucide-react";

interface CookieBannerProps {
  onAccept: () => void;
  onConfigure: () => void;
  onRejectNonEssential: () => void;
}

const CookieBanner = ({ onAccept, onConfigure, onRejectNonEssential }: CookieBannerProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-card/95 backdrop-blur-md border-t border-border shadow-2xl animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Privacidade e Cookies
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Utilizamos cookies essenciais e tecnologias semelhantes para melhorar sua experiência 
                em nossa plataforma. Alguns cookies são necessários para o funcionamento do sistema, 
                enquanto outros nos ajudam a entender como você usa o AMVIX e a personalizar sua experiência.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1 sm:mt-2">
                Ao clicar em "Aceitar Todos", você concorda com o uso de todos os cookies. 
                Para mais informações, consulte nossa{' '}
                <Link to="/politica-privacidade" className="text-primary hover:underline">
                  Política de Privacidade
                </Link>.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
            <Button 
              variant="outline" 
              onClick={onConfigure}
              className="flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Settings className="w-4 h-4" />
              Gerenciar
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onRejectNonEssential}
              className="text-xs sm:text-sm"
            >
              Apenas Necessários
            </Button>
            
            <Button 
              onClick={onAccept}
              className="text-xs sm:text-sm"
            >
              Aceitar Todos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
