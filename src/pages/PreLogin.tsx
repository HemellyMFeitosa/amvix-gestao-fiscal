import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Users } from "lucide-react";
import amvixLogo from "@/assets/amvix-logo.png";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import ConfigurarCookiesDialog from "@/components/ConfigurarCookiesDialog";
import { useLGPDConsentimento } from "@/hooks/useLGPDConsentimento";
import { useState } from "react";

const PreLogin = () => {
  const { mostrarBanner, aceitarTodos, rejeitarNaoEssenciais, salvarPreferencias, consentimento } = useLGPDConsentimento();
  const [showCookiesDialog, setShowCookiesDialog] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <img src={amvixLogo} alt="AMVIX Logo" className="h-12" />
          <Link to="/login">
            <Button variant="outline" size="default">
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Gestão fiscal para
            <br />
            escritórios contábeis
          </h1>
          <p className="text-xl text-muted-foreground mb-10">
            Toda a sua carteira de clientes em um único painel, com um portal de consulta
            para cada empresa.
          </p>
          <div className="flex justify-center">
            <Link to="/demonstracao">
              <Button variant="default" size="lg">
                Solicitar Demonstração
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher o AMVIX?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-smooth">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Toda a Carteira em um Painel</h3>
              <p className="text-muted-foreground">
                Notas, obrigações e certificados de todos os CNPJs que você atende
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-smooth">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dados Isolados por Cliente</h3>
              <p className="text-muted-foreground">
                Cada empresa só enxerga o que é dela, com isolamento no banco de dados
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-smooth">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sócios, Equipe e Clientes</h3>
              <p className="text-muted-foreground">
                O sócio administra, a equipe opera e o cliente apenas consulta
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />

      {/* Cookie Banner */}
      {mostrarBanner && (
        <CookieBanner
          onAccept={aceitarTodos}
          onConfigure={() => setShowCookiesDialog(true)}
          onRejectNonEssential={rejeitarNaoEssenciais}
        />
      )}

      {/* Cookie Configuration Dialog */}
      <ConfigurarCookiesDialog
        open={showCookiesDialog}
        onOpenChange={setShowCookiesDialog}
        onSave={salvarPreferencias}
        onReject={rejeitarNaoEssenciais}
        onAcceptAll={aceitarTodos}
        currentSettings={consentimento?.cookies}
      />
    </div>
  );
};

export default PreLogin;
