import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, FileText, Eye, Download, Mail, Ban, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { NovaNotaFiscalDialog } from "@/components/NovaNotaFiscalDialog";
import { VisualizarNFeDialog } from "@/components/VisualizarNFeDialog";
import { EnviarEmailNFeDialog } from "@/components/EnviarEmailNFeDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNotasFiscaisStats, useNotasFiscaisList } from "@/hooks/useNotasFiscais";
import { useEmpresa } from "@/contexts/EmpresaContext";
import { downloadXMLNFe, gerarPDFNFe } from "@/lib/nfeUtils";
import type { DadosFiscaisNFe } from "@/types/nfe";
import { getErrorMessage } from "@/lib/errorMapper";

type NotaLista = NonNullable<ReturnType<typeof useNotasFiscaisList>["data"]>[number];

const NFe = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visualizarDialogOpen, setVisualizarDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [notaSelecionada, setNotaSelecionada] = useState<NotaLista | null>(null);
  const [cancelarDialogOpen, setCancelarDialogOpen] = useState(false);
  const [notaParaCancelar, setNotaParaCancelar] = useState<NotaLista | null>(null);

  const { empresaAtual, loading: loadingEmpresa } = useEmpresa();
  const empresaId = empresaAtual?.id;

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.debug("[NF-e] empresaAtual:", empresaAtual);
    }
  }, [empresaAtual]);

  const { data: stats, isLoading: loadingStats } = useNotasFiscaisStats(empresaId);
  const { data: notas, isLoading: loadingNotas } = useNotasFiscaisList(empresaId);

  // Só permite operações com empresa válida
  const temEmpresaValida = !!empresaId;

  const handleVisualizar = (nota: NotaLista) => {
    setNotaSelecionada(nota);
    setVisualizarDialogOpen(true);
  };

  const handleDownloadXML = (nota: NotaLista) => {
    if (!empresaAtual) {
      toast.error("Empresa não selecionada");
      return;
    }
    
    try {
      downloadXMLNFe(nota, empresaAtual);
      toast.success(`Download XML da NF-e ${String(nota.numero).padStart(8, "0")} concluído`);
    } catch (error: unknown) {
      console.error("Erro ao gerar XML:", error);
      toast.error("Erro ao gerar XML");
    }
  };

  const handleDownloadPDF = (nota: NotaLista) => {
    if (!empresaAtual) {
      toast.error("Empresa não selecionada");
      return;
    }
    
    try {
      gerarPDFNFe(nota, empresaAtual);
      toast.success(`Download PDF da NF-e ${String(nota.numero).padStart(8, "0")} concluído`);
    } catch (error: unknown) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF");
    }
  };

  const handleEnviarEmail = (nota: NotaLista) => {
    setNotaSelecionada(nota);
    setEmailDialogOpen(true);
  };

  const handleIniciarCancelamento = (nota: NotaLista) => {
    if (nota.status === "Cancelada") {
      toast.error("Esta nota já está cancelada");
      return;
    }
    setNotaParaCancelar(nota);
    setCancelarDialogOpen(true);
  };

  const handleCancelar = async () => {
    if (!notaParaCancelar) return;

    try {
      const { error } = await supabase
        .from("notas_fiscais")
        .update({ status: "Cancelada" })
        .eq("id", notaParaCancelar.id);

      if (error) throw error;

      toast.success(`NF-e ${String(notaParaCancelar.numero).padStart(8, "0")} cancelada com sucesso`);
      queryClient.invalidateQueries({ queryKey: ["notas-fiscais-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notas-fiscais-list"] });
      setCancelarDialogOpen(false);
      setNotaParaCancelar(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao cancelar nota fiscal"));
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Emissão NF-e</h1>
            <p className="text-muted-foreground">Emita notas fiscais eletrônicas</p>
            {!temEmpresaValida && !loadingEmpresa && (
              <p className="text-muted-foreground text-sm mt-2">
                Selecione (ou cadastre) uma empresa para emitir notas fiscais
              </p>
            )}
          </div>
          <Button 
            size="lg" 
            onClick={() => setDialogOpen(true)}
            disabled={!temEmpresaValida || loadingEmpresa}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova NF-e
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Emitidas Hoje</div>
            {loadingStats ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <div className="text-3xl font-bold">{stats?.emitidasHoje || 0}</div>
            )}
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Pendentes</div>
            {loadingStats ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <div className="text-3xl font-bold text-primary">{stats?.pendentes || 0}</div>
            )}
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Canceladas</div>
            {loadingStats ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <div className="text-3xl font-bold text-destructive">{stats?.canceladas || 0}</div>
            )}
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Mês</div>
            {loadingStats ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <div className="text-3xl font-bold">{stats?.totalMes || 0}</div>
            )}
          </Card>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Buscar NF-e</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="search" placeholder="Número, destinatário..." className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select id="status" className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>Todos</option>
                <option>Autorizada</option>
                <option>Pendente</option>
                <option>Cancelada</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Número</th>
                  <th className="text-left py-3 px-4">Data</th>
                  <th className="text-left py-3 px-4">Destinatário</th>
                  <th className="text-left py-3 px-4">Valor</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loadingNotas ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ) : notas && notas.length > 0 ? (
                  notas.map((nf) => (
                    <tr key={nf.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono">
                        {String(nf.numero).padStart(8, "0")}
                      </td>
                      <td className="py-3 px-4">
                        {format(new Date(nf.data_emissao), "dd/MM/yyyy")}
                      </td>
                      <td className="py-3 px-4">
                        {nf.clientes_fornecedores?.nome_razao_social}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        R$ {Number(nf.valor_total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            nf.status === "Cancelada"
                              ? "bg-destructive/10 text-destructive"
                              : nf.status === "Autorizada"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted/60 text-muted-foreground"
                          }`}
                        >
                          {nf.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleVisualizar(nf)}
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDownloadXML(nf)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download XML
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEnviarEmail(nf)}>
                                <Mail className="w-4 h-4 mr-2" />
                                Enviar por E-mail
                              </DropdownMenuItem>
                              {nf.status !== "Cancelada" && (
                                <DropdownMenuItem
                                  onClick={() => handleIniciarCancelamento(nf)}
                                  className="text-destructive"
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  Cancelar NF-e
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Nenhuma nota fiscal emitida ainda. Clique em "Nova NF-e" para começar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {temEmpresaValida && (
        <NovaNotaFiscalDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          empresaId={empresaId}
        />
      )}

      <VisualizarNFeDialog
        open={visualizarDialogOpen}
        onOpenChange={setVisualizarDialogOpen}
        nota={notaSelecionada}
        empresa={empresaAtual}
      />

      <EnviarEmailNFeDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        nota={notaSelecionada}
        emailPadrao={
          (notaSelecionada?.dados_fiscais as DadosFiscaisNFe | null)?.destinatario?.email ||
          notaSelecionada?.clientes_fornecedores?.email ||
          ""
        }
      />

      <AlertDialog open={cancelarDialogOpen} onOpenChange={setCancelarDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar NF-e</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar a NF-e nº {notaParaCancelar && String(notaParaCancelar.numero).padStart(8, "0")}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não, manter</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelar}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default NFe;