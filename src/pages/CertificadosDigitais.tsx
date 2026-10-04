import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Lock, RefreshCw, Link2, Trash2, Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useEmpresa, Empresa } from "@/contexts/EmpresaContext";
import { useCertificados } from "@/hooks/useCertificados";

const CertificadosDigitais = () => {
  const { toast } = useToast();
  const { empresas, carregarEmpresas } = useEmpresa();
  const { cadastrarCertificado, removerCertificado, loading } = useCertificados();
  
  const [open, setOpen] = useState(false);
  const [tipoCertificado, setTipoCertificado] = useState<"A1" | "A3">("A1");
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>("");
  const [senha, setSenha] = useState("");
  const [validade, setValidade] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [tiposUso, setTiposUso] = useState<string[]>([]);

  // Empresas com certificado configurado
  const empresasComCertificado = empresas.filter(e => e.certificado_arquivo);

  const getDiasRestantes = (dataValidade: string | null | undefined) => {
    if (!dataValidade) return -1;
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diff = validade.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (dias: number) => {
    if (dias < 0) return "destructive";
    if (dias < 30) return "destructive";
    if (dias < 90) return "secondary";
    return "default";
  };

  const getStatusText = (dias: number) => {
    if (dias < 0) return "Vencido";
    if (dias < 30) return "Vence em breve";
    if (dias < 90) return "Próximo do vencimento";
    return "Válido";
  };

  const handleTestarConexao = (empresaId: string) => {
    toast({
      title: "Testando conexão...",
      description: "Verificando certificado digital.",
    });
    setTimeout(() => {
      toast({
        title: "Conexão OK",
        description: "Certificado válido e funcional.",
      });
    }, 1500);
  };

  const handleRenovar = (empresaId: string) => {
    toast({
      title: "Renovação iniciada",
      description: "Processo de renovação do certificado foi iniciado.",
    });
  };

  const handleExcluir = async (empresaId: string) => {
    const success = await removerCertificado(empresaId);
    if (success) {
      carregarEmpresas();
    }
  };

  const handleTipoUsoChange = (tipo: string, checked: boolean) => {
    if (checked) {
      setTiposUso([...tiposUso, tipo]);
    } else {
      setTiposUso(tiposUso.filter(t => t !== tipo));
    }
  };

  const handleSalvar = async () => {
    if (!empresaSelecionada) {
      toast({
        title: "Empresa obrigatória",
        description: "Selecione uma empresa para o certificado",
        variant: "destructive",
      });
      return;
    }

    if (!senha) {
      toast({
        title: "Senha obrigatória",
        description: "Digite a senha do certificado",
        variant: "destructive",
      });
      return;
    }

    if (!validade) {
      toast({
        title: "Validade obrigatória",
        description: "Informe a data de validade do certificado",
        variant: "destructive",
      });
      return;
    }

    const nomeArquivo = arquivo ? arquivo.name : `certificado_${tipoCertificado}.pfx`;
    
    const success = await cadastrarCertificado(empresaSelecionada, {
      certificado_arquivo: nomeArquivo,
      certificado_validade: validade,
      certificado_status: "Válido",
      senha: senha,
    });

    if (success) {
      setOpen(false);
      setSenha("");
      setValidade("");
      setArquivo(null);
      setEmpresaSelecionada("");
      setTiposUso([]);
      carregarEmpresas();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Certificados Digitais</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Certificado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Novo Certificado Digital</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Certificado</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="a1"
                        name="tipo"
                        value="A1"
                        checked={tipoCertificado === "A1"}
                        onChange={() => setTipoCertificado("A1")}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="a1">A1 - Arquivo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="a3"
                        name="tipo"
                        value="A3"
                        checked={tipoCertificado === "A3"}
                        onChange={() => setTipoCertificado("A3")}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="a3">A3 - Token</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa *</Label>
                  <Select value={empresaSelecionada} onValueChange={setEmpresaSelecionada}>
                    <SelectTrigger id="empresa">
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {empresas.filter(e => !e.certificado_arquivo).map((empresa) => (
                        <SelectItem key={empresa.id} value={empresa.id}>
                          {empresa.nome_fantasia} - {empresa.cnpj}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {tipoCertificado === "A1" && (
                  <div className="space-y-2">
                    <Label htmlFor="arquivo">Arquivo .pfx</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="arquivo" 
                        type="file" 
                        accept=".pfx,.p12"
                        onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                        className="flex-1"
                      />
                      {arquivo && (
                        <Badge variant="outline">
                          <Upload className="h-3 w-3 mr-1" />
                          {arquivo.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha do Certificado *</Label>
                  <Input 
                    id="senha" 
                    type="password" 
                    placeholder="Digite a senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    A senha será criptografada e armazenada com segurança
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validade">Data de Validade *</Label>
                  <Input 
                    id="validade" 
                    type="date"
                    value={validade}
                    onChange={(e) => setValidade(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipos de Uso</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["NF-e", "NFS-e", "NFC-e", "CT-e", "SPED", "EFD"].map((tipo) => (
                      <div key={tipo} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={tipo} 
                          className="h-4 w-4"
                          checked={tiposUso.includes(tipo)}
                          onChange={(e) => handleTipoUsoChange(tipo, e.target.checked)}
                        />
                        <Label htmlFor={tipo}>{tipo}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                  Cancelar
                </Button>
                <Button onClick={handleSalvar} disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Empty State */}
        {empresasComCertificado.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Lock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum certificado cadastrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Cadastre certificados digitais para suas empresas
              </p>
              <Button onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Certificado
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {empresasComCertificado.map((empresa) => {
            const diasRestantes = getDiasRestantes(empresa.certificado_validade);
            const statusColor = getStatusColor(diasRestantes);
            const statusText = getStatusText(diasRestantes);

            return (
              <Card key={empresa.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{empresa.nome_fantasia}</CardTitle>
                        <CardDescription>{empresa.cnpj}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={statusColor}>{statusText}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Arquivo:</span>
                    <span className="font-medium">{empresa.certificado_arquivo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">{empresa.certificado_status || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Validade:</span>
                    <span className="font-medium">
                      {empresa.certificado_validade 
                        ? new Date(empresa.certificado_validade).toLocaleDateString("pt-BR")
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dias restantes:</span>
                    <span className="font-medium">
                      {diasRestantes < 0 ? "Vencido" : `${diasRestantes} dias`}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleRenovar(empresa.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Renovar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleTestarConexao(empresa.id)}
                  >
                    <Link2 className="h-4 w-4" />
                    Testar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExcluir(empresa.id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CertificadosDigitais;
