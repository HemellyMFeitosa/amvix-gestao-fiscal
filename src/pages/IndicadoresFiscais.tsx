import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const IndicadoresFiscais = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Indicadores Fiscais</h1>
          <p className="text-muted-foreground">Análises e métricas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Receita Bruta</div>
                <div className="text-2xl font-bold">R$ 2.4M</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Impostos</div>
                <div className="text-2xl font-bold">R$ 432K</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Crescimento</div>
                <div className="text-2xl font-bold">+18.5%</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Margem Líquida</div>
                <div className="text-2xl font-bold">12.3%</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">Tributos por Tipo</h3>
            <div className="space-y-4">
              {[
                { nome: "ICMS", valor: "R$ 180.500", perc: 42, cor: "bg-blue-400" },
                { nome: "PIS/COFINS", valor: "R$ 125.200", perc: 29, cor: "bg-green-400" },
                { nome: "IPI", valor: "R$ 78.400", perc: 18, cor: "bg-purple-400" },
                { nome: "ISS", valor: "R$ 48.300", perc: 11, cor: "bg-orange-400" },
              ].map((tributo) => (
                <div key={tributo.nome}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{tributo.nome}</span>
                    <span className="text-muted-foreground">{tributo.valor}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${tributo.cor}`} style={{ width: `${tributo.perc}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">Comparativo Mensal</h3>
            <div className="space-y-4">
              {[
                { mes: "Outubro", receita: "R$ 2.4M", variacao: "+12%", positivo: true },
                { mes: "Setembro", receita: "R$ 2.14M", variacao: "+8%", positivo: true },
                { mes: "Agosto", receita: "R$ 1.98M", variacao: "-3%", positivo: false },
                { mes: "Julho", receita: "R$ 2.04M", variacao: "+15%", positivo: true },
              ].map((mes) => (
                <div key={mes.mes} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div>
                    <div className="font-semibold">{mes.mes}</div>
                    <div className="text-sm text-muted-foreground">{mes.receita}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {mes.positivo ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`font-semibold ${mes.positivo ? "text-green-400" : "text-red-400"}`}>
                      {mes.variacao}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Resumo Fiscal do Mês</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Notas Emitidas</div>
              <div className="text-3xl font-bold mb-1">2.847</div>
              <div className="text-sm text-green-400">+15% vs mês anterior</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Valor Total Faturado</div>
              <div className="text-3xl font-bold mb-1">R$ 2.4M</div>
              <div className="text-sm text-green-400">+12% vs mês anterior</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Impostos Recolhidos</div>
              <div className="text-3xl font-bold mb-1">R$ 432K</div>
              <div className="text-sm text-blue-400">18% do faturamento</div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default IndicadoresFiscais;