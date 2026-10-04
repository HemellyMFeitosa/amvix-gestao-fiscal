import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle, Activity } from "lucide-react";

const Monitoramento = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Monitoramento</h1>
          <p className="text-muted-foreground">Alertas e erros do sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Sistema</div>
                <div className="text-xl font-bold text-green-400">Online</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Erros Críticos</div>
                <div className="text-2xl font-bold">2</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avisos</div>
                <div className="text-2xl font-bold">8</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Uptime</div>
                <div className="text-xl font-bold">99.8%</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              Erros Críticos
            </h3>
            <div className="space-y-3">
              {[
                { 
                  titulo: "Falha na comunicação SEFAZ", 
                  hora: "14:32", 
                  descricao: "Timeout ao enviar NF-e #12345" 
                },
                { 
                  titulo: "Erro na validação do XML", 
                  hora: "11:15", 
                  descricao: "Schema inválido no arquivo NFe-001234.xml" 
                },
              ].map((erro, idx) => (
                <div key={idx} className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-red-400">{erro.titulo}</div>
                    <div className="text-sm text-muted-foreground">{erro.hora}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{erro.descricao}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Avisos
            </h3>
            <div className="space-y-3">
              {[
                { 
                  titulo: "Certificado próximo ao vencimento", 
                  hora: "Hoje", 
                  descricao: "Certificado A1 vence em 15 dias" 
                },
                { 
                  titulo: "Armazenamento em 80%", 
                  hora: "Hoje", 
                  descricao: "Considere limpar arquivos antigos" 
                },
                { 
                  titulo: "Sincronização ERP atrasada", 
                  hora: "13:45", 
                  descricao: "Última sincronização há 2 horas" 
                },
              ].map((aviso, idx) => (
                <div key={idx} className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-yellow-400">{aviso.titulo}</div>
                    <div className="text-sm text-muted-foreground">{aviso.hora}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{aviso.descricao}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Status dos Serviços</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { servico: "API de Emissão", status: "online" },
              { servico: "SEFAZ Conexão", status: "online" },
              { servico: "Banco de Dados", status: "online" },
              { servico: "Armazenamento XML", status: "online" },
              { servico: "Integração ERP", status: "aviso" },
              { servico: "Backup Automático", status: "online" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-background rounded-lg">
                <span className="font-semibold">{item.servico}</span>
                <div className="flex items-center gap-2">
                  {item.status === "online" ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-sm text-green-400">Online</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                      <span className="text-sm text-yellow-400">Atenção</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Monitoramento;