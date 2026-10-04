import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Shield,
  Users,
  FileText,
  DollarSign,
  AlertCircle,
  MessageCircle,
  Check,
  Lock,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import amvixLogo from "@/assets/amvix-logo.png";

const Landing = () => {
  const navigate = useNavigate();
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(false);

  // Dados mockados para o dashboard preview
  const revenueData = [
    { mes: "Jan", valor: 45000 },
    { mes: "Fev", valor: 52000 },
    { mes: "Mar", valor: 48000 },
    { mes: "Abr", valor: 61000 },
    { mes: "Mai", valor: 55000 },
    { mes: "Jun", valor: 67000 },
  ];

  const notasFiscaisData = [
    { mes: "Jan", nfe: 340, nfse: 180, nfce: 220 },
    { mes: "Fev", nfe: 380, nfse: 210, nfce: 250 },
    { mes: "Mar", nfe: 360, nfse: 190, nfce: 240 },
  ];

  const distribuicaoNotasData = [
    { name: "NF-e", value: 45, color: "#06b6d4" },
    { name: "NFS-e", value: 30, color: "#3b82f6" },
    { name: "NFC-e", value: 25, color: "#14b8a6" },
  ];

  const alertasData = [
    { tipo: "Crítico", quantidade: 3 },
    { tipo: "Alerta", quantidade: 12 },
    { tipo: "Info", quantidade: 28 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={amvixLogo} alt="AMVIX" className="h-8 w-auto" />
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
          >
            Área do Cliente
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-5xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-fade-in">
            Sistema de Gestão Empresarial Inteligente
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Centralize todas as demandas do seu negócio em um único lugar!
          </p>
          <p className="text-base text-slate-400 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Não perca mais tempo com rotinas manuais e processos descentralizados. 
            O AMVIX integra gestão fiscal, financeira e operacional em uma plataforma completa.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
            onClick={() => navigate("/demonstracao")}
          >
            Demonstração Gratuita
          </Button>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="relative">
            {/* Browser Mockup */}
            <div className="bg-slate-900 rounded-3xl shadow-2xl shadow-cyan-500/20 overflow-hidden border border-slate-800 hover:scale-[1.02] transition-transform duration-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {/* Browser Bar */}
              <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 ml-4">
                  <div className="bg-slate-900 rounded-lg px-4 py-1.5 text-sm text-slate-400 max-w-xs">
                    amvix.app/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8 space-y-6 bg-gradient-to-br from-slate-900 to-slate-950">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Notas Fiscais</p>
                        <h3 className="text-2xl font-bold text-blue-400">1.234</h3>
                        <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +12%
                        </p>
                      </div>
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Receita Total</p>
                        <h3 className="text-2xl font-bold text-green-400">R$ 328K</h3>
                        <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +18%
                        </p>
                      </div>
                      <div className="bg-green-500/20 p-2 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Taxa de Sucesso</p>
                        <h3 className="text-2xl font-bold text-cyan-400">98.5%</h3>
                        <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +2.3%
                        </p>
                      </div>
                      <div className="bg-cyan-500/20 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Alertas Ativos</p>
                        <h3 className="text-2xl font-bold text-red-400">15</h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          3 novos
                        </p>
                      </div>
                      <div className="bg-red-500/20 p-2 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="p-4 bg-slate-800/50 border-slate-700">
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-cyan-400" />
                      Receita Mensal
                    </h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="mes" stroke="#94a3b8" style={{ fontSize: '10px' }} />
                        <YAxis stroke="#94a3b8" style={{ fontSize: '10px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                            fontSize: '12px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="valor"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          dot={{ fill: "#06b6d4", r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="p-4 bg-slate-800/50 border-slate-700">
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      Notas Fiscais por Tipo
                    </h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={notasFiscaisData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="mes" stroke="#94a3b8" style={{ fontSize: '10px' }} />
                        <YAxis stroke="#94a3b8" style={{ fontSize: '10px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                            fontSize: '12px'
                          }}
                        />
                        <Bar dataKey="nfe" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="nfse" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="nfce" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              </div>
            </div>

            {/* Floating Badges - Only visible on XL screens */}
            <div className="hidden xl:flex flex-col gap-4 absolute -right-20 top-1/2 -translate-y-1/2">
              <Card className="p-4 bg-white text-slate-900 shadow-lg animate-bounce border-0 w-48" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Completo</p>
                    <p className="text-xs text-slate-600">Dashboard integrado</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white text-slate-900 shadow-lg animate-bounce border-0 w-48" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 rounded-full p-2">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Seguro</p>
                    <p className="text-xs text-slate-600">Dados protegidos</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white text-slate-900 shadow-lg animate-bounce border-0 w-48" style={{ animationDuration: '3s', animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-500 rounded-full p-2">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Eficiente</p>
                    <p className="text-xs text-slate-600">Análises em tempo real</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Por que escolher o AMVIX?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Análises Avançadas</h3>
              <p className="text-slate-400">
                Relatórios e dashboards inteligentes para tomada de decisão estratégica com dados em tempo real.
              </p>
            </Card>

            <Card className="p-8 bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Segurança Total</h3>
              <p className="text-slate-400">
                Dados isolados por empresa com Row Level Security no PostgreSQL, autenticação via Supabase e permissões por perfil.
              </p>
            </Card>

            <Card className="p-8 bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Gestão de Equipes</h3>
              <p className="text-slate-400">
                Controle completo de usuários, permissões e acessos para sua equipe com níveis hierárquicos.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800 bg-slate-950">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={amvixLogo} alt="AMVIX" className="h-6 w-auto" />
          </div>
          <p className="text-slate-400 text-sm">
            Copyright © {new Date().getFullYear()} AMVIX. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <div
        className="fixed bottom-6 right-6 z-50"
        onMouseEnter={() => setShowWhatsAppTooltip(true)}
        onMouseLeave={() => setShowWhatsAppTooltip(false)}
      >
        {showWhatsAppTooltip && (
          <div className="absolute bottom-full right-0 mb-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg border border-slate-700 animate-fade-in">
            Falar com comercial
          </div>
        )}
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 hover:scale-110"
          onClick={() => window.open('https://wa.me/5500000000000', '_blank')}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Landing;
