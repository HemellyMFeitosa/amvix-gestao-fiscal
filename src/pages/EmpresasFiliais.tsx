import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, FileDown, Pencil, Trash2 } from "lucide-react";
import { useEmpresa, Empresa } from "@/contexts/EmpresaContext";
import { useEmpresas } from "@/hooks/useEmpresas";
import { formatCNPJ } from "@/lib/cnpj";
import EmpresaModal from "@/components/empresa/EmpresaModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const EmpresasFiliais = () => {
  const { empresas, carregarEmpresas } = useEmpresa();
  const { excluirEmpresa } = useEmpresas();
  const [modalOpen, setModalOpen] = useState(false);
  const [empresaEditar, setEmpresaEditar] = useState<Empresa | null>(null);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("Todas");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [empresaDelete, setEmpresaDelete] = useState<Empresa | null>(null);

  const empresasFiltradas = empresas.filter(empresa => {
    const matchBusca = empresa.cnpj.includes(busca) || 
                      empresa.razao_social.toLowerCase().includes(busca.toLowerCase()) ||
                      empresa.nome_fantasia.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = statusFiltro === "Todas" || empresa.status === statusFiltro;
    
    return matchBusca && matchStatus;
  });

  const handleNovaEmpresa = () => {
    setEmpresaEditar(null);
    setModalOpen(true);
  };

  const handleEditarEmpresa = (empresa: Empresa) => {
    setEmpresaEditar(empresa);
    setModalOpen(true);
  };

  const handleDeleteClick = (empresa: Empresa) => {
    setEmpresaDelete(empresa);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (empresaDelete) {
      const sucesso = await excluirEmpresa(empresaDelete.id);
      if (sucesso) {
        await carregarEmpresas();
      }
    }
    setDeleteDialogOpen(false);
    setEmpresaDelete(null);
  };

  const handleModalClose = async (recarregar: boolean) => {
    setModalOpen(false);
    setEmpresaEditar(null);
    if (recarregar) {
      await carregarEmpresas();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Empresas e Filiais</h1>
            <p className="text-muted-foreground">Gerencie suas empresas cadastradas</p>
          </div>
          <Button onClick={handleNovaEmpresa}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Empresa
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por CNPJ ou Razão Social"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFiltro} onValueChange={setStatusFiltro}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="Ativa">Ativas</SelectItem>
                <SelectItem value="Inativa">Inativas</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <FileDown className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CNPJ</TableHead>
                <TableHead>Razão Social</TableHead>
                <TableHead>Nome Fantasia</TableHead>
                <TableHead>Regime Tributário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empresasFiltradas.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell className="font-mono">{formatCNPJ(empresa.cnpj)}</TableCell>
                  <TableCell>{empresa.razao_social}</TableCell>
                  <TableCell>{empresa.nome_fantasia}</TableCell>
                  <TableCell>{empresa.regime_tributario}</TableCell>
                  <TableCell>
                    <Badge
                      variant={empresa.status === "Ativa" ? "default" : "secondary"}
                      className={empresa.status === "Ativa" ? "bg-green-500/10 text-green-400 border-green-500/20" : ""}
                    >
                      {empresa.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditarEmpresa(empresa)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(empresa)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <EmpresaModal
          open={modalOpen}
          onClose={handleModalClose}
          empresa={empresaEditar}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a empresa <strong>{empresaDelete?.nome_fantasia}</strong>?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default EmpresasFiliais;
