import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import amvixLogo from "@/assets/amvix-logo.png";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "code" | "newPassword">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Digite seu email");
      return;
    }
    toast.success("Código enviado para seu email!");
    setStep("code");
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast.error("Digite o código completo");
      return;
    }
    toast.success("Código verificado!");
    setStep("newPassword");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    toast.success("Senha redefinida com sucesso!");
    window.location.href = "/login";
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const passwordRequirements = [
    { text: "Mínimo de 8 caracteres", met: password.length >= 8 },
    { text: "Uma letra maiúscula", met: /[A-Z]/.test(password) },
    { text: "Uma letra minúscula", met: /[a-z]/.test(password) },
    { text: "Um número", met: /[0-9]/.test(password) },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={amvixLogo} alt="AMVIX Logo" className="h-16 mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold mb-2">Recuperar Senha</h1>
          <p className="text-muted-foreground">
            {step === "email" && "Digite seu email para receber o código"}
            {step === "code" && "Digite o código de 6 dígitos enviado"}
            {step === "newPassword" && "Defina sua nova senha"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          {step === "email" && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Enviar Código
              </Button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="space-y-2">
                <Label>Código de Verificação</Label>
                <div className="flex gap-2 justify-center">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeInput(index, e.target.value)}
                      className="w-12 h-14 text-center text-xl font-bold bg-background"
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("email")}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button type="submit" className="flex-1" size="lg">
                  Verificar
                </Button>
              </div>
            </form>
          )}

          {step === "newPassword" && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-background"
                />
              </div>

              {password && (
                <div className="p-4 bg-background rounded-lg border border-border">
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

              <Button type="submit" className="w-full" size="lg">
                Redefinir Senha
              </Button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
            ← Voltar para login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
