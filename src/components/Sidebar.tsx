import { Link, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Settings,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Search,
  X,
  Database
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserProfileSelector } from "./UserProfileSelector";

interface MenuItem {
  id: string;
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
}

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>(["cadastros", "notas-fiscais", "obrigacoes", "integracoes", "relatorios", "configuracoes"]);
  const [busca, setBusca] = useState("");

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems: MenuItem[] = useMemo(() => [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    {
      id: "cadastros",
      label: "Cadastros",
      children: [
        { label: "Produtos", path: "/cadastros/produtos" },
        { label: "Clientes e Fornecedores", path: "/cadastros/clientes-fornecedores" },
        { label: "Formas de Pagamento", path: "/cadastros/formas-pagamento" },
      ],
    },
    {
      id: "notas-fiscais",
      label: "Notas Fiscais",
      children: [
        { label: "Emissão NF-e", path: "/nfe" },
        { label: "Emissão NFS-e", path: "/nfse" },
        { label: "Emissão NFC-e", path: "/nfce" },
        { label: "Validação de NF", path: "/validacao-nf" },
      ],
    },
    {
      id: "obrigacoes",
      label: "Obrigações Acessórias",
      children: [
        { label: "SPED Fiscal", path: "/sped-fiscal" },
        { label: "EFD-Reinf", path: "/efd-reinf" },
      ],
    },
    {
      id: "integracoes",
      label: "Integrações",
      children: [
        { label: "Integração ERP", path: "/integracao-erp" },
        { label: "Automação RPA", path: "/automacao-rpa" },
      ],
    },
    {
      id: "relatorios",
      label: "Relatórios",
      children: [
        { label: "Armazenamento XML", path: "/armazenamento-xml" },
        { label: "Indicadores Fiscais", path: "/indicadores-fiscais" },
        { label: "Monitoramento", path: "/monitoramento" },
      ],
    },
    {
      id: "configuracoes",
      label: "Configurações",
      children: [
        { label: "Usuários", path: "/admin" },
        { label: "Empresas e Filiais", path: "/empresas-filiais" },
        { label: "Certificados Digitais", path: "/certificados-digitais" },
        { label: "Parâmetros Fiscais", path: "/parametros-fiscais" },
        { label: "Controle LGPD", path: "/controle-lgpd" },
      ],
    },
  ], []);

  const itemsFiltrados = useMemo(() => {
    if (!busca.trim()) return menuItems;

    const buscaLower = busca.toLowerCase();
    return menuItems
      .map(item => {
        if (item.children) {
          const childrenFiltrados = item.children.filter(child =>
            child.label.toLowerCase().includes(buscaLower)
          );
          if (childrenFiltrados.length > 0) {
            return { ...item, children: childrenFiltrados };
          }
        }
        if (item.label.toLowerCase().includes(buscaLower)) {
          return item;
        }
        return null;
      })
      .filter(Boolean) as MenuItem[];
  }, [busca, menuItems]);

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col">
      {/* Perfil do Usuário com Seletor de Empresa */}
      <div className="p-4 border-b border-sidebar-border space-y-3">
        <UserProfileSelector />

        {/* Campo de Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar no menu..."
            className="pl-9 pr-9 h-9 bg-sidebar-accent/50 border-sidebar-border"
          />
          {busca && (
            <button
              onClick={() => setBusca("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {itemsFiltrados.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Nenhum resultado para "{busca}"
          </div>
        ) : (
          itemsFiltrados.map((item) => (
            item.children ? (
              <div key={item.id}>
                <button
                  onClick={() => toggleMenu(item.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-smooth"
                >
                  <div className="flex items-center gap-3">
                    {item.id === "cadastros" && <Database className="w-5 h-5" />}
                    {item.id === "notas-fiscais" && <FileText className="w-5 h-5" />}
                    {item.id === "obrigacoes" && <BarChart3 className="w-5 h-5" />}
                    {item.id === "integracoes" && <Settings className="w-5 h-5" />}
                    {item.id === "relatorios" && <FileText className="w-5 h-5" />}
                    {item.id === "configuracoes" && <Settings className="w-5 h-5" />}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {openMenus.includes(item.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {(openMenus.includes(item.id) || busca) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block px-4 py-2 rounded-lg text-sm transition-smooth ${
                          isActive(child.path)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.id}
                to={item.path!}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                  isActive(item.path!)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border border-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          ))
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
