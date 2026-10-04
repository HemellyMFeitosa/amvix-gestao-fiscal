import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import amvixLogo from "@/assets/amvix-logo.png";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido").max(255, "Email muito longo"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(128, "Senha muito longa"),
});

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Por favor, confirme seu email antes de fazer login");
        } else {
          toast.error("Erro ao fazer login. Tente novamente.");
        }
        return;
      }

      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F1729] via-[#1a2847] to-[#0F1729]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0F1729] via-[#1a2847] to-[#0F1729] flex items-center justify-center px-6">
      {/* Background animado de partículas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          {/* Partículas animadas */}
          <div className="animate-float-slow absolute top-20 left-10 w-2 h-2 bg-cyan-400/30 rounded-full"></div>
          <div className="animate-float-medium absolute top-40 right-20 w-3 h-3 bg-cyan-500/20 rounded-full"></div>
          <div className="animate-float-fast absolute bottom-32 left-1/4 w-2 h-2 bg-cyan-400/40 rounded-full"></div>
          <div className="animate-float-slow absolute top-60 right-1/3 w-2 h-2 bg-cyan-500/25 rounded-full"></div>
          <div className="animate-float-medium absolute bottom-40 right-10 w-3 h-3 bg-cyan-400/35 rounded-full"></div>
          <div className="animate-float-fast absolute top-1/3 left-20 w-2 h-2 bg-cyan-500/30 rounded-full"></div>
          <div className="animate-float-slow absolute bottom-20 left-1/3 w-3 h-3 bg-cyan-400/20 rounded-full"></div>
          <div className="animate-float-medium absolute top-1/4 right-1/4 w-2 h-2 bg-cyan-500/40 rounded-full"></div>
          <div className="animate-float-fast absolute bottom-1/3 left-10 w-2 h-2 bg-cyan-400/25 rounded-full"></div>
          <div className="animate-float-slow absolute top-1/2 right-40 w-3 h-3 bg-cyan-500/35 rounded-full"></div>
          <div className="animate-float-medium absolute bottom-1/4 right-1/3 w-2 h-2 bg-cyan-400/30 rounded-full"></div>
          <div className="animate-float-fast absolute top-3/4 left-1/4 w-3 h-3 bg-cyan-500/20 rounded-full"></div>
          
          {/* Linhas de conexão animadas */}
          <svg className="absolute inset-0 w-full h-full">
            <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="rgba(0,217,255,0.1)" strokeWidth="1">
              <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
            </line>
            <line x1="70%" y1="30%" x2="50%" y2="60%" stroke="rgba(0,217,255,0.1)" strokeWidth="1">
              <animate attributeName="opacity" values="0.1;0.3;0.1" dur="4s" repeatCount="indefinite" />
            </line>
            <line x1="20%" y1="70%" x2="40%" y2="50%" stroke="rgba(0,217,255,0.1)" strokeWidth="1">
              <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3.5s" repeatCount="indefinite" />
            </line>
            <line x1="80%" y1="60%" x2="60%" y2="80%" stroke="rgba(0,217,255,0.1)" strokeWidth="1">
              <animate attributeName="opacity" values="0.1;0.3;0.1" dur="4.5s" repeatCount="indefinite" />
            </line>
          </svg>
        </div>
      </div>

      {/* Conteúdo do login */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src={amvixLogo} alt="AMVIX Logo" className="h-16 mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-400">Entre com suas credenciais para continuar</p>
        </div>

        <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="block text-white font-medium mb-2 text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com.br"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#0F1729] border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-white font-medium mb-2 text-sm">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0F1729] border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 pr-10"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox id="remember" />
                <span className="text-sm text-gray-300">Mantenha-me conectado</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 transition">
                Esqueci minha senha
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 rounded-lg transition transform hover:scale-105"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-white text-sm transition inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
