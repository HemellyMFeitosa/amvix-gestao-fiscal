import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Database, Cloud, Code, MessageSquare, Plus } from "lucide-react";

interface Integration {
  name: string;
  description: string;
  status: "conectado" | "desconectado";
  icon: typeof Database;
  color: string;
}

const Integrations = () => {
  const integrations: Integration[] = [
    {
      name: "AWS",
      description: "Serviços de cloud computing",
      status: "conectado",
      icon: Cloud,
      color: "text-orange-400",
    },
    {
      name: "PostgreSQL",
      description: "Banco de dados relacional",
      status: "conectado",
      icon: Database,
      color: "text-blue-400",
    },
    {
      name: "MongoDB",
      description: "Banco de dados NoSQL",
      status: "conectado",
      icon: Database,
      color: "text-green-400",
    },
    {
      name: "Redis",
      description: "Cache e mensageria",
      status: "desconectado",
      icon: Code,
      color: "text-red-400",
    },
    {
      name: "Slack",
      description: "Notificações e alertas",
      status: "conectado",
      icon: MessageSquare,
      color: "text-purple-400",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Integrações</h1>
            <p className="text-muted-foreground">Gerencie suas integrações e conexões externas</p>
          </div>
          <Button size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Integração
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div
                key={integration.name}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-smooth"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${integration.color}`} />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      integration.status === "conectado"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {integration.status === "conectado" ? "Conectado" : "Desconectado"}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2">{integration.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{integration.description}</p>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 hover:text-destructive hover:bg-destructive/10"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-gradient-to-br from-primary/5 to-blue-500/5 border border-primary/20 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Precisa de mais integrações?</h3>
          <p className="text-muted-foreground mb-6">
            Entre em contato com nosso suporte para adicionar novas integrações ao seu sistema
          </p>
          <Button variant="default" size="lg">
            Solicitar Nova Integração
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Integrations;
