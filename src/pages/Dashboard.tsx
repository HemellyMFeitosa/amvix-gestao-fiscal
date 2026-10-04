import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  TrendingUp,
  DollarSign,
  FileText,
  AlertCircle,
  ArrowRight,
  Building2
} from "lucide-react";
import { useEmpresa } from "@/contexts/EmpresaContext";
import {
  Tooltip as UITooltip,
  TooltipContent as UITooltipContent,
  TooltipTrigger as UITooltipTrigger,
} from "@/components/ui/tooltip";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { empresaAtual, loading } = useEmpresa();
  const [dadosCarregados, setDadosCarregados] = useState(false);

  // Recarregar dados quando empresa mudar
  useEffect(() => {
    const handleEmpresaChange = () => {
      setDadosCarregados(false);
      // Simular carregamento de dados (em produção, aqui viriam as chamadas à API)
      setTimeout(() => {
        setDadosCarregados(true);
      }, 500);
    };

    handleEmpresaChange(); // Carregar dados iniciais
    window.addEventListener('empresaChanged', handleEmpresaChange);
    
    return () => {
      window.removeEventListener('empresaChanged', handleEmpresaChange);
    };
  }, []);

  const isCarregando = loading || !dadosCarregados;

  // Dados de exemplo para os gráficos (em produção, viriam da API filtrados por empresa)
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
    { mes: "Abr", nfe: 420, nfse: 240, nfce: 280 },
    { mes: "Mai", nfe: 390, nfse: 220, nfce: 260 },
    { mes: "Jun", nfe: 450, nfse: 270, nfce: 300 },
  ];

  const distribuicaoNotasData = [
    { name: "NF-e", value: 45, color: "#3b82f6" },
    { name: "NFS-e", value: 30, color: "#06b6d4" },
    { name: "NFC-e", value: 25, color: "#14b8a6" },
  ];

  const alertasData = [
    { tipo: "Crítico", quantidade: 3, color: "#ef4444" },
    { tipo: "Alerta", quantidade: 12, color: "#f59e0b" },
    { tipo: "Info", quantidade: 28, color: "#3b82f6" },
  ];

  const COLORS = ["#3b82f6", "#06b6d4", "#14b8a6"];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Hero Section com Destaque */}
        <div className="mb-8 animate-fade-in">
          <div className="gradient-card rounded-2xl p-8 relative overflow-hidden shadow-glow">
            {/* Background decorativo */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-float-slow" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10 animate-float-medium" />
            
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Dashboard AMVIX
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Sistema de Gestão Empresarial Inteligente
              </p>
              {empresaAtual && (
                <div className="inline-flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/20">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {empresaAtual.nome_fantasia}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KPIs com Animação e Destaque */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <UITooltip>
            <UITooltipTrigger asChild>
              <Card 
                className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 cursor-pointer transition-smooth hover-scale shadow-glow hover:shadow-blue-500/50 relative group animate-fade-in"
                style={{ animationDelay: '0.1s' }}
                onClick={() => navigate('/invoices')}
              >
                {isCarregando ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Notas Fiscais</p>
                        <h3 className="text-3xl font-bold bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">1.234</h3>
                        <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +12% este mês
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-3 rounded-xl group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
                        <FileText className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <ArrowRight className="absolute top-4 right-4 w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </Card>
            </UITooltipTrigger>
            <UITooltipContent>
              <p>Clique para ver todas as notas fiscais</p>
            </UITooltipContent>
          </UITooltip>

          <UITooltip>
            <UITooltipTrigger asChild>
              <Card 
                className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20 cursor-pointer transition-smooth hover-scale shadow-glow hover:shadow-green-500/50 relative group animate-fade-in"
                style={{ animationDelay: '0.2s' }}
                onClick={() => navigate('/reports')}
              >
                {isCarregando ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Receita Total</p>
                        <h3 className="text-3xl font-bold bg-gradient-to-br from-green-400 to-emerald-600 bg-clip-text text-transparent">R$ 328K</h3>
                        <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +8% este mês
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 p-3 rounded-xl group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
                        <DollarSign className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <ArrowRight className="absolute top-4 right-4 w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </Card>
            </UITooltipTrigger>
            <UITooltipContent>
              <p>Clique para ver relatórios de receita</p>
            </UITooltipContent>
          </UITooltip>

          <UITooltip>
            <UITooltipTrigger asChild>
              <Card 
                className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 cursor-pointer transition-smooth hover-scale shadow-glow hover:shadow-primary/50 relative group animate-fade-in"
                style={{ animationDelay: '0.3s' }}
                onClick={() => navigate('/indicadores-fiscais')}
              >
                {isCarregando ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Taxa de Sucesso</p>
                        <h3 className="text-3xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">98.5%</h3>
                        <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +2.3% este mês
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-3 rounded-xl group-hover:shadow-lg group-hover:shadow-primary/50 transition-all">
                        <TrendingUp className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <ArrowRight className="absolute top-4 right-4 w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </Card>
            </UITooltipTrigger>
            <UITooltipContent>
              <p>Clique para ver indicadores fiscais</p>
            </UITooltipContent>
          </UITooltip>

          <UITooltip>
            <UITooltipTrigger asChild>
              <Card 
                className="p-6 bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/10 cursor-pointer transition-smooth hover-scale shadow-glow hover:shadow-red-500/50 relative group animate-fade-in"
                style={{ animationDelay: '0.4s' }}
                onClick={() => navigate('/monitoramento')}
              >
                {isCarregando ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Alertas Ativos</p>
                        <h3 className="text-3xl font-bold bg-gradient-to-br from-red-400 to-red-600 bg-clip-text text-transparent">15</h3>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          3 desde ontem
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-3 rounded-xl group-hover:shadow-lg group-hover:shadow-red-500/50 transition-all pulse">
                        <AlertCircle className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <ArrowRight className="absolute top-4 right-4 w-5 h-5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </Card>
            </UITooltipTrigger>
            <UITooltipContent>
              <p>Clique para ver monitoramento e alertas</p>
            </UITooltipContent>
          </UITooltip>
        </div>

        {/* Gráficos principais com Animação */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Receita */}
          <UITooltip>
            <UITooltipTrigger asChild>
              <Card 
                className="p-6 cursor-pointer transition-smooth hover-scale hover:ring-2 hover:ring-cyan-500/50 shadow-glow group relative animate-fade-in border-primary/10"
                style={{ animationDelay: '0.5s' }}
                onClick={() => navigate('/reports', { state: { filtro: { periodo: 'mensal' } } })}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-2 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    Receita Mensal
                  </h3>
                  <ArrowRight className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      dot={{ fill: "#06b6d4", r: 6 }}
                      activeDot={{ r: 8 }}
                      name="Receita (R$)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </UITooltipTrigger>
            <UITooltipContent>
              <p>Clique para ver relatório detalhado de receita</p>
            </UITooltipContent>
          </UITooltip>

          {/* Gráfico de Notas Fiscais */}
          <UITooltip>
            <UITooltipTrigger asChild>
              <Card 
                className="p-6 cursor-pointer transition-smooth hover-scale hover:ring-2 hover:ring-blue-500/50 shadow-glow group relative animate-fade-in border-primary/10"
                style={{ animationDelay: '0.6s' }}
                onClick={() => navigate('/invoices', { state: { filtro: { view: 'por-tipo' } } })}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    Notas Fiscais por Tipo
                  </h3>
                  <ArrowRight className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={notasFiscaisData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="nfe" fill="#3b82f6" name="NF-e" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="nfse" fill="#06b6d4" name="NFS-e" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="nfce" fill="#14b8a6" name="NFC-e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </UITooltipTrigger>
            <UITooltipContent>
              <p>Clique para ver notas fiscais por tipo</p>
            </UITooltipContent>
          </UITooltip>
        </div>

        {/* Gráficos secundários com Animação */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição de Notas */}
          <UITooltip>
            <UITooltipTrigger asChild>
              <Card 
                className="p-6 cursor-pointer transition-smooth hover-scale hover:ring-2 hover:ring-emerald-500/50 shadow-glow group relative animate-fade-in border-primary/10"
                style={{ animationDelay: '0.7s' }}
                onClick={() => navigate('/invoices', { state: { filtro: { view: 'distribuicao' } } })}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                    </div>
                    Distribuição por Tipo
                  </h3>
                  <ArrowRight className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distribuicaoNotasData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distribuicaoNotasData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </UITooltipTrigger>
            <UITooltipContent>
              <p>Clique para ver distribuição detalhada</p>
            </UITooltipContent>
          </UITooltip>

          {/* Alertas por Tipo */}
          <UITooltip>
            <UITooltipTrigger asChild>
              <Card 
                className="p-6 cursor-pointer transition-smooth hover-scale hover:ring-2 hover:ring-red-500/50 shadow-glow group relative animate-fade-in border-red-500/10"
                style={{ animationDelay: '0.8s' }}
                onClick={() => navigate('/monitoramento', { state: { filtro: { view: 'severidade' } } })}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 p-2 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    Alertas por Severidade
                  </h3>
                  <ArrowRight className="w-5 h-5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={alertasData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="tipo" type="category" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Bar dataKey="quantidade" name="Quantidade" radius={[0, 8, 8, 0]}>
                      {alertasData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </UITooltipTrigger>
            <UITooltipContent>
              <p>Clique para ver alertas detalhados</p>
            </UITooltipContent>
          </UITooltip>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
