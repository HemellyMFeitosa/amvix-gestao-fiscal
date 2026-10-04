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
import { Edit, Trash2, Eye, Plus, Download } from "lucide-react";

interface Invoice {
  id: number;
  data: string;
  destinatario: string;
  tipo: string;
  valor: string;
  status: string;
}

const Invoices = () => {
  const [filterTipo, setFilterTipo] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");

  const invoices: Invoice[] = [
    {
      id: 1,
      data: "15/01/2025",
      destinatario: "Empresa ABC Ltda",
      tipo: "NF-e",
      valor: "R$ 15.240,00",
      status: "Aprovada",
    },
    {
      id: 2,
      data: "15/01/2025",
      destinatario: "Comércio XYZ S/A",
      tipo: "NFS-e",
      valor: "R$ 8.500,00",
      status: "Processando",
    },
    {
      id: 3,
      data: "14/01/2025",
      destinatario: "Indústria 123 ME",
      tipo: "NFC-e",
      valor: "R$ 3.200,00",
      status: "Aprovada",
    },
    {
      id: 4,
      data: "14/01/2025",
      destinatario: "Serviços QWE Ltda",
      tipo: "NF-e",
      valor: "R$ 22.100,00",
      status: "Rejeitada",
    },
    {
      id: 5,
      data: "13/01/2025",
      destinatario: "Tecnologia ASD Corp",
      tipo: "NFS-e",
      valor: "R$ 45.800,00",
      status: "Aprovada",
    },
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    const matchTipo = filterTipo === "todos" || invoice.tipo === filterTipo;
    const matchStatus = filterStatus === "todos" || invoice.status === filterStatus;
    return matchTipo && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovada":
        return "bg-green-500/10 text-green-400";
      case "Processando":
        return "bg-yellow-500/10 text-yellow-400";
      case "Rejeitada":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notas Fiscais</h1>
            <p className="text-muted-foreground">Gerencie todas as notas fiscais emitidas</p>
          </div>
          <Button size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Nova Nota Fiscal
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Data Inicial</label>
              <Input type="date" className="bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Data Final</label>
              <Input type="date" className="bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo</label>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="NF-e">NF-e</SelectItem>
                  <SelectItem value="NFS-e">NFS-e</SelectItem>
                  <SelectItem value="NFC-e">NFC-e</SelectItem>
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
                  <SelectItem value="Aprovada">Aprovada</SelectItem>
                  <SelectItem value="Processando">Processando</SelectItem>
                  <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="text-left p-4 font-semibold">Data</th>
                  <th className="text-left p-4 font-semibold">Destinatário</th>
                  <th className="text-left p-4 font-semibold">Tipo</th>
                  <th className="text-left p-4 font-semibold">Valor</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border hover:bg-muted/20 transition-smooth">
                    <td className="p-4 text-muted-foreground">{invoice.data}</td>
                    <td className="p-4 font-medium">{invoice.destinatario}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        {invoice.tipo}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{invoice.valor}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive">
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
          Mostrando {filteredInvoices.length} de {invoices.length} notas fiscais
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
