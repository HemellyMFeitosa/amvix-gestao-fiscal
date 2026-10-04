import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, Search, Pencil, Trash2, Users, Loader2 } from "lucide-react";
import { useClientesFornecedores, ClienteFornecedor } from "@/hooks/useClientesFornecedores";
import { ClienteFornecedorModal } from "@/components/cadastros/ClienteFornecedorModal";
import type { ClienteFornecedorInput } from "@/hooks/useClientesFornecedores";

const CadastroClientesFornecedores = () => {
  const { registros, loading, criarRegistro, atualizarRegistro, excluirRegistro } = useClientesFornecedores();
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "cliente" | "fornecedor">("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [registroSelecionado, setRegistroSelecionado] = useState<ClienteFornecedor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [registroParaExcluir, setRegistroParaExcluir] = useState<ClienteFornecedor | null>(null);

  const registrosFiltrados = registros.filter((r) => {
    const matchBusca =
      r.nome_razao_social.toLowerCase().includes(busca.toLowerCase()) ||
      r.cpf_cnpj.includes(busca) ||
      (r.email && r.email.toLowerCase().includes(busca.toLowerCase()));

    if (filtroTipo === "todos") return matchBusca;
    if (filtroTipo === "cliente") return matchBusca && (r.tipo === "cliente" || r.tipo === "ambos");
    if (filtroTipo === "fornecedor") return matchBusca && (r.tipo === "fornecedor" || r.tipo === "ambos");
    return matchBusca;
  });

  const handleNovo = () => {
    setRegistroSelecionado(null);
    setModalOpen(true);
  };

  const handleEditar = (registro: ClienteFornecedor) => {
    setRegistroSelecionado(registro);
    setModalOpen(true);
  };

  const handleExcluir = (registro: ClienteFornecedor) => {
    setRegistroParaExcluir(registro);
    setDeleteDialogOpen(true);
  };

  const confirmarExclusao = async () => {
    if (registroParaExcluir) {
      await excluirRegistro(registroParaExcluir.id);
    }
    setDeleteDialogOpen(false);
    setRegistroParaExcluir(null);
  };

  const handleSave = async (registro: ClienteFornecedorInput) => {
    if (registroSelecionado) {
      await atualizarRegistro(registroSelecionado.id, registro);
    } else {
      await criarRegistro(registro);
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "cliente":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Cliente</Badge>;
      case "fornecedor":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Fornecedor</Badge>;
      case "ambos":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Ambos</Badge>;
      default:
        return <Badge variant="secondary">{tipo}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6" />
              Clientes e Fornecedores
            </h1>
            <p className="text-muted-foreground">
              Gerencie o cadastro de clientes e fornecedores
            </p>
          </div>
          <Button onClick={handleNovo} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Cadastro
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Tabs value={filtroTipo} onValueChange={(v) => setFiltroTipo(v as typeof filtroTipo)}>
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="cliente">Clientes</TabsTrigger>
              <TabsTrigger value="fornecedor">Fornecedores</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CPF/CNPJ ou e-mail..."
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
          ) : registrosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mb-4" />
              <p>Nenhum cadastro encontrado</p>
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Nome/Razão Social</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Cidade/UF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrosFiltrados.map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell>{getTipoBadge(registro.tipo)}</TableCell>
                    <TableCell className="font-mono">{registro.cpf_cnpj}</TableCell>
                    <TableCell>{registro.nome_razao_social}</TableCell>
                    <TableCell>{registro.telefone || "-"}</TableCell>
                    <TableCell>{registro.email || "-"}</TableCell>
                    <TableCell>
                      {registro.cidade && registro.uf
                        ? `${registro.cidade}/${registro.uf}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={registro.ativo ? "default" : "secondary"}>
                        {registro.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditar(registro)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleExcluir(registro)}
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

      <ClienteFornecedorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        registro={registroSelecionado}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{registroParaExcluir?.nome_razao_social}"?
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

export default CadastroClientesFornecedores;
