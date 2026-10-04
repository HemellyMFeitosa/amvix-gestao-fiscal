import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, Search, Pencil, Trash2, CreditCard, Loader2 } from "lucide-react";
import { useFormasPagamento, FormaPagamento } from "@/hooks/useFormasPagamento";
import { FormaPagamentoModal } from "@/components/cadastros/FormaPagamentoModal";
import type { FormaPagamentoInput } from "@/hooks/useFormasPagamento";

const CadastroFormasPagamento = () => {
  const { formas, loading, criarForma, atualizarForma, excluirForma } = useFormasPagamento();
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formaSelecionada, setFormaSelecionada] = useState<FormaPagamento | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formaParaExcluir, setFormaParaExcluir] = useState<FormaPagamento | null>(null);

  const formasFiltradas = formas.filter(
    (f) =>
      f.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      f.codigo.includes(busca)
  );

  const handleNova = () => {
    setFormaSelecionada(null);
    setModalOpen(true);
  };

  const handleEditar = (forma: FormaPagamento) => {
    setFormaSelecionada(forma);
    setModalOpen(true);
  };

  const handleExcluir = (forma: FormaPagamento) => {
    setFormaParaExcluir(forma);
    setDeleteDialogOpen(true);
  };

  const confirmarExclusao = async () => {
    if (formaParaExcluir) {
      await excluirForma(formaParaExcluir.id);
    }
    setDeleteDialogOpen(false);
    setFormaParaExcluir(null);
  };

  const handleSave = async (forma: FormaPagamentoInput) => {
    if (formaSelecionada) {
      await atualizarForma(formaSelecionada.id, forma);
    } else {
      await criarForma(forma);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Formas de Pagamento
            </h1>
            <p className="text-muted-foreground">
              Gerencie as formas de pagamento aceitas
            </p>
          </div>
          <Button onClick={handleNova} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Forma de Pagamento
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código ou descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="border rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : formasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CreditCard className="h-12 w-12 mb-4" />
              <p>Nenhuma forma de pagamento encontrada</p>
              {busca && (
                <Button variant="link" onClick={() => setBusca("")}>
                  Limpar busca
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Parcelamento</TableHead>
                  <TableHead className="text-center">Máx. Parcelas</TableHead>
                  <TableHead className="text-right">Taxa/Desconto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formasFiltradas.map((forma) => (
                  <TableRow key={forma.id}>
                    <TableCell className="font-mono">{forma.codigo}</TableCell>
                    <TableCell>{forma.descricao}</TableCell>
                    <TableCell>
                      <Badge variant={forma.aceita_parcelamento ? "default" : "secondary"}>
                        {forma.aceita_parcelamento ? "Sim" : "Não"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {forma.aceita_parcelamento ? forma.max_parcelas || 1 : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {forma.taxa_desconto
                        ? `${forma.taxa_desconto > 0 ? "+" : ""}${forma.taxa_desconto}%`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={forma.ativo ? "default" : "secondary"}>
                        {forma.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditar(forma)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleExcluir(forma)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <FormaPagamentoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        forma={formaSelecionada}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a forma de pagamento "{formaParaExcluir?.descricao}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarExclusao}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default CadastroFormasPagamento;
