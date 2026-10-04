import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, FileText } from "lucide-react";
import { format } from "date-fns";
import { NovaNotaServicoDialog } from "@/components/NovaNotaServicoDialog";
import {
  useEmpresaAtual,
} from "@/hooks/useNotasFiscais";
import {
  useNotasServicoStats,
  useNotasServicoList,
} from "@/hooks/useNotasFiscaisServico";

const NFSe = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: empresa, isLoading: loadingEmpresa } = useEmpresaAtual();
  const { data: stats, isLoading: loadingStats } = useNotasServicoStats(empresa?.id);
  const { data: notas, isLoading: loadingNotas } = useNotasServicoList(empresa?.id);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Emissão NFS-e</h1>
            <p className="text-muted-foreground">Notas fiscais de serviço eletrônicas</p>
          </div>
          <Button size="lg" onClick={() => setDialogOpen(true)} disabled={!empresa}>
            <Plus className="w-4 h-4 mr-2" />
            Nova NFS-e
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
              <div className="text-3xl font-bold text-yellow-400">{stats?.pendentes || 0}</div>
            )}
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Canceladas</div>
            {loadingStats ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <div className="text-3xl font-bold text-red-400">{stats?.canceladas || 0}</div>
            )}
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Mês</div>
            {loadingStats ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <div className="text-3xl font-bold text-green-400">{stats?.totalMes || 0}</div>
            )}
          </Card>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Buscar NFS-e</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="search" placeholder="Número, tomador..." className="pl-10" />
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
                  <th className="text-left py-3 px-4">Tomador</th>
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
                            nf.status === "Autorizada"
                              ? "bg-green-500/10 text-green-400"
                              : nf.status === "Cancelada"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-yellow-500/10 text-yellow-400"
                          }`}
                        >
                          {nf.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Nenhuma nota fiscal de serviço emitida ainda. Clique em "Nova NFS-e" para começar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {empresa && (
        <NovaNotaServicoDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          empresaId={empresa.id}
        />
      )}
    </DashboardLayout>
  );
};

export default NFSe;
