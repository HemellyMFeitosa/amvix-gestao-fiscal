import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Users, FileText, AlertTriangle, Download, Trash2, Eye, Edit, CheckCircle } from "lucide-react";
import { useLGPDLogs } from "@/hooks/useLGPDLogs";
import { useLGPDConsentimento } from "@/hooks/useLGPDConsentimento";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ConfigurarCookiesDialog from "@/components/ConfigurarCookiesDialog";

const ControleLGPD = () => {
  const { logs, solicitacoes, exportarDados, criarSolicitacao, atualizarSolicitacao } = useLGPDLogs();
  const { consentimento, revogarConsentimento, aceitarTodos, rejeitarNaoEssenciais, salvarPreferencias } = useLGPDConsentimento();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCookiesDialog, setShowCookiesDialog] = useState(false);

  const handleExportarDados = () => {
    try {
      const dados = exportarDados();
      const dataStr = JSON.stringify(dados, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `meus-dados-amvix-${format(new Date(), "yyyy-MM-dd")}.json`;
      link.click();
      URL.revokeObjectURL(url);

      criarSolicitacao("exportar", "Exportação de dados solicitada", dados);
      toast.success("Dados exportados com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar dados");
    }
  };

  const handleSolicitarExclusao = () => {
    setShowDeleteDialog(true);
  };

  const confirmarExclusao = () => {
    const solicitacaoId = criarSolicitacao(
      "excluir",
      "Solicitação de exclusão de dados - Prazo: 15 dias úteis"
    );
    
    // Simular processamento após 2 segundos
    setTimeout(() => {
      atualizarSolicitacao(solicitacaoId, "processando");
      toast.success("Solicitação registrada! Você receberá um e-mail de confirmação.");
    }, 2000);

    setShowDeleteDialog(false);
  };

  const handleRevogarConsentimento = () => {
    revogarConsentimento();
    criarSolicitacao("revogar", "Revogação de consentimento de cookies");
    toast.success("Consentimento revogado. Você precisará aceitar novamente ao acessar o site.");
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Controle LGPD</h1>
          <p className="text-muted-foreground">Gerenciamento de dados pessoais e conformidade</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status LGPD</div>
                <div className="text-lg font-bold text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Conforme
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Logs de Acesso</div>
                <div className="text-2xl font-bold">{logs.length}</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Solicitações</div>
                <div className="text-2xl font-bold">{solicitacoes.length}</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Pendentes</div>
                <div className="text-2xl font-bold">
                  {solicitacoes.filter((s) => s.status === "pendente").length}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Seus Dados */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Seus Dados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <h4 className="font-semibold mb-2">📄 Dados Cadastrais</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Nome, e-mail, telefone, CPF
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportarDados}>
                  <Download className="w-4 h-4 mr-1" />
                  Baixar
                </Button>
              </div>
            </div>

            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <h4 className="font-semibold mb-2">💼 Dados Empresariais</h4>
              <p className="text-sm text-muted-foreground mb-3">
                CNPJ, razão social, dados fiscais
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportarDados}>
                  <Download className="w-4 h-4 mr-1" />
                  Baixar
                </Button>
              </div>
            </div>

            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <h4 className="font-semibold mb-2">📊 Logs de Uso</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Histórico de acessos e operações
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportarDados}>
                  <Download className="w-4 h-4 mr-1" />
                  Baixar
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Seus Direitos LGPD */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Seus Direitos (LGPD)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <Download className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Portabilidade de Dados</h4>
                  <p className="text-sm text-muted-foreground">
                    Baixar todos os seus dados em formato JSON
                  </p>
                </div>
              </div>
              <Button onClick={handleExportarDados} size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Exportar Meus Dados
              </Button>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <Edit className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Revogação de Consentimento</h4>
                  <p className="text-sm text-muted-foreground">
                    Revogar consentimento de cookies e preferências
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowCookiesDialog(true)} variant="outline" size="sm" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Gerenciar Consentimentos
              </Button>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <Eye className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Confirmação de Tratamento</h4>
                  <p className="text-sm text-muted-foreground">
                    Confirmar se processamos seus dados pessoais
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info("Sim, processamos seus dados conforme Política de Privacidade")}>
                <Eye className="w-4 h-4 mr-2" />
                Solicitar Confirmação
              </Button>
            </div>

            <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
              <div className="flex items-start gap-3 mb-3">
                <Trash2 className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1 text-destructive">Exclusão de Dados</h4>
                  <p className="text-sm text-muted-foreground">
                    Solicitar exclusão dos seus dados
                    <br />
                    <span className="text-xs">⚠️ Esta ação é irreversível</span>
                  </p>
                </div>
              </div>
              <Button variant="destructive" size="sm" className="w-full" onClick={handleSolicitarExclusao}>
                <Trash2 className="w-4 h-4 mr-2" />
                Solicitar Exclusão
              </Button>
            </div>
          </div>
        </Card>

        {/* Histórico de Solicitações */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-bold mb-6">Histórico de Solicitações LGPD</h3>
          {solicitacoes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma solicitação realizada ainda
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Data</th>
                    <th className="text-left py-3 px-4">Tipo</th>
                    <th className="text-left py-3 px-4">Descrição</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitacoes.slice(0, 10).map((sol) => (
                    <tr key={sol.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm">
                        {format(new Date(sol.dataSolicitacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </td>
                      <td className="py-3 px-4 font-semibold capitalize">{sol.tipo}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{sol.descricao}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            sol.status === "concluido"
                              ? "bg-green-500/10 text-green-400"
                              : sol.status === "processando"
                              ? "bg-blue-500/10 text-blue-400"
                              : sol.status === "pendente"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {sol.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Contato DPO */}
        <Card className="p-6 bg-primary/10 border-primary/50">
          <h3 className="text-xl font-bold mb-4">Contato com o DPO (Encarregado de Dados)</h3>
          <p className="text-muted-foreground mb-4">
            Para dúvidas sobre seus dados pessoais ou exercer seus direitos LGPD:
          </p>
          <div className="space-y-2 mb-4">
            <p className="text-sm">📧 E-mail: <strong>dpo@amvix.com.br</strong></p>
            <p className="text-sm">📞 Telefone: <strong>+55 (48) 3344-6001</strong></p>
          </div>
          <Button>Entrar em Contato com DPO</Button>
        </Card>

        {/* Dialogs */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-6 h-6" />
                Confirmar Exclusão de Dados
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>
                  Você está prestes a solicitar a exclusão de todos os seus dados pessoais do sistema
                  AMVIX. Esta ação terá as seguintes consequências:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Sua conta será permanentemente desativada</li>
                  <li>Todos os seus dados pessoais serão removidos</li>
                  <li>Você não poderá mais acessar o sistema</li>
                  <li>Esta ação é irreversível</li>
                </ul>
                <p className="font-semibold">
                  Prazo de processamento: até 15 dias úteis
                </p>
                <p className="text-xs">
                  Alguns dados podem ser mantidos por obrigações legais (dados fiscais, contábeis)
                  pelo período exigido por lei.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmarExclusao} className="bg-destructive hover:bg-destructive/90">
                Confirmar Exclusão
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <ConfigurarCookiesDialog
          open={showCookiesDialog}
          onOpenChange={setShowCookiesDialog}
          onSave={salvarPreferencias}
          onReject={rejeitarNaoEssenciais}
          onAcceptAll={aceitarTodos}
          currentSettings={consentimento?.cookies}
        />
      </div>
    </DashboardLayout>
  );
};

export default ControleLGPD;
