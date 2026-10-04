import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Plus, Download, Shield, Loader2 } from "lucide-react";
import { useUsuarios, formatarDataHora } from "@/hooks/useUsuarios";
import { useAuth } from "@/hooks/useAuth";
import { NovoUsuarioDialog } from "@/components/NovoUsuarioDialog";
import { VisualizarUsuarioDialog } from "@/components/VisualizarUsuarioDialog";
import { EditarUsuarioDialog } from "@/components/EditarUsuarioDialog";
import { ExcluirUsuarioDialog } from "@/components/ExcluirUsuarioDialog";
import { ConfigurarPermissoesDialog } from "@/components/ConfigurarPermissoesDialog";
import { toast } from "@/components/ui/use-toast";
import { Usuario } from "@/hooks/useUsuarios";

const Admin = () => {
  const { usuarios, loading, atualizarUsuario, atualizarRole, emailJaExiste, recarregar } = useUsuarios();
  const { isAdmin } = useAuth();
  const [filterPerfil, setFilterPerfil] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [busca, setBusca] = useState("");
  const [novoUsuarioOpen, setNovoUsuarioOpen] = useState(false);
  const [visualizarUsuarioOpen, setVisualizarUsuarioOpen] = useState(false);
  const [editarUsuarioOpen, setEditarUsuarioOpen] = useState(false);
  const [excluirUsuarioOpen, setExcluirUsuarioOpen] = useState(false);
  const [permissoesOpen, setPermissoesOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);

  const filteredUsers = usuarios.filter((user) => {
    const matchPerfil = filterPerfil === "todos" || user.perfil === filterPerfil;
    const matchStatus = filterStatus === "todos" || user.status.toLowerCase() === filterStatus.toLowerCase();
    const matchBusca = 
      busca === "" ||
      user.nomeCompleto.toLowerCase().includes(busca.toLowerCase()) ||
      user.email.toLowerCase().includes(busca.toLowerCase());
    return matchPerfil && matchStatus && matchBusca;
  });

  const exportarCSV = () => {
    let csv = "Nome Completo,E-mail,Perfil,Status,Telefone,Último Acesso\n";
    
    usuarios.forEach((u) => {
      const perfil = u.perfil === "admin" ? "Administrador" : u.perfil === "contador" ? "Contador" : "Cliente";
      const ultimoAcesso = formatarDataHora(u.ultimoAcesso);
      
      csv += `"${u.nomeCompleto}","${u.email}","${perfil}","${u.status}","${u.telefone || ""}","${ultimoAcesso}"\n`;
    });
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 14);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `usuarios_${timestamp}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "✅ Dados exportados com sucesso!" });
  };

  const handleVisualizar = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setVisualizarUsuarioOpen(true);
  };

  const handleEditar = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setEditarUsuarioOpen(true);
  };

  const handleExcluir = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setExcluirUsuarioOpen(true);
  };

  const confirmarExclusao = () => {
    // Note: Deleting users requires admin API access
    // For now, we just close the dialog and show a message
    setExcluirUsuarioOpen(false);
    toast({ 
      title: "⚠️ Exclusão de usuários requer acesso administrativo",
      description: "Entre em contato com o suporte para excluir usuários.",
      variant: "destructive" 
    });
  };

  const perfilBadgeVariant = (perfil: string) => {
    switch (perfil) {
      case "admin":
        return "destructive";
      case "contador":
        return "default";
      case "cliente":
        return "secondary";
      default:
        return "default";
    }
  };

  const perfilLabel = (perfil: string) => {
    switch (perfil) {
      case "admin":
        return "Administrador";
      case "contador":
        return "Contador";
      case "cliente":
        return "Cliente";
      default:
        return perfil;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Administração de Usuários</h1>
            <p className="text-muted-foreground">Gerencie todos os usuários do sistema</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={() => setPermissoesOpen(true)}>
              <Shield className="w-4 h-4 mr-2" />
              Configurar Permissões
            </Button>
            <Button size="lg" onClick={() => setNovoUsuarioOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <Input 
                placeholder="Nome ou email..." 
                className="bg-background"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Perfil</label>
              <Select value={filterPerfil} onValueChange={setFilterPerfil}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="contador">Contador</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full" onClick={exportarCSV}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="text-left p-4 font-semibold">Nome Completo</th>
                  <th className="text-left p-4 font-semibold">Email</th>
                  <th className="text-left p-4 font-semibold">Perfil</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Último Acesso</th>
                  <th className="text-left p-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/20 transition-smooth">
                    <td className="p-4 font-medium">{user.nomeCompleto}</td>
                    <td className="p-4 text-muted-foreground">{user.email}</td>
                    <td className="p-4">
                      <Badge variant={perfilBadgeVariant(user.perfil)}>
                        {perfilLabel(user.perfil)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={user.status.toLowerCase() === "ativo" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">{formatarDataHora(user.ultimoAcesso)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleVisualizar(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditar(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:text-destructive"
                          onClick={() => handleExcluir(user)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Mostrando {filteredUsers.length} de {usuarios.length} usuários
        </div>
      </div>

      <NovoUsuarioDialog
        open={novoUsuarioOpen}
        onOpenChange={setNovoUsuarioOpen}
        onSalvar={recarregar}
        emailJaExiste={emailJaExiste}
      />

      <VisualizarUsuarioDialog
        open={visualizarUsuarioOpen}
        onOpenChange={setVisualizarUsuarioOpen}
        usuario={usuarioSelecionado}
        onEditar={() => {
          setVisualizarUsuarioOpen(false);
          setEditarUsuarioOpen(true);
        }}
      />

      <EditarUsuarioDialog
        open={editarUsuarioOpen}
        onOpenChange={setEditarUsuarioOpen}
        usuario={usuarioSelecionado}
        onSalvar={atualizarUsuario}
        onAtualizarRole={atualizarRole}
        emailJaExiste={emailJaExiste}
        isAdmin={isAdmin}
      />

      <ExcluirUsuarioDialog
        open={excluirUsuarioOpen}
        onOpenChange={setExcluirUsuarioOpen}
        usuario={usuarioSelecionado}
        onConfirmar={confirmarExclusao}
      />

      <ConfigurarPermissoesDialog
        open={permissoesOpen}
        onOpenChange={setPermissoesOpen}
      />
    </DashboardLayout>
  );
};

export default Admin;
