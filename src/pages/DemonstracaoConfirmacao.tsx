import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Headphones, Clock, ArrowLeft } from "lucide-react";
import amvixLogo from "@/assets/amvix-logo.png";

const DemonstracaoConfirmacao = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <Link to="/" className="mb-8">
        <img src={amvixLogo} alt="AMVIX Logo" className="h-16" />
      </Link>

      {/* Container Principal */}
      <div className="w-full max-w-3xl">
        {/* Ícone de Sucesso Animado */}
        <div className="flex justify-center mb-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-16 h-16 text-primary animate-in zoom-in duration-700 delay-200" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          Solicitação Recebida com Sucesso!
        </h1>

        {/* Cards Informativos */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <Card className="border-border bg-card hover:border-primary/50 transition-smooth">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Obrigado pelo seu interesse!</h3>
              <p className="text-muted-foreground text-sm">
                Recebemos sua solicitação de demonstração do AMVIX e estamos ansiosos para mostrar como o AMVIX pode organizar a gestão fiscal da sua carteira de clientes.
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="border-border bg-card hover:border-primary/50 transition-smooth">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Headphones className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Um analista entrará em contato</h3>
              <p className="text-muted-foreground text-sm">
                Nossa equipe especializada analisará suas informações e entrará em contato para agendar uma demonstração personalizada do sistema.
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="border-border bg-card hover:border-primary/50 transition-smooth">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Prazo de retorno</h3>
              <p className="text-muted-foreground text-sm">
                Normalmente respondemos em até 24 horas úteis. Verifique sua caixa de entrada e também o spam para não perder nosso contato.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Botão Voltar */}
        <div className="text-center">
          <Link to="/">
            <Button variant="ghost" size="lg" className="gap-2">
              <ArrowLeft className="w-5 h-5" />
              Voltar para a Página Principal
            </Button>
          </Link>
        </div>

        {/* Rodapé */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">UM PRODUTO AMVIX</p>
        </div>
      </div>
    </div>
  );
};

export default DemonstracaoConfirmacao;
