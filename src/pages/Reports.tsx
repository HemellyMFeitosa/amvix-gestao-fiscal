import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, TrendingUp, DollarSign, FileText, Download } from "lucide-react";

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
            <p className="text-muted-foreground">Visualize e exporte relatórios detalhados</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Exportar Tudo
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select defaultValue="mes">
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dia">Últimas 24 horas</SelectItem>
                  <SelectItem value="semana">Última semana</SelectItem>
                  <SelectItem value="mes">Último mês</SelectItem>
                  <SelectItem value="trimestre">Último trimestre</SelectItem>
                  <SelectItem value="ano">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de empresa</label>
              <Select defaultValue="todas">
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="mei">MEI</SelectItem>
                  <SelectItem value="me">ME</SelectItem>
                  <SelectItem value="ltda">LTDA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de relatório</label>
              <Select defaultValue="todos">
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="fiscal">Fiscal</SelectItem>
                  <SelectItem value="operacional">Operacional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 text-blue-400" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold mb-1">R$ 1.250.000</h3>
            <p className="text-sm text-muted-foreground">Receita Total</p>
            <p className="text-xs text-green-400 mt-2">+12% vs período anterior</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 text-red-400" />
              <TrendingUp className="w-5 h-5 text-red-400 rotate-180" />
            </div>
            <h3 className="text-3xl font-bold mb-1">R$ 187.500</h3>
            <p className="text-sm text-muted-foreground">Despesas</p>
            <p className="text-xs text-red-400 mt-2">+5% vs período anterior</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold mb-1">R$ 45.200</h3>
            <p className="text-sm text-muted-foreground">Lucro Líquido</p>
            <p className="text-xs text-green-400 mt-2">+18.5% crescimento</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold mb-1">18.5%</h3>
            <p className="text-sm text-muted-foreground">Margem de Lucro</p>
            <p className="text-xs text-muted-foreground mt-2">Acima da média do setor</p>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Evolução Financeira</h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg border border-border">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Gráfico de Evolução Financeira</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Distribuição de Regimes</h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg border border-border">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Gráfico de Pizza - Regimes Tributários</p>
                <div className="mt-4 flex gap-4 justify-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-400" />
                    <span>Simples Nacional</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span>Lucro Presumido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span>Lucro Real</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparative Analysis */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Análise Comparativa - Período Atual vs Anterior</h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
          <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg border border-border">
            <div className="text-center">
              <BarChart3 className="w-20 h-20 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Gráfico de Barras Comparativo</p>
              <p className="text-sm text-muted-foreground mt-2">Período Anterior vs Período Atual</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
