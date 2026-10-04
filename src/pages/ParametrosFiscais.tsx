import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const ParametrosFiscais = () => {
  const { toast } = useToast();
  const [zonaFranca, setZonaFranca] = useState(false);
  const [contingencia, setContingencia] = useState(false);

  const handleSalvar = () => {
    toast({
      title: "Configurações salvas",
      description: "Os parâmetros fiscais foram atualizados com sucesso.",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Parâmetros Fiscais</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="nfe" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="nfe">NF-e</TabsTrigger>
            <TabsTrigger value="nfse">NFS-e</TabsTrigger>
            <TabsTrigger value="nfce">NFC-e</TabsTrigger>
            <TabsTrigger value="sped">SPED</TabsTrigger>
            <TabsTrigger value="impostos">Impostos</TabsTrigger>
            <TabsTrigger value="geral">Geral</TabsTrigger>
          </TabsList>

          {/* NF-e Tab */}
          <TabsContent value="nfe" className="space-y-6 mt-6">
            <div className="space-y-4 p-6 border rounded-lg">
              <h3 className="text-lg font-semibold">Emissão de NF-e</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ambiente</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="prod"
                        name="ambiente"
                        value="producao"
                        defaultChecked
                        className="h-4 w-4"
                      />
                      <Label htmlFor="prod">Produção</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="homolog"
                        name="ambiente"
                        value="homologacao"
                        className="h-4 w-4"
                      />
                      <Label htmlFor="homolog">Homologação</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serie">Série Padrão</Label>
                  <Input id="serie" type="number" defaultValue="1" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="auto-num" className="h-4 w-4" defaultChecked />
                <Label htmlFor="auto-num">Numeração Automática</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="finalidade">Finalidade</Label>
                <Select defaultValue="normal">
                  <SelectTrigger id="finalidade">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="complementar">Complementar</SelectItem>
                    <SelectItem value="ajuste">Ajuste</SelectItem>
                    <SelectItem value="devolucao">Devolução</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Formato DANFE</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="retrato"
                      name="formato"
                      value="retrato"
                      defaultChecked
                      className="h-4 w-4"
                    />
                    <Label htmlFor="retrato">Retrato</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="paisagem"
                      name="formato"
                      value="paisagem"
                      className="h-4 w-4"
                    />
                    <Label htmlFor="paisagem">Paisagem</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6 border rounded-lg">
              <h3 className="text-lg font-semibold">Contingência</h3>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="contingencia"
                  checked={contingencia}
                  onCheckedChange={setContingencia}
                />
                <Label htmlFor="contingencia">Ativar Contingência</Label>
              </div>

              {contingencia && (
                <div className="space-y-2">
                  <Label htmlFor="tipo-cont">Tipo de Contingência</Label>
                  <Select>
                    <SelectTrigger id="tipo-cont">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fsda">FS-DA</SelectItem>
                      <SelectItem value="epec">EPEC</SelectItem>
                      <SelectItem value="svc">SVC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </TabsContent>

          {/* NFS-e Tab */}
          <TabsContent value="nfse" className="space-y-6 mt-6">
            <div className="space-y-4 p-6 border rounded-lg">
              <h3 className="text-lg font-semibold">Configurações NFS-e</h3>
              
              <div className="space-y-2">
                <Label htmlFor="municipio">Município</Label>
                <Select>
                  <SelectTrigger id="municipio">
                    <SelectValue placeholder="Selecione o município" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sp">São Paulo - SP</SelectItem>
                    <SelectItem value="rj">Rio de Janeiro - RJ</SelectItem>
                    <SelectItem value="bh">Belo Horizonte - MG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serie-nfse">Série Padrão</Label>
                <Input id="serie-nfse" type="number" defaultValue="1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aliquota-iss">Alíquota ISS (%)</Label>
                <Input id="aliquota-iss" type="number" step="0.01" defaultValue="2.00" />
              </div>

              <div className="space-y-2">
                <Label>Retenções</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="ret-iss" className="h-4 w-4" />
                    <Label htmlFor="ret-iss">Reter ISS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="ret-ir" className="h-4 w-4" />
                    <Label htmlFor="ret-ir">Reter IR</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="ret-pis" className="h-4 w-4" />
                    <Label htmlFor="ret-pis">Reter PIS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="ret-cofins" className="h-4 w-4" />
                    <Label htmlFor="ret-cofins">Reter COFINS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="ret-csll" className="h-4 w-4" />
                    <Label htmlFor="ret-csll">Reter CSLL</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* NFC-e Tab */}
          <TabsContent value="nfce" className="space-y-6 mt-6">
            <div className="space-y-4 p-6 border rounded-lg">
              <h3 className="text-lg font-semibold">Configurações NFC-e</h3>
              
              <div className="space-y-2">
                <Label htmlFor="serie-nfce">Série Padrão</Label>
                <Input id="serie-nfce" type="number" defaultValue="1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token-csc">Token CSC</Label>
                <Input id="token-csc" type="password" placeholder="Token de Segurança" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id-csc">ID CSC</Label>
                <Input id="id-csc" type="number" placeholder="ID do Token" />
              </div>
            </div>
          </TabsContent>

          {/* SPED Tab */}
          <TabsContent value="sped" className="space-y-6 mt-6">
            <div className="space-y-4 p-6 border rounded-lg">
              <h3 className="text-lg font-semibold">Configurações SPED</h3>
              
              <div className="space-y-2">
                <Label htmlFor="perfil-sped">Perfil de Apresentação</Label>
                <Select>
                  <SelectTrigger id="perfil-sped">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">A - Perfil A</SelectItem>
                    <SelectItem value="b">B - Perfil B</SelectItem>
                    <SelectItem value="c">C - Perfil C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="indicador-atividade">Indicador de Atividade</Label>
                <Select>
                  <SelectTrigger id="indicador-atividade">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Industrial</SelectItem>
                    <SelectItem value="1">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Impostos Tab */}
          <TabsContent value="impostos" className="space-y-6 mt-6">
            <div className="space-y-4 p-6 border rounded-lg">
              <h3 className="text-lg font-semibold">Alíquotas Padrão</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icms">ICMS Padrão (%)</Label>
                  <Input id="icms" type="number" step="0.01" defaultValue="18.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipi">IPI Padrão (%)</Label>
                  <Input id="ipi" type="number" step="0.01" defaultValue="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pis">PIS Padrão (%)</Label>
                  <Input id="pis" type="number" step="0.01" defaultValue="1.65" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cofins">COFINS Padrão (%)</Label>
                  <Input id="cofins" type="number" step="0.01" defaultValue="7.60" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-1">
                  <Label htmlFor="zona-franca">Zona Franca de Manaus</Label>
                  <p className="text-sm text-muted-foreground">
                    Aplicar benefícios fiscais da ZFM
                  </p>
                </div>
                <Switch
                  id="zona-franca"
                  checked={zonaFranca}
                  onCheckedChange={setZonaFranca}
                />
              </div>
            </div>
          </TabsContent>

          {/* Geral Tab */}
          <TabsContent value="geral" className="space-y-6 mt-6">
            <div className="space-y-4 p-6 border rounded-lg">
              <h3 className="text-lg font-semibold">Configurações Gerais</h3>
              
              <div className="space-y-2">
                <Label htmlFor="natureza-op">Natureza de Operação Padrão</Label>
                <Input
                  id="natureza-op"
                  placeholder="Ex: Venda de mercadoria"
                  defaultValue="Venda de mercadoria"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="info-comp">Informações Complementares Padrão</Label>
                <Input
                  id="info-comp"
                  placeholder="Informações que aparecem em todas as notas"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSalvar} size="lg" className="gap-2">
            Salvar Configurações
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParametrosFiscais;
