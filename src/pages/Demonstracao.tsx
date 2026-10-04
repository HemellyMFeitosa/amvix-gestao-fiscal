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
    captcha: "",
    consentimento: false,
    codigoPais: "+55"
  });

  const [errors, setErrors] = useState({
    nome: false,
    email: false,
    telefone: false,
    empresa: false,
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
    "Emissão de NF-e, NFC-e e NFS-e",
    "Gestão de clientes e produtos",
    "Controle tributário automatizado",
    "Relatórios em tempo real",
    "Integração com SEFAZ",
    "Suporte especializado"
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
            Transforme sua gestão empresarial com o AMVIX
          </h1>
          <h2 className="text-lg md:text-xl text-primary font-medium mb-4">
            Sistema completo de emissão de notas fiscais e controle tributário
          </h2>
        </div>

        {/* Badges de Credibilidade */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <div className="px-4 py-2 bg-muted/50 rounded-full text-xs text-muted-foreground flex items-center gap-2">
            <Cloud className="w-3 h-3" /> 100% Cloud
          </div>
          <div className="px-4 py-2 bg-muted/50 rounded-full text-xs text-muted-foreground flex items-center gap-2">
            <Shield className="w-3 h-3" /> Totalmente Seguro
          </div>
          <div className="px-4 py-2 bg-muted/50 rounded-full text-xs text-muted-foreground flex items-center gap-2">
            <FileCheck className="w-3 h-3" /> Homologado SEFAZ
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
          Preencha os campos abaixo e nossa equipe entrará em contato para apresentar 
          todas as funcionalidades do AMVIX em uma demonstração personalizada e gratuita.
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
              <select
                value={formData.codigoPais}
                onChange={(e) => handleInputChange("codigoPais", e.target.value)}
                className="w-28 h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="+55">🇧🇷 +55</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+351">🇵🇹 +351</option>
              </select>
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
            <Label htmlFor="empresa">Empresa *</Label>
            <Input
              id="empresa"
              type="text"
              placeholder="Nome da sua empresa"
              value={formData.empresa}
              onChange={(e) => handleInputChange("empresa", e.target.value)}
              className={errors.empresa ? "border-destructive" : ""}
            />
            {errors.empresa && (
              <p className="text-destructive text-sm mt-1">Empresa é obrigatório</p>
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
              <Link to="/" className="text-primary hover:underline">
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
