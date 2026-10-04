import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Building2, User } from "lucide-react";
import amvixLogo from "@/assets/amvix-logo.png";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createAsStore, setCreateAsStore] = useState(false);
  const [formData, setFormData] = useState({
    cnpj: "",
    razaoSocial: "",
    endereco: "",
    nomeResponsavel: "",
    telefone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordRequirements = [
    { text: "Mínimo de 8 caracteres", met: formData.password.length >= 8 },
    { text: "Uma letra maiúscula", met: /[A-Z]/.test(formData.password) },
    { text: "Uma letra minúscula", met: /[a-z]/.test(formData.password) },
    { text: "Um número", met: /[0-9]/.test(formData.password) },
    { text: "Um caractere especial", met: /[!@#$%^&*]/.test(formData.password) },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cnpj || !formData.razaoSocial || !formData.nomeResponsavel || 
        !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    const allRequirementsMet = passwordRequirements.every(req => req.met);
    if (!allRequirementsMet) {
      toast.error("A senha não atende aos requisitos mínimos");
      return;
    }

    toast.success("Conta criada com sucesso!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={amvixLogo} alt="AMVIX Logo" className="h-16 mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold mb-2">Criar Nova Conta</h1>
          <p className="text-muted-foreground">Preencha os dados para começar a usar o AMVIX</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dados da Empresa */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Dados da Empresa</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razaoSocial">Razão Social *</Label>
                  <Input
                    id="razaoSocial"
                    placeholder="Nome da empresa"
                    value={formData.razaoSocial}
                    onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    placeholder="Rua, Número, Bairro, Cidade - Estado"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Dados do Responsável */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Dados do Responsável</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nomeResponsavel">Nome Completo *</Label>
                  <Input
                    id="nomeResponsavel"
                    placeholder="Seu nome completo"
                    value={formData.nomeResponsavel}
                    onChange={(e) => setFormData({ ...formData, nomeResponsavel: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-background pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="bg-background pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-4 p-4 bg-background rounded-lg border border-border">
                  <p className="text-sm font-medium mb-2">Requisitos da senha:</p>
                  <ul className="space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <li key={index} className={`text-sm flex items-center gap-2 ${req.met ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${req.met ? 'bg-primary' : 'bg-muted-foreground'}`} />
                        {req.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="createAsStore" 
                checked={createAsStore}
                onCheckedChange={(checked) => setCreateAsStore(checked as boolean)}
              />
              <label
                htmlFor="createAsStore"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Criar conta como loja?
              </label>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Criar Conta
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Faça login
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
