import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, Play, Pause, Plus, Settings } from "lucide-react";
import { useAutomacoesRPA } from "@/hooks/useAutomacoesRPA";
import { ConfigurarAutomacaoDialog } from "@/components/ConfigurarAutomacaoDialog";
import { NovaAutomacaoDialog } from "@/components/NovaAutomacaoDialog";
import { toast } from "sonner";

const AutomacaoRPA = () => {
  const {
    automacoes,
    adicionarAutomacao,
    atualizarAutomacao,
    toggleStatus,
    executarAutomacao,
    calcularEstatisticas,
  } = useAutomacoesRPA();

  const [automacaoSelecionada, setAutomacaoSelecionada] = useState<number | null>(null);
  const [dialogConfigAberto, setDialogConfigAberto] = useState(false);
  const [dialogNovoAberto, setDialogNovoAberto] = useState(false);

  const estatisticas = calcularEstatisticas();

  const handleNovaAutomacao = (template: string) => {
    const nomes: Record<string, string> = {
      importacao_nfe: "Importação Automática de NF-e",
      sincronizacao: "Sincronização com ERP",
      validacao: "Validação Automática de XMLs",
      backup: "Backup Automático",
      relatorios: "Envio de Relatórios por E-mail",
      sped: "Geração Automática de SPED",
      custom: "Nova Automação Personalizada",
    };

    adicionarAutomacao({
      nome: nomes[template] || "Nova Automação",
      descricao: "Configurar descrição da automação",
      tipo: template,
      status: "pausado",
      execucoesHoje: 0,
      execucoesTotal: 0,
      taxaSucesso: 0,
      tempoEconomizado: 0,
      ultimaExecucao: null,
    });

    toast.info("Configure a automação criada para ativá-la");
  };

  const handleConfigurar = (id: number) => {
    setAutomacaoSelecionada(id);
    setDialogConfigAberto(true);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Automação RPA</h1>
            <p className="text-muted-foreground">Processos automatizados</p>
          </div>
          <Button size="lg" onClick={() => setDialogNovoAberto(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Automação
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Processos Ativos</div>
            <div className="text-3xl font-bold">{estatisticas.processosAtivos}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Execuções Hoje</div>
            <div className="text-3xl font-bold text-green-400">
              {estatisticas.execucoesHoje}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Taxa de Sucesso</div>
            <div className="text-3xl font-bold text-blue-400">
              {estatisticas.taxaSucesso}%
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Tempo Economizado</div>
            <div className="text-2xl font-bold text-purple-400">
              {estatisticas.tempoEconomizado}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {automacoes.map((automacao) => (
            <Card key={automacao.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{automacao.nome}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        automacao.status === "ativo"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {automacao.status === "ativo" ? "Ativo" : "Pausado"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Execuções:</span>
                  <span className="font-semibold">{automacao.execucoesHoje}/dia</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de sucesso:</span>
                  <span className="font-semibold text-green-400">
                    {automacao.execucoesHoje > 0 ? `${automacao.taxaSucesso}%` : "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleStatus(automacao.id)}
                >
                  {automacao.status === "ativo" ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleConfigurar(automacao.id)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 border border-primary/20 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">Automatize Processos Repetitivos</h3>
              <p className="text-muted-foreground mb-6">
                Configure robôs para executar tarefas automaticamente, economizando tempo e
                reduzindo erros manuais.
              </p>
              <Button variant="default" size="lg" onClick={() => setDialogNovoAberto(true)}>
                Criar Nova Automação
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfigurarAutomacaoDialog
        open={dialogConfigAberto}
        onOpenChange={setDialogConfigAberto}
        automacao={automacoes.find((a) => a.id === automacaoSelecionada)}
        onSalvar={atualizarAutomacao}
        onTestar={executarAutomacao}
      />

      <NovaAutomacaoDialog
        open={dialogNovoAberto}
        onOpenChange={setDialogNovoAberto}
        onSelecionar={handleNovaAutomacao}
      />
    </DashboardLayout>
  );
};

export default AutomacaoRPA;