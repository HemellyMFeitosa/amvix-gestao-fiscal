import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Empresa } from "@/contexts/EmpresaContext";
import { useEmpresas } from "@/hooks/useEmpresas";
import { formatCNPJ, validateCNPJ } from "@/lib/cnpj";
import { buscarCEP } from "@/lib/viacep";
import { Search, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/errorMapper";

interface EmpresaModalProps {
  open: boolean;
  onClose: (recarregar: boolean) => void;
  empresa: Empresa | null;
}

const EmpresaModal = ({ open, onClose, empresa }: EmpresaModalProps) => {
  const { criarEmpresa, atualizarEmpresa, loading } = useEmpresas();
  const [loadingCep, setLoadingCep] = useState(false);
  
  const [formData, setFormData] = useState({
    codigo: "",
    cnpj: "",
    razao_social: "",
    nome_fantasia: "",
    inscricao_estadual: "",
    inscricao_municipal: "",
    regime_tributario: "Lucro Real",
    status: "Ativa",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    telefone: "",
    celular: "",
    email: "",
    site: "",
  });

  useEffect(() => {
    if (empresa) {
      setFormData({
        codigo: empresa.codigo || "",
        cnpj: empresa.cnpj || "",
        razao_social: empresa.razao_social || "",
        nome_fantasia: empresa.nome_fantasia || "",
        inscricao_estadual: empresa.inscricao_estadual || "",
        inscricao_municipal: empresa.inscricao_municipal || "",
        regime_tributario: empresa.regime_tributario || "Lucro Real",
        status: empresa.status || "Ativa",
        cep: empresa.cep || "",
        logradouro: empresa.logradouro || "",
        numero: empresa.numero || "",
        complemento: empresa.complemento || "",
        bairro: empresa.bairro || "",
        cidade: empresa.cidade || "",
        estado: empresa.estado || "",
        telefone: empresa.telefone || "",
        celular: empresa.celular || "",
        email: empresa.email || "",
        site: empresa.site || "",
      });
    } else {
      setFormData({
        codigo: "",
        cnpj: "",
        razao_social: "",
        nome_fantasia: "",
        inscricao_estadual: "",
        inscricao_municipal: "",
        regime_tributario: "Lucro Real",
        status: "Ativa",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        telefone: "",
        celular: "",
        email: "",
        site: "",
      });
    }
  }, [empresa, open]);

  const handleBuscarCEP = async () => {
    if (!formData.cep) return;

    try {
      setLoadingCep(true);
      const data = await buscarCEP(formData.cep);
      
      if (data) {
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        }));
        
        toast({
          title: "CEP encontrado",
          description: "Endereço preenchido automaticamente",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Erro ao buscar CEP",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSubmit = async () => {
    // Validações
    if (!formData.cnpj || !formData.razao_social || !formData.nome_fantasia) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha CNPJ, Razão Social e Nome Fantasia",
        variant: "destructive",
      });
      return;
    }

    if (!validateCNPJ(formData.cnpj)) {
      toast({
        title: "CNPJ inválido",
        description: "Verifique o CNPJ informado",
        variant: "destructive",
      });
      return;
    }

    let result;
    if (empresa) {
      result = await atualizarEmpresa(empresa.id, formData as Partial<Empresa>);
    } else {
      result = await criarEmpresa(formData as Omit<Empresa, 'id'>);
    }

    if (result) {
      onClose(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{empresa ? "Editar Empresa" : "Nova Empresa"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dados">Dados Principais</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
            <TabsTrigger value="contatos">Contatos</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                  placeholder="1, 2, 1.1, etc"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({...formData, cnpj: formatCNPJ(e.target.value)})}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="razao_social">Razão Social *</Label>
              <Input
                id="razao_social"
                value={formData.razao_social}
                onChange={(e) => setFormData({...formData, razao_social: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome_fantasia">Nome Fantasia *</Label>
              <Input
                id="nome_fantasia"
                value={formData.nome_fantasia}
                onChange={(e) => setFormData({...formData, nome_fantasia: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                <Input
                  id="inscricao_estadual"
                  value={formData.inscricao_estadual}
                  onChange={(e) => setFormData({...formData, inscricao_estadual: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inscricao_municipal">Inscrição Municipal</Label>
                <Input
                  id="inscricao_municipal"
                  value={formData.inscricao_municipal}
                  onChange={(e) => setFormData({...formData, inscricao_municipal: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="regime_tributario">Regime Tributário *</Label>
              <Select value={formData.regime_tributario} onValueChange={(value) => setFormData({...formData, regime_tributario: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Simples Nacional">Simples Nacional</SelectItem>
                  <SelectItem value="Lucro Presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="Lucro Real">Lucro Real</SelectItem>
                  <SelectItem value="MEI">MEI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={formData.status === "Ativa"}
                onCheckedChange={(checked) => setFormData({...formData, status: checked ? "Ativa" : "Inativa"})}
              />
              <Label htmlFor="status">Empresa Ativa</Label>
            </div>
          </TabsContent>

          <TabsContent value="endereco" className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => setFormData({...formData, cep: e.target.value})}
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button
                  type="button"
                  onClick={handleBuscarCEP}
                  disabled={loadingCep}
                  className="w-full"
                >
                  {loadingCep ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input
                  id="logradouro"
                  value={formData.logradouro}
                  onChange={(e) => setFormData({...formData, logradouro: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => setFormData({...formData, numero: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={formData.complemento}
                onChange={(e) => setFormData({...formData, complemento: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  <SelectItem value="AC">Acre</SelectItem>
                  <SelectItem value="AL">Alagoas</SelectItem>
                  <SelectItem value="AP">Amapá</SelectItem>
                  <SelectItem value="AM">Amazonas</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                  <SelectItem value="CE">Ceará</SelectItem>
                  <SelectItem value="DF">Distrito Federal</SelectItem>
                  <SelectItem value="ES">Espírito Santo</SelectItem>
                  <SelectItem value="GO">Goiás</SelectItem>
                  <SelectItem value="MA">Maranhão</SelectItem>
                  <SelectItem value="MT">Mato Grosso</SelectItem>
                  <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="PA">Pará</SelectItem>
                  <SelectItem value="PB">Paraíba</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="PE">Pernambuco</SelectItem>
                  <SelectItem value="PI">Piauí</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="RO">Rondônia</SelectItem>
                  <SelectItem value="RR">Roraima</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="SE">Sergipe</SelectItem>
                  <SelectItem value="TO">Tocantins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="contatos" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  placeholder="(00) 0000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  value={formData.celular}
                  onChange={(e) => setFormData({...formData, celular: e.target.value})}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="empresa@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site">Site</Label>
              <Input
                id="site"
                value={formData.site}
                onChange={(e) => setFormData({...formData, site: e.target.value})}
                placeholder="www.empresa.com.br"
              />
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configurações adicionais de certificados digitais serão implementadas em breve.
            </p>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => onClose(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Salvar Empresa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmpresaModal;
