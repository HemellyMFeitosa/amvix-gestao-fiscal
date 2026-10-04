import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, Send, Save } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useClientesFornecedores, useProdutosServicos, useEmpresaAtual } from "@/hooks/useNotasFiscais";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ItemServico {
  id: string;
  servico_id: string;
  codigo: string;
  descricao: string;
  codigo_servico: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  aliquota_iss: number;
  valor_iss: number;
  valor_pis: number;
  valor_cofins: number;
  valor_inss: number;
  valor_ir: number;
  valor_csll: number;
}

interface NovaNotaServicoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: string;
}

export const NovaNotaServicoDialog = ({ open, onOpenChange, empresaId }: NovaNotaServicoDialogProps) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("identificacao");
  
  // Dados básicos
  const [serie, setSerie] = useState("1");
  const [dataEmissao, setDataEmissao] = useState<Date>(new Date());
  const [competencia, setCompetencia] = useState(format(new Date(), "MM/yyyy"));
  
  // Tomador (cliente)
  const [tipoTomador, setTipoTomador] = useState("pj");
  const [tomadorId, setTomadorId] = useState("");
  const [cnpjCpf, setCnpjCpf] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  
  // Serviços
  const [itens, setItens] = useState<ItemServico[]>([]);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [itemAtual, setItemAtual] = useState<ItemServico | null>(null);
  
  // Impostos e retenções
  const [retencaoIss, setRetencaoIss] = useState(false);
  const [retencaoPis, setRetencaoPis] = useState(false);
  const [retencaoCofins, setRetencaoCofins] = useState(false);
  const [retencaoInss, setRetencaoInss] = useState(false);
  const [retencaoIr, setRetencaoIr] = useState(false);
  const [retencaoCsll, setRetencaoCsll] = useState(false);
  
  // Informações adicionais
  const [infComplementar, setInfComplementar] = useState("");
  
  const [loading, setLoading] = useState(false);

  const { data: clientes } = useClientesFornecedores(empresaId);
  const { data: servicos } = useProdutosServicos(empresaId);

  const codigosServico = [
    { value: "01.01", label: "01.01 - Análise e desenvolvimento de sistemas" },
    { value: "01.02", label: "01.02 - Programação" },
    { value: "01.03", label: "01.03 - Processamento de dados" },
    { value: "01.07", label: "01.07 - Suporte técnico em informática" },
    { value: "17.01", label: "17.01 - Assessoria ou consultoria" },
    { value: "17.02", label: "17.02 - Análise, programação, instalação" },
  ];

  const adicionarItem = () => {
    const novoItem: ItemServico = {
      id: crypto.randomUUID(),
      servico_id: "",
      codigo: "",
      descricao: "",
      codigo_servico: "01.01",
      quantidade: 1,
      valor_unitario: 0,
      valor_total: 0,
      aliquota_iss: 5,
      valor_iss: 0,
      valor_pis: 0,
      valor_cofins: 0,
      valor_inss: 0,
      valor_ir: 0,
      valor_csll: 0,
    };
    setItemAtual(novoItem);
    setShowItemDialog(true);
  };

  const removerItem = (id: string) => {
    setItens(itens.filter((item) => item.id !== id));
  };

  const calcularItem = (item: Partial<ItemServico>): ItemServico => {
    const quantidade = item.quantidade || 0;
    const valorUnitario = item.valor_unitario || 0;
    const valorTotal = quantidade * valorUnitario;
    
    const valorIss = retencaoIss ? 0 : valorTotal * ((item.aliquota_iss || 0) / 100);
    const valorPis = retencaoPis ? 0 : valorTotal * 0.0065;
    const valorCofins = retencaoCofins ? 0 : valorTotal * 0.03;
    const valorInss = retencaoInss ? 0 : valorTotal * 0.11;
    const valorIr = retencaoIr ? 0 : valorTotal * 0.015;
    const valorCsll = retencaoCsll ? 0 : valorTotal * 0.01;
    
    return {
      ...item,
      valor_total: valorTotal,
      valor_iss: valorIss,
      valor_pis: valorPis,
      valor_cofins: valorCofins,
      valor_inss: valorInss,
      valor_ir: valorIr,
      valor_csll: valorCsll,
    } as ItemServico;
  };

  const salvarItem = () => {
    if (!itemAtual) return;
    
    if (!itemAtual.servico_id) {
      toast.error("Selecione um serviço");
      return;
    }
    if (itemAtual.quantidade <= 0) {
      toast.error("Quantidade deve ser maior que 0");
      return;
    }
    if (itemAtual.valor_unitario <= 0) {
      toast.error("Valor unitário deve ser maior que 0");
      return;
    }
    
    const itemCalculado = calcularItem(itemAtual);
    
    const index = itens.findIndex(i => i.id === itemCalculado.id);
    if (index >= 0) {
      const novosItens = [...itens];
      novosItens[index] = itemCalculado;
      setItens(novosItens);
    } else {
      setItens([...itens, itemCalculado]);
    }
    
    setShowItemDialog(false);
    setItemAtual(null);
  };

  const selecionarServico = (servicoId: string) => {
    const servico = servicos?.find(s => s.id === servicoId);
    if (servico && itemAtual) {
      setItemAtual({
        ...itemAtual,
        servico_id: servicoId,
        codigo: servico.codigo,
        descricao: servico.descricao,
        valor_unitario: Number(servico.valor_unitario),
      });
    }
  };

  const calcularTotais = () => {
    const totalServicos = itens.reduce((acc, item) => acc + item.valor_total, 0);
    const totalIss = itens.reduce((acc, item) => acc + item.valor_iss, 0);
    const totalPis = itens.reduce((acc, item) => acc + item.valor_pis, 0);
    const totalCofins = itens.reduce((acc, item) => acc + item.valor_cofins, 0);
    const totalInss = itens.reduce((acc, item) => acc + item.valor_inss, 0);
    const totalIr = itens.reduce((acc, item) => acc + item.valor_ir, 0);
    const totalCsll = itens.reduce((acc, item) => acc + item.valor_csll, 0);
    
    const totalImpostos = totalIss + totalPis + totalCofins + totalInss + totalIr + totalCsll;
    const valorLiquido = totalServicos - totalImpostos;
    
    return {
      totalServicos,
      totalIss,
      totalPis,
      totalCofins,
      totalInss,
      totalIr,
      totalCsll,
      totalImpostos,
      valorLiquido,
    };
  };

  const validarFormulario = () => {
    if (!tomadorId && !cnpjCpf) {
      toast.error("Selecione ou preencha os dados do tomador");
      return false;
    }
    if (itens.length === 0) {
      toast.error("Adicione pelo menos 1 serviço");
      return false;
    }
    return true;
  };

  const obterProximoNumero = async () => {
    const { data, error } = await supabase
      .from("notas_fiscais")
      .select("numero")
      .eq("empresa_id", empresaId)
      .eq("tipo", "NFS-e")
      .eq("serie", parseInt(serie))
      .order("numero", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== "PGRST116") throw error;
    return data ? data.numero + 1 : 1;
  };

  const transmitirNota = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const numero = await obterProximoNumero();
      const totais = calcularTotais();

      const { error } = await supabase.from("notas_fiscais").insert([{
        empresa_id: empresaId,
        cliente_fornecedor_id: tomadorId,
        numero,
        serie: parseInt(serie),
        tipo: "NFS-e",
        natureza_operacao: "Prestação de Serviços",
        status: "Autorizada",
        data_emissao: format(dataEmissao, "yyyy-MM-dd"),
        valor_total: totais.valorLiquido,
        dados_fiscais: {
          competencia,
          tomador: {
            tipo: tipoTomador,
            cnpj_cpf: cnpjCpf,
            razao_social: razaoSocial,
            email,
            telefone,
            endereco,
            cidade,
            uf,
          },
          servicos: itens,
          retencoes: {
            iss: retencaoIss,
            pis: retencaoPis,
            cofins: retencaoCofins,
            inss: retencaoInss,
            ir: retencaoIr,
            csll: retencaoCsll,
          },
          informacoes_complementares: infComplementar,
          totais,
        } as any,
      }]);

      if (error) throw error;

      toast.success("NFS-e transmitida e autorizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["notas-servico-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notas-servico-list"] });
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Erro ao transmitir nota fiscal");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSerie("1");
    setDataEmissao(new Date());
    setCompetencia(format(new Date(), "MM/yyyy"));
    setTipoTomador("pj");
    setTomadorId("");
    setCnpjCpf("");
    setRazaoSocial("");
    setEmail("");
    setTelefone("");
    setEndereco("");
    setCidade("");
    setUf("");
    setItens([]);
    setRetencaoIss(false);
    setRetencaoPis(false);
    setRetencaoCofins(false);
    setRetencaoInss(false);
    setRetencaoIr(false);
    setRetencaoCsll(false);
    setInfComplementar("");
    setActiveTab("identificacao");
  };

  const totais = calcularTotais();

  const buscarTomador = (tomadorIdSelecionado: string) => {
    const cliente = clientes?.find(c => c.id === tomadorIdSelecionado);
    if (cliente) {
      setTomadorId(tomadorIdSelecionado);
      setCnpjCpf(cliente.cpf_cnpj);
      setRazaoSocial(cliente.nome_razao_social);
      setEmail(cliente.email || "");
      setTelefone(cliente.telefone || "");
      setEndereco(cliente.endereco || "");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">Emitir Nova NFS-e</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="identificacao">Identificação</TabsTrigger>
              <TabsTrigger value="servicos">Serviços</TabsTrigger>
              <TabsTrigger value="totais">Totais</TabsTrigger>
              <TabsTrigger value="informacoes">Info. Adicionais</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              {/* ABA 1: IDENTIFICAÇÃO */}
              <TabsContent value="identificacao" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dados da NFS-e</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Série *</Label>
                      <Input
                        type="number"
                        value={serie}
                        onChange={(e) => setSerie(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Data de Emissão *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dataEmissao && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataEmissao ? format(dataEmissao, "dd/MM/yyyy") : "Selecione..."}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dataEmissao}
                            onSelect={(date) => date && setDataEmissao(date)}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Competência *</Label>
                      <Input
                        value={competencia}
                        onChange={(e) => setCompetencia(e.target.value)}
                        placeholder="MM/AAAA"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tomador do Serviço</h3>
                  <div>
                    <Label>Tipo *</Label>
                    <RadioGroup value={tipoTomador} onValueChange={setTipoTomador}>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pj" id="pj" />
                          <Label htmlFor="pj">Pessoa Jurídica</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pf" id="pf" />
                          <Label htmlFor="pf">Pessoa Física</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Buscar Cliente Cadastrado</Label>
                      <Select value={tomadorId} onValueChange={buscarTomador}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente..." />
                        </SelectTrigger>
                        <SelectContent>
                          {clientes?.map((cliente) => (
                            <SelectItem key={cliente.id} value={cliente.id}>
                              {cliente.nome_razao_social} - {cliente.cpf_cnpj}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>{tipoTomador === "pj" ? "CNPJ *" : "CPF *"}</Label>
                      <Input
                        value={cnpjCpf}
                        onChange={(e) => setCnpjCpf(e.target.value)}
                        placeholder={tipoTomador === "pj" ? "00.000.000/0000-00" : "000.000.000-00"}
                      />
                    </div>

                    <div>
                      <Label>{tipoTomador === "pj" ? "Razão Social *" : "Nome *"}</Label>
                      <Input
                        value={razaoSocial}
                        onChange={(e) => setRazaoSocial(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>E-mail</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Telefone</Label>
                      <Input
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="(00) 00000-0000"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Endereço</Label>
                      <Input
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Cidade</Label>
                      <Input
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>UF</Label>
                      <Select value={uf} onValueChange={setUf}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ES">ES</SelectItem>
                          <SelectItem value="SP">SP</SelectItem>
                          <SelectItem value="RJ">RJ</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA 2: SERVIÇOS */}
              <TabsContent value="servicos" className="space-y-4 mt-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Serviços Prestados</h3>
                  <Button onClick={adicionarItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Serviço
                  </Button>
                </div>

                {itens.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Nenhum serviço adicionado. Clique em "Adicionar Serviço" para começar.
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left py-3 px-4 text-sm">Item</th>
                            <th className="text-left py-3 px-4 text-sm">Código</th>
                            <th className="text-left py-3 px-4 text-sm">Descrição</th>
                            <th className="text-right py-3 px-4 text-sm">Qtd</th>
                            <th className="text-right py-3 px-4 text-sm">Vlr.Unit</th>
                            <th className="text-right py-3 px-4 text-sm">Total</th>
                            <th className="text-center py-3 px-4 text-sm">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itens.map((item, index) => (
                            <tr key={item.id} className="border-t">
                              <td className="py-3 px-4">{index + 1}</td>
                              <td className="py-3 px-4">{item.codigo}</td>
                              <td className="py-3 px-4">{item.descricao}</td>
                              <td className="py-3 px-4 text-right">{item.quantidade}</td>
                              <td className="py-3 px-4 text-right">R$ {item.valor_unitario.toFixed(2)}</td>
                              <td className="py-3 px-4 text-right font-semibold">
                                R$ {item.valor_total.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removerItem(item.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="space-y-4 mt-6">
                  <h4 className="font-semibold">Retenções na Fonte</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="retencao-iss"
                        checked={retencaoIss}
                        onChange={(e) => setRetencaoIss(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="retencao-iss">ISS Retido</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="retencao-pis"
                        checked={retencaoPis}
                        onChange={(e) => setRetencaoPis(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="retencao-pis">PIS Retido</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="retencao-cofins"
                        checked={retencaoCofins}
                        onChange={(e) => setRetencaoCofins(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="retencao-cofins">COFINS Retido</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="retencao-inss"
                        checked={retencaoInss}
                        onChange={(e) => setRetencaoInss(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="retencao-inss">INSS Retido</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="retencao-ir"
                        checked={retencaoIr}
                        onChange={(e) => setRetencaoIr(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="retencao-ir">IR Retido</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="retencao-csll"
                        checked={retencaoCsll}
                        onChange={(e) => setRetencaoCsll(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="retencao-csll">CSLL Retido</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA 3: TOTAIS */}
              <TabsContent value="totais" className="space-y-4 mt-0">
                <h3 className="text-lg font-semibold">Valores e Tributos</h3>

                <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span>Total dos Serviços:</span>
                    <span className="font-semibold">R$ {totais.totalServicos.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-3 mt-3 space-y-2">
                    <h4 className="font-semibold mb-2">Impostos:</h4>
                    
                    <div className="flex justify-between text-sm">
                      <span>ISS ({retencaoIss ? "Retido" : "Destacado"}):</span>
                      <span>R$ {totais.totalIss.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>PIS ({retencaoPis ? "Retido" : "Destacado"}):</span>
                      <span>R$ {totais.totalPis.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>COFINS ({retencaoCofins ? "Retido" : "Destacado"}):</span>
                      <span>R$ {totais.totalCofins.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>INSS ({retencaoInss ? "Retido" : "Destacado"}):</span>
                      <span>R$ {totais.totalInss.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>IR ({retencaoIr ? "Retido" : "Destacado"}):</span>
                      <span>R$ {totais.totalIr.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>CSLL ({retencaoCsll ? "Retido" : "Destacado"}):</span>
                      <span>R$ {totais.totalCsll.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total de Impostos:</span>
                      <span>R$ {totais.totalImpostos.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>VALOR LÍQUIDO:</span>
                      <span className="text-primary">R$ {totais.valorLiquido.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA 4: INFORMAÇÕES ADICIONAIS */}
              <TabsContent value="informacoes" className="space-y-4 mt-0">
                <h3 className="text-lg font-semibold">Informações Adicionais</h3>

                <div>
                  <Label>Informações Complementares</Label>
                  <Textarea
                    value={infComplementar}
                    onChange={(e) => setInfComplementar(e.target.value)}
                    placeholder="Digite informações adicionais sobre a nota fiscal de serviço..."
                    rows={10}
                    maxLength={5000}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {infComplementar.length}/5000 caracteres
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* RODAPÉ FIXO */}
          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <div className="text-sm text-muted-foreground">
              {itens.length} {itens.length === 1 ? "serviço" : "serviços"} • Valor Líquido: R$ {totais.valorLiquido.toFixed(2)}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={transmitirNota} disabled={loading || !validarFormulario()}>
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Transmitindo..." : "Transmitir"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL ADICIONAR SERVIÇO */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Serviço</DialogTitle>
          </DialogHeader>

          {itemAtual && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Serviço *</Label>
                  <Select
                    value={itemAtual.servico_id}
                    onValueChange={selecionarServico}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço..." />
                    </SelectTrigger>
                    <SelectContent>
                      {servicos?.map((servico) => (
                        <SelectItem key={servico.id} value={servico.id}>
                          {servico.codigo} - {servico.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Código</Label>
                  <Input
                    value={itemAtual.codigo}
                    onChange={(e) => setItemAtual({ ...itemAtual, codigo: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Código do Serviço *</Label>
                  <Select
                    value={itemAtual.codigo_servico}
                    onValueChange={(value) => setItemAtual({ ...itemAtual, codigo_servico: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {codigosServico.map((codigo) => (
                        <SelectItem key={codigo.value} value={codigo.value}>
                          {codigo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label>Descrição *</Label>
                  <Textarea
                    value={itemAtual.descricao}
                    onChange={(e) => setItemAtual({ ...itemAtual, descricao: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Quantidade *</Label>
                  <Input
                    type="number"
                    value={itemAtual.quantidade}
                    onChange={(e) =>
                      setItemAtual({ ...itemAtual, quantidade: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>

                <div>
                  <Label>Valor Unitário *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={itemAtual.valor_unitario}
                    onChange={(e) =>
                      setItemAtual({ ...itemAtual, valor_unitario: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>

                <div>
                  <Label>Alíquota ISS (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={itemAtual.aliquota_iss}
                    onChange={(e) =>
                      setItemAtual({ ...itemAtual, aliquota_iss: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>

                <div>
                  <Label>Valor Total</Label>
                  <Input
                    value={(itemAtual.quantidade * itemAtual.valor_unitario).toFixed(2)}
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowItemDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={salvarItem}>Adicionar Serviço</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
