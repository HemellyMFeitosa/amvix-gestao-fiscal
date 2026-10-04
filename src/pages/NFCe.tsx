import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { NovaNotaNFCeDialog } from "@/components/NovaNotaNFCeDialog";
import { useNotasNFCeStats, useNotasNFCeList } from "@/hooks/useNotasFiscaisNFCe";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEmpresaAtual } from "@/hooks/useNotasFiscais";

const NFCe = () => {
  const { data: empresa, isLoading: loadingEmpresa } = useEmpresaAtual();
  const empresaId = empresa?.id;
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useNotasNFCeStats(empresaId);
  const { data: notas, isLoading: notasLoading, refetch: refetchNotas } = useNotasNFCeList(empresaId);

  const handleSuccess = () => {
    refetchStats();
    refetchNotas();
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Emissão NFC-e</h1>
            <p className="text-muted-foreground">Nota fiscal ao consumidor</p>
          </div>
          <NovaNotaNFCeDialog empresaId={empresaId} onSuccess={handleSuccess} disabled={!empresa} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Vendas Hoje</div>
            {statsLoading || loadingEmpresa ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <div className="text-3xl font-bold">{stats?.vendasHoje || 0}</div>
            )}
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Faturamento</div>
            {statsLoading || loadingEmpresa ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <div className="text-3xl font-bold text-green-400">
                R$ {((stats?.faturamento || 0) / 1000).toFixed(1)}K
              </div>
            )}
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Ticket Médio</div>
            {statsLoading || loadingEmpresa ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <div className="text-3xl font-bold text-blue-400">
                R$ {(stats?.ticketMedio || 0).toFixed(2)}
              </div>
            )}
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Mês</div>
            {statsLoading || loadingEmpresa ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <div className="text-3xl font-bold text-purple-400">{stats?.totalMes || 0}</div>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">NFC-e Emitidas</h3>
            </div>
            {notasLoading || loadingEmpresa ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notas && notas.length > 0 ? (
                    notas.map((nota) => (
                      <TableRow key={nota.id}>
                        <TableCell>
                          {format(new Date(nota.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="font-mono">{nota.numero}</TableCell>
                        <TableCell>{nota.cliente_fornecedor?.nome_razao_social || "Consumidor Final"}</TableCell>
                        <TableCell className="font-bold">R$ {Number(nota.valor_total).toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            nota.status === 'Autorizada' ? 'bg-green-500/20 text-green-400' :
                            nota.status === 'Pendente' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {nota.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Nenhuma NFC-e emitida ainda
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NFCe;