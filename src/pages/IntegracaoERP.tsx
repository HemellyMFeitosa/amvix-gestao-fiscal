import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, CheckCircle, XCircle, RefreshCw, Settings } from "lucide-react";
import { useIntegracoesERP } from "@/hooks/useIntegracoesERP";
import { ConfigurarERPDialog } from "@/components/ConfigurarERPDialog";
import { NovaIntegracaoERPDialog } from "@/components/NovaIntegracaoERPDialog";
import { ConfigurarSincronizacaoDialog } from "@/components/ConfigurarSincronizacaoDialog";
import { format } from "date-fns";

const IntegracaoERP = () => {
  const {
    integracoes,
    adicionarIntegracao,
    atualizarIntegracao,
    sincronizar,
    reconectar,
    calcularEstatisticas,
  } = useIntegracoesERP();

  const [integracaoSelecionada, setIntegracaoSelecionada] = useState<number | null>(null);
  const [dialogConfigAberto, setDialogConfigAberto] = useState(false);
  const [dialogNovoAberto, setDialogNovoAberto] = useState(false);
  const [dialogSincAberto, setDialogSincAberto] = useState(false);

  const estatisticas = calcularEstatisticas();

  const handleNovaIntegracao = (tipo: string, nome: string) => {
    adicionarIntegracao({
      nome,
      tipo,
      status: "desconectado",
      ultimaSincronizacao: new Date().toISOString(),
      registrosSincronizados: 0,
      errosRecentes: 0,
    });
  };

  const handleConfigurar = (id: number) => {
    setIntegracaoSelecionada(id);
    setDialogConfigAberto(true);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Integração ERP</h1>
            <p className="text-muted-foreground">Conecte com seu ERP</p>
          </div>
          <Button size="lg" onClick={() => setDialogNovoAberto(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Integração
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-sm text-muted-foreground">Sincronizações</div>
                <div className="text-2xl font-bold">
                  {estatisticas.totalSincronizacoes.toLocaleString("pt-BR")}
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <XCircle className="w-8 h-8 text-red-400" />
              <div>
                <div className="text-sm text-muted-foreground">Erros</div>
                <div className="text-2xl font-bold">{estatisticas.totalErros}</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <RefreshCw className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-sm text-muted-foreground">Última Sinc.</div>
                <div className="text-lg font-bold">{estatisticas.ultimaSinc}</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {integracoes.map((erp) => (
            <Card key={erp.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{erp.nome}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    erp.status === "conectado"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {erp.status === "conectado" ? "Conectado" : "Desconectado"}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Última sincronização:</span>
                  <span className="font-semibold">
                    {format(new Date(erp.ultimaSincronizacao), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Registros sincronizados:</span>
                  <span className="font-semibold">
                    {erp.registrosSincronizados.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {erp.status === "conectado" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleConfigurar(erp.id)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => sincronizar(erp.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sincronizar
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => reconectar(erp.id)}
                  >
                    Reconectar
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 border border-primary/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4">Sincronização Automática</h3>
          <p className="text-muted-foreground mb-6">
            Configure a sincronização automática entre o AMVIX e seus sistemas ERP. Dados
            atualizados em tempo real para melhor controle.
          </p>
          <Button variant="default" size="lg" onClick={() => setDialogSincAberto(true)}>
            Configurar Automação
          </Button>
        </div>
      </div>

      <ConfigurarERPDialog
        open={dialogConfigAberto}
        onOpenChange={setDialogConfigAberto}
        integracao={integracoes.find((i) => i.id === integracaoSelecionada)}
        onSalvar={atualizarIntegracao}
      />

      <NovaIntegracaoERPDialog
        open={dialogNovoAberto}
        onOpenChange={setDialogNovoAberto}
        onSelecionar={handleNovaIntegracao}
      />

      <ConfigurarSincronizacaoDialog
        open={dialogSincAberto}
        onOpenChange={setDialogSincAberto}
      />
    </DashboardLayout>
  );
};

export default IntegracaoERP;