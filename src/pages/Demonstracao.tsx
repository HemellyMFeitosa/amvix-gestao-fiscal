import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, Check, Cloud, Shield, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import amvixLogo from "@/assets/amvix-logo.png";

const Demonstracao = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    porteCarteira: "",
    captcha: "",
    consentimento: false
  });

  const [errors, setErrors] = useState({
    nome: false,
    email: false,
    telefone: false,
    empresa: false,
    porteCarteira: false,
    captcha: false,
    consentimento: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: false }));
  };

  const validateForm = () => {
    const newErrors = {
      nome: !formData.nome.trim(),
      email: !formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email),
      telefone: !formData.telefone.trim(),
      empresa: !formData.empresa.trim(),
      porteCarteira: !formData.porteCarteira,
      captcha: formData.captcha !== "15",
      consentimento: !formData.consentimento
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast({
        title: "Solicitação enviada!",
        description: "Redirecionando para a página de confirmação...",
      });
      
      setTimeout(() => {
        navigate("/demonstracao/confirmacao");
      }, 1000);
    } else {
      toast({
        title: "Erro no formulário",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/5592999999999", "_blank");
  };

  const beneficios = [
    "Painel multiempresa para toda a carteira",
    "Portal de consulta para os seus clientes",
    "Controle de NF-e, NFS-e e NFC-e por CNPJ",
    "Acompanhamento de SPED Fiscal e EFD-Reinf",
    "Gestão de certificados digitais",
    "Perfis de acesso para sócios, equipe e clientes"
  ];

  const opcoesCarteira = [
    { value: "propria", label: "Sou uma empresa (cuido só da minha)" },
    { value: "1-20", label: "1 a 20 empresas" },
    { value: "21-50", label: "21 a 50 empresas" },
    { value: "51-200", label: "51 a 200 empresas" },
    { value: "200+", label: "Mais de 200 empresas" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-6 relative">
      {/* Logo */}
      <Link to="/" className="mb-8">
        <img src={amvixLogo} alt="AMVIX Logo" className="h-16" />
      </Link>

      {/* Container do Formulário */}
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-8 shadow-glow">
        {/* Título Principal */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent leading-tight">
            Veja o AMVIX na rotina do seu escritório
          </h1>
          <h2 className="text-lg md:text-xl text-primary font-medium mb-4">
            Gestão fiscal de toda a sua carteira de clientes, com portal de consulta para cada empresa
          </h2>
        </div>

        {/* Badges de Credibilidade */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <div className="px-4 py-2 bg-muted/50 rounded-full text-xs text-muted-foreground flex items-center gap-2">
            <Cloud className="w-3 h-3" /> 100% Cloud
          </div>
          <div className="px-4 py-2 bg-muted/50 rounded-full text-xs text-muted-foreground flex items-center gap-2">
            <Shield className="w-3 h-3" /> Dados isolados por cliente
          </div>
          <div className="px-4 py-2 bg-muted/50 rounded-full text-xs text-muted-foreground flex items-center gap-2">
            <FileCheck className="w-3 h-3" /> Multiempresa e filiais
          </div>
        </div>

        {/* Lista de Benefícios */}
        <div className="mb-6 bg-muted/30 rounded-lg p-5">
          <h3 className="text-base font-semibold text-foreground mb-4 text-center">
            ✨ O que você terá acesso na demonstração:
          </h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{beneficio}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Descrição */}
        <p className="text-center text-muted-foreground mb-6 text-sm">
          Preencha os campos abaixo e nossa equipe entrará em contato para uma demonstração
          gratuita, montada de acordo com o tamanho da sua carteira de clientes.
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              type="text"
              placeholder="Digite seu nome completo"
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              className={errors.nome ? "border-destructive" : ""}
            />
            {errors.nome && (
              <p className="text-destructive text-sm mt-1">Nome é obrigatório</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com.br"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">Email válido é obrigatório</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <Label htmlFor="telefone">Telefone *</Label>
            <div className="flex gap-2">
              <span className="w-16 h-10 rounded-md border border-input bg-muted/50 px-3 text-sm flex items-center justify-center text-muted-foreground">
                +55
              </span>
              <Input
                id="telefone"
                type="tel"
                placeholder="(92) 98413-2142"
                value={formData.telefone}
                onChange={(e) => handleInputChange("telefone", e.target.value)}
                className={errors.telefone ? "border-destructive flex-1" : "flex-1"}
              />
            </div>
            {errors.telefone && (
              <p className="text-destructive text-sm mt-1">Telefone é obrigatório</p>
            )}
          </div>

          {/* Empresa */}
          <div>
            <Label htmlFor="empresa">Escritório ou empresa *</Label>
            <Input
              id="empresa"
              type="text"
              placeholder="Nome do seu escritório contábil"
              value={formData.empresa}
              onChange={(e) => handleInputChange("empresa", e.target.value)}
              className={errors.empresa ? "border-destructive" : ""}
            />
            {errors.empresa && (
              <p className="text-destructive text-sm mt-1">Escritório ou empresa é obrigatório</p>
            )}
          </div>

          {/* Porte da carteira */}
          <div>
            <Label htmlFor="porteCarteira">Quantas empresas você atende? *</Label>
            <select
              id="porteCarteira"
              value={formData.porteCarteira}
              onChange={(e) => handleInputChange("porteCarteira", e.target.value)}
              className={`w-full h-10 rounded-md border bg-background px-3 text-sm ${errors.porteCarteira ? "border-destructive" : "border-input"}`}
            >
              <option value="" disabled>Selecione</option>
              {opcoesCarteira.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
              ))}
            </select>
            {errors.porteCarteira && (
              <p className="text-destructive text-sm mt-1">Selecione o tamanho da carteira</p>
            )}
          </div>

          {/* Captcha */}
          <div>
            <Label htmlFor="captcha">5 + 10 = ? *</Label>
            <Input
              id="captcha"
              type="number"
              placeholder="Digite o resultado"
              value={formData.captcha}
              onChange={(e) => handleInputChange("captcha", e.target.value)}
              className={errors.captcha ? "border-destructive" : ""}
            />
            {errors.captcha && (
              <p className="text-destructive text-sm mt-1">Resposta incorreta</p>
            )}
          </div>

          {/* Consentimento */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="consentimento"
              checked={formData.consentimento}
              onCheckedChange={(checked) => handleInputChange("consentimento", checked as boolean)}
              className={errors.consentimento ? "border-destructive" : ""}
            />
            <Label htmlFor="consentimento" className="text-sm leading-relaxed cursor-pointer">
              Eu concordo em receber comunicações.{" "}
              <Link to="/politica-privacidade" className="text-primary hover:underline">
                Acesse nossa política para saber mais
              </Link>
            </Label>
          </div>
          {errors.consentimento && (
            <p className="text-destructive text-sm">Você deve concordar para continuar</p>
          )}

          {/* Botão de Envio */}
          <Button type="submit" size="lg" className="w-full">
            QUERO CONHECER
          </Button>
        </form>

        {/* Rodapé */}
        <div className="text-center mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">UM PRODUTO AMVIX</p>
        </div>
      </div>

      {/* Botão WhatsApp Flutuante */}
      <Button
        onClick={handleWhatsApp}
        size="icon"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-glow"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default Demonstracao;
