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
import { CalendarIcon, Plus, Trash2, FileText, Send, Save } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ClienteSelectNFe } from "@/components/ClienteSelectNFe";

interface ItemNota {
  id: string;
  produto_id: string;
  codigo: string;
  descricao: string;
  ncm: string;
  cest: string;
  cfop: string;
  unidade: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  icms_cst: string;
  icms_aliquota: number;
  icms_base: number;
  icms_valor: number;
  ipi_cst: string;
  ipi_aliquota: number;
  ipi_valor: number;
  pis_cst: string;
  pis_aliquota: number;
  cofins_cst: string;
  cofins_aliquota: number;
}

interface NovaNotaFiscalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: string;
}

export const NovaNotaFiscalDialog = ({ open, onOpenChange, empresaId }: NovaNotaFiscalDialogProps) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("identificacao");
  
  // Aba 1 - Identificação
  const [naturezaOperacao, setNaturezaOperacao] = useState("5102");
  const [serie, setSerie] = useState("1");
  const [tipoOperacao, setTipoOperacao] = useState("saida");
  const [dataEmissao, setDataEmissao] = useState<Date>(new Date());
  const [dataSaida, setDataSaida] = useState<Date>(new Date());
  const [finalidade, setFinalidade] = useState("normal");
  
  // Destinatário
  const [tipoDestinatario, setTipoDestinatario] = useState("pj");
  const [clienteId, setClienteId] = useState("");
  const [cnpjCpf, setCnpjCpf] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [ie, setIe] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  
  // Aba 2 - Produtos
  const [itens, setItens] = useState<ItemNota[]>([]);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [itemAtual, setItemAtual] = useState<ItemNota | null>(null);
  
  // Aba 3 - Totais
  const [frete, setFrete] = useState(0);
  const [seguro, setSeguro] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [outrasDespesas, setOutrasDespesas] = useState(0);
  
  // Aba 4 - Transporte
  const [modalidadeFrete, setModalidadeFrete] = useState("0");
  const [transportadoraCnpj, setTransportadoraCnpj] = useState("");
  const [transportadoraRazao, setTransportadoraRazao] = useState("");
  const [transportadoraIe, setTransportadoraIe] = useState("");
  const [transportadoraEndereco, setTransportadoraEndereco] = useState("");
  const [transportadoraCidade, setTransportadoraCidade] = useState("");
  const [transportadoraUf, setTransportadoraUf] = useState("");
  const [veiculoPlaca, setVeiculoPlaca] = useState("");
  const [veiculoUf, setVeiculoUf] = useState("");
  const [veiculoRntc, setVeiculoRntc] = useState("");
  const [volumesQtd, setVolumesQtd] = useState(0);
  const [volumesEspecie, setVolumesEspecie] = useState("");
  const [volumesMarca, setVolumesMarca] = useState("");
  const [volumesNumeracao, setVolumesNumeracao] = useState("");
  const [pesoBruto, setPesoBruto] = useState(0);
  const [pesoLiquido, setPesoLiquido] = useState(0);
  
  // Aba 5 - Cobrança
  const [formaPagamento, setFormaPagamento] = useState("avista");
  const [meioPagamento, setMeioPagamento] = useState("01");
  
  // Aba 6 - Informações Adicionais
  const [infComplementar, setInfComplementar] = useState("");
  
  const [loading, setLoading] = useState(false);

  type ProdutoNFe = {
    id: string;
    codigo_sku: string;
    descricao: string;
    ncm: string | null;
    cest: string | null;
    unidade: string;
    preco_venda: number;
  };

  const { data: produtos, isLoading: loadingProdutos } = useQuery({
    queryKey: ["produtos-nfe", empresaId],
    enabled: !!empresaId,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("produtos")
          .select("id,codigo_sku,descricao,ncm,cest,unidade,preco_venda")
          .eq("empresa_id", empresaId)
          .eq("ativo", true)
          .order("descricao", { ascending: true });

        if (error) throw error;
        return (data || []) as ProdutoNFe[];
      } catch (error: any) {
        toast.error("Erro ao carregar produtos");
        throw error;
      }
    },
  });

  const naturezasOperacao = [
    { value: "5102", label: "5.102 - Venda de mercadoria" },
    { value: "5101", label: "5.101 - Venda de produção própria" },
    { value: "5405", label: "5.405 - Venda de mercadoria ZFM" },
    { value: "5949", label: "5.949 - Outra saída de mercadoria" },
  ];

  const cfops = [
    { value: "5101", label: "5101 - Venda de produção do estabelecimento" },
    { value: "5102", label: "5102 - Venda de mercadoria adquirida" },
    { value: "5405", label: "5405 - Venda de mercadoria ZFM" },
  ];

  const cstIcms = [
    { value: "00", label: "00 - Tributada integralmente" },
    { value: "20", label: "20 - Com redução de base de cálculo" },
    { value: "40", label: "40 - Isenta" },
    { value: "41", label: "41 - Não tributada" },
    { value: "60", label: "60 - ICMS cobrado anteriormente por ST" },
  ];

  const cstIpi = [
    { value: "50", label: "50 - Saída tributada" },
    { value: "99", label: "99 - Outras saídas" },
  ];

  const cstPisCofins = [
    { value: "01", label: "01 - Operação tributável (base de cálculo = valor da operação)" },
    { value: "06", label: "06 - Operação tributável (alíquota zero)" },
    { value: "07", label: "07 - Operação isenta da contribuição" },
  ];

  const adicionarItem = () => {
    const novoItem: ItemNota = {
      id: crypto.randomUUID(),
      produto_id: "",
      codigo: "",
      descricao: "",
      ncm: "",
      cest: "",
      cfop: "5102",
      unidade: "UN",
      quantidade: 1,
      valor_unitario: 0,
      valor_total: 0,
      icms_cst: "00",
      icms_aliquota: 18,
      icms_base: 0,
      icms_valor: 0,
      ipi_cst: "50",
      ipi_aliquota: 0,
      ipi_valor: 0,
      pis_cst: "01",
      pis_aliquota: 1.65,
      cofins_cst: "01",
      cofins_aliquota: 7.6,
    };
    setItemAtual(novoItem);
    setShowItemDialog(true);
  };

  const removerItem = (id: string) => {
    setItens(itens.filter((item) => item.id !== id));
  };

  const calcularItem = (item: Partial<ItemNota>): ItemNota => {
    const quantidade = item.quantidade || 0;
    const valorUnitario = item.valor_unitario || 0;
    const valorTotal = quantidade * valorUnitario;
    
    const icmsBase = valorTotal;
    const icmsValor = icmsBase * ((item.icms_aliquota || 0) / 100);
    const ipiValor = valorTotal * ((item.ipi_aliquota || 0) / 100);
    
    return {
      ...item,
      valor_total: valorTotal,
      icms_base: icmsBase,
      icms_valor: icmsValor,
      ipi_valor: ipiValor,
    } as ItemNota;
  };

  const salvarItem = () => {
    if (!itemAtual) return;
    
    if (!itemAtual.produto_id) {
      toast.error("Selecione um produto");
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

  const selecionarProduto = (produtoId: string) => {
    const produto = produtos?.find((p) => p.id === produtoId);
    if (produto && itemAtual) {
      setItemAtual({
        ...itemAtual,
        produto_id: produtoId,
        codigo: produto.codigo_sku,
        descricao: produto.descricao,
        ncm: produto.ncm || "",
        cest: produto.cest || "",
        unidade: produto.unidade || "UN",
        valor_unitario: Number(produto.preco_venda),
      });
    }
  };

  const calcularTotais = () => {
    const totalProdutos = itens.reduce((acc, item) => acc + item.valor_total, 0);
    const baseIcms = itens.reduce((acc, item) => acc + item.icms_base, 0);
    const valorIcms = itens.reduce((acc, item) => acc + item.icms_valor, 0);
    const valorIpi = itens.reduce((acc, item) => acc + item.ipi_valor, 0);
    const valorPis = itens.reduce((acc, item) => acc + (item.valor_total * item.pis_aliquota / 100), 0);
    const valorCofins = itens.reduce((acc, item) => acc + (item.valor_total * item.cofins_aliquota / 100), 0);
    
    const totalNota = totalProdutos + frete + seguro + outrasDespesas - desconto + valorIpi;
    
    return {
      totalProdutos,
      baseIcms,
      valorIcms,
      valorIpi,
      valorPis,
      valorCofins,
      totalNota,
    };
  };

  const validarFormulario = () => {
    if (!naturezaOperacao) {
      toast.error("Natureza da operação é obrigatória");
      return false;
    }
    if (!clienteId && !cnpjCpf) {
      toast.error("Selecione ou preencha os dados do destinatário");
      return false;
    }
    if (itens.length === 0) {
      toast.error("Adicione pelo menos 1 item");
      return false;
    }
    if (dataSaida < dataEmissao) {
      toast.error("Data de saída não pode ser anterior à data de emissão");
      return false;
    }
    return true;
  };

  const obterProximoNumero = async () => {
    const { data, error } = await supabase
      .from("notas_fiscais")
      .select("numero")
      .eq("empresa_id", empresaId)
      .eq("serie", parseInt(serie))
      .order("numero", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== "PGRST116") throw error;
    return data ? data.numero + 1 : 1;
  };

  const salvarRascunho = async () => {
    if (itens.length === 0) {
      toast.error("Adicione pelo menos 1 item");
      return;
    }

    setLoading(true);
    try {
      const numero = await obterProximoNumero();
      const totais = calcularTotais();

      const { error } = await supabase.from("notas_fiscais").insert([{
        empresa_id: empresaId,
        cliente_fornecedor_id: clienteId,
        numero,
        serie: parseInt(serie),
        tipo: "NF-e",
        natureza_operacao: naturezasOperacao.find(n => n.value === naturezaOperacao)?.label || naturezaOperacao,
        status: "Rascunho",
        data_emissao: format(dataEmissao, "yyyy-MM-dd"),
        valor_total: totais.totalNota,
        dados_fiscais: {
          destinatario: {
            tipo: tipoDestinatario,
            cnpj_cpf: cnpjCpf,
            razao_social: razaoSocial,
            nome_fantasia: nomeFantasia,
            ie,
            endereco,
            numero,
            bairro,
            cep,
            cidade,
            uf,
            telefone,
            email,
          },
          itens,
          transporte: {
            modalidade_frete: modalidadeFrete,
            transportadora: {
              cnpj: transportadoraCnpj,
              razao_social: transportadoraRazao,
              ie: transportadoraIe,
              endereco: transportadoraEndereco,
              cidade: transportadoraCidade,
              uf: transportadoraUf,
            },
            veiculo: {
              placa: veiculoPlaca,
              uf: veiculoUf,
              rntc: veiculoRntc,
            },
            volumes: {
              quantidade: volumesQtd,
              especie: volumesEspecie,
              marca: volumesMarca,
              numeracao: volumesNumeracao,
              peso_bruto: pesoBruto,
              peso_liquido: pesoLiquido,
            },
          },
          cobranca: {
            forma_pagamento: formaPagamento,
            meio_pagamento: meioPagamento,
          },
          informacoes_complementares: infComplementar,
          totais,
        } as any,
      }]);

      if (error) throw error;

      toast.success("Rascunho salvo com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["notas-fiscais-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notas-fiscais-list"] });
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar rascunho");
    } finally {
      setLoading(false);
    }
  };

  const transmitirNota = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const numero = await obterProximoNumero();
      const totais = calcularTotais();

      const { error } = await supabase.from("notas_fiscais").insert([{
        empresa_id: empresaId,
        cliente_fornecedor_id: clienteId,
        numero,
        serie: parseInt(serie),
        tipo: "NF-e",
        natureza_operacao: naturezasOperacao.find(n => n.value === naturezaOperacao)?.label || naturezaOperacao,
        status: "Autorizada",
        data_emissao: format(dataEmissao, "yyyy-MM-dd"),
        valor_total: totais.totalNota,
        dados_fiscais: {
          destinatario: {
            tipo: tipoDestinatario,
            cnpj_cpf: cnpjCpf,
            razao_social: razaoSocial,
            nome_fantasia: nomeFantasia,
            ie,
            endereco,
            numero,
            bairro,
            cep,
            cidade,
            uf,
            telefone,
            email,
          },
          itens,
          transporte: {
            modalidade_frete: modalidadeFrete,
            transportadora: {
              cnpj: transportadoraCnpj,
              razao_social: transportadoraRazao,
              ie: transportadoraIe,
              endereco: transportadoraEndereco,
              cidade: transportadoraCidade,
              uf: transportadoraUf,
            },
            veiculo: {
              placa: veiculoPlaca,
              uf: veiculoUf,
              rntc: veiculoRntc,
            },
            volumes: {
              quantidade: volumesQtd,
              especie: volumesEspecie,
              marca: volumesMarca,
              numeracao: volumesNumeracao,
              peso_bruto: pesoBruto,
              peso_liquido: pesoLiquido,
            },
          },
          cobranca: {
            forma_pagamento: formaPagamento,
            meio_pagamento: meioPagamento,
          },
          informacoes_complementares: infComplementar,
          totais,
        } as any,
      }]);

      if (error) throw error;

      toast.success("NF-e transmitida e autorizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["notas-fiscais-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notas-fiscais-list"] });
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Erro ao transmitir nota fiscal");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNaturezaOperacao("5102");
    setSerie("1");
    setTipoOperacao("saida");
    setDataEmissao(new Date());
    setDataSaida(new Date());
    setFinalidade("normal");
    setTipoDestinatario("pj");
    setClienteId("");
    setCnpjCpf("");
    setRazaoSocial("");
    setNomeFantasia("");
    setIe("");
    setEndereco("");
    setNumero("");
    setBairro("");
    setCep("");
    setCidade("");
    setUf("");
    setTelefone("");
    setEmail("");
    setItens([]);
    setFrete(0);
    setSeguro(0);
    setDesconto(0);
    setOutrasDespesas(0);
    setModalidadeFrete("0");
    setTransportadoraCnpj("");
    setTransportadoraRazao("");
    setTransportadoraIe("");
    setTransportadoraEndereco("");
    setTransportadoraCidade("");
    setTransportadoraUf("");
    setVeiculoPlaca("");
    setVeiculoUf("");
    setVeiculoRntc("");
    setVolumesQtd(0);
    setVolumesEspecie("");
    setVolumesMarca("");
    setVolumesNumeracao("");
    setPesoBruto(0);
    setPesoLiquido(0);
    setFormaPagamento("avista");
    setMeioPagamento("01");
    setInfComplementar("");
    setActiveTab("identificacao");
  };

  const totais = calcularTotais();

  const handleClienteSelect = (cliente: any) => {
    setClienteId(cliente.id);
    setTipoDestinatario(cliente.tipo_pessoa === "fisica" ? "pf" : "pj");
    setCnpjCpf(cliente.cpf_cnpj);
    setRazaoSocial(cliente.nome_razao_social);
    setNomeFantasia(cliente.nome_fantasia || "");
    setIe(cliente.ie || "");
    setEmail(cliente.email || "");
    setTelefone(cliente.telefone || "");
    setCep(cliente.cep || "");
    setEndereco(cliente.endereco || "");
    setNumero(cliente.numero || "");
    setBairro(cliente.bairro || "");
    setCidade(cliente.cidade || "");
    setUf(cliente.uf || "");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">Emitir Nova NF-e</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="identificacao">Identificação</TabsTrigger>
              <TabsTrigger value="produtos">Produtos</TabsTrigger>
              <TabsTrigger value="totais">Totais</TabsTrigger>
              <TabsTrigger value="transporte">Transporte</TabsTrigger>
              <TabsTrigger value="cobranca">Cobrança</TabsTrigger>
              <TabsTrigger value="informacoes">Info. Adicionais</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              {/* ABA 1: IDENTIFICAÇÃO */}
              <TabsContent value="identificacao" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dados da Nota</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Natureza da Operação *</Label>
                      <Select value={naturezaOperacao} onValueChange={setNaturezaOperacao}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {naturezasOperacao.map((nat) => (
                            <SelectItem key={nat.value} value={nat.value}>
                              {nat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Série *</Label>
                      <Input
                        type="number"
                        value={serie}
                        onChange={(e) => setSerie(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Tipo de Operação *</Label>
                      <RadioGroup value={tipoOperacao} onValueChange={setTipoOperacao}>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="saida" id="saida" />
                            <Label htmlFor="saida">Saída</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="entrada" id="entrada" />
                            <Label htmlFor="entrada">Entrada</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label>Finalidade *</Label>
                      <RadioGroup value={finalidade} onValueChange={setFinalidade}>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="normal" id="normal" />
                            <Label htmlFor="normal">Normal</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="complementar" id="complementar" />
                            <Label htmlFor="complementar">Complementar</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ajuste" id="ajuste" />
                            <Label htmlFor="ajuste">Ajuste</Label>
                          </div>
                        </div>
                      </RadioGroup>
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
                      <Label>Data de Saída *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dataSaida && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataSaida ? format(dataSaida, "dd/MM/yyyy") : "Selecione..."}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dataSaida}
                            onSelect={(date) => date && setDataSaida(date)}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Destinatário</h3>
                  <div>
                    <Label>Tipo *</Label>
                    <RadioGroup value={tipoDestinatario} onValueChange={setTipoDestinatario}>
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
                      <ClienteSelectNFe
                        empresaId={empresaId}
                        value={clienteId}
                        onSelect={handleClienteSelect}
                      />
                    </div>

                    <div>
                      <Label>{tipoDestinatario === "pj" ? "CNPJ *" : "CPF *"}</Label>
                      <Input
                        value={cnpjCpf}
                        onChange={(e) => setCnpjCpf(e.target.value)}
                        placeholder={tipoDestinatario === "pj" ? "00.000.000/0000-00" : "000.000.000-00"}
                      />
                    </div>

                    <div>
                      <Label>{tipoDestinatario === "pj" ? "Razão Social *" : "Nome *"}</Label>
                      <Input
                        value={razaoSocial}
                        onChange={(e) => setRazaoSocial(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Nome Fantasia</Label>
                      <Input
                        value={nomeFantasia}
                        onChange={(e) => setNomeFantasia(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>IE</Label>
                      <Input
                        value={ie}
                        onChange={(e) => setIe(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Endereço *</Label>
                      <Input
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Número *</Label>
                      <Input
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Bairro *</Label>
                      <Input
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>CEP *</Label>
                      <Input
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        placeholder="00000-000"
                      />
                    </div>

                    <div>
                      <Label>Cidade *</Label>
                      <Input
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>UF *</Label>
                      <Select value={uf} onValueChange={setUf}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AC">AC</SelectItem>
                          <SelectItem value="AL">AL</SelectItem>
                          <SelectItem value="AP">AP</SelectItem>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="BA">BA</SelectItem>
                          <SelectItem value="CE">CE</SelectItem>
                          <SelectItem value="DF">DF</SelectItem>
                          <SelectItem value="ES">ES</SelectItem>
                          <SelectItem value="GO">GO</SelectItem>
                          <SelectItem value="MA">MA</SelectItem>
                          <SelectItem value="MT">MT</SelectItem>
                          <SelectItem value="MS">MS</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                          <SelectItem value="PA">PA</SelectItem>
                          <SelectItem value="PB">PB</SelectItem>
                          <SelectItem value="PR">PR</SelectItem>
                          <SelectItem value="PE">PE</SelectItem>
                          <SelectItem value="PI">PI</SelectItem>
                          <SelectItem value="RJ">RJ</SelectItem>
                          <SelectItem value="RN">RN</SelectItem>
                          <SelectItem value="RS">RS</SelectItem>
                          <SelectItem value="RO">RO</SelectItem>
                          <SelectItem value="RR">RR</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="SP">SP</SelectItem>
                          <SelectItem value="SE">SE</SelectItem>
                          <SelectItem value="TO">TO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Telefone</Label>
                      <Input
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="(00) 00000-0000"
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
                  </div>
                </div>
              </TabsContent>

              {/* ABA 2: PRODUTOS/SERVIÇOS */}
              <TabsContent value="produtos" className="space-y-4 mt-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Produtos/Serviços</h3>
                  <Button onClick={adicionarItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>

                {itens.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Nenhum item adicionado. Clique em "Adicionar Item" para começar.
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
                            <th className="text-left py-3 px-4 text-sm">NCM</th>
                            <th className="text-left py-3 px-4 text-sm">CFOP</th>
                            <th className="text-left py-3 px-4 text-sm">Un</th>
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
                              <td className="py-3 px-4">{item.ncm}</td>
                              <td className="py-3 px-4">{item.cfop}</td>
                              <td className="py-3 px-4">{item.unidade}</td>
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
              </TabsContent>

              {/* ABA 3: TOTAIS */}
              <TabsContent value="totais" className="space-y-4 mt-0">
                <h3 className="text-lg font-semibold">Valores e Totais</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Frete</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={frete}
                      onChange={(e) => setFrete(parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                    />
                  </div>

                  <div>
                    <Label>Seguro</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={seguro}
                      onChange={(e) => setSeguro(parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                    />
                  </div>

                  <div>
                    <Label>Desconto</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={desconto}
                      onChange={(e) => setDesconto(parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                    />
                  </div>

                  <div>
                    <Label>Outras Despesas</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={outrasDespesas}
                      onChange={(e) => setOutrasDespesas(parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg space-y-3 mt-6">
                  <h4 className="font-semibold mb-4">Resumo Fiscal</h4>
                  
                  <div className="flex justify-between">
                    <span>Total de Produtos:</span>
                    <span className="font-semibold">R$ {totais.totalProdutos.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span>R$ {frete.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Seguro:</span>
                    <span>R$ {seguro.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Desconto:</span>
                    <span className="text-destructive">- R$ {desconto.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Outras Despesas:</span>
                    <span>R$ {outrasDespesas.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-3 mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Cálculo ICMS:</span>
                      <span>R$ {totais.baseIcms.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Valor ICMS:</span>
                      <span>R$ {totais.valorIcms.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Valor IPI:</span>
                      <span>R$ {totais.valorIpi.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Valor PIS:</span>
                      <span>R$ {totais.valorPis.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Valor COFINS:</span>
                      <span>R$ {totais.valorCofins.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>TOTAL DA NOTA:</span>
                      <span className="text-primary">R$ {totais.totalNota.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA 4: TRANSPORTE */}
              <TabsContent value="transporte" className="space-y-4 mt-0">
                <h3 className="text-lg font-semibold">Transporte</h3>

                <div>
                  <Label>Modalidade do Frete *</Label>
                  <RadioGroup value={modalidadeFrete} onValueChange={setModalidadeFrete}>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="frete-0" />
                        <Label htmlFor="frete-0">0 - Emitente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="frete-1" />
                        <Label htmlFor="frete-1">1 - Destinatário</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="frete-2" />
                        <Label htmlFor="frete-2">2 - Terceiros</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="9" id="frete-9" />
                        <Label htmlFor="frete-9">9 - Sem Frete</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Transportadora</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>CNPJ/CPF</Label>
                      <Input
                        value={transportadoraCnpj}
                        onChange={(e) => setTransportadoraCnpj(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Razão Social</Label>
                      <Input
                        value={transportadoraRazao}
                        onChange={(e) => setTransportadoraRazao(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>IE</Label>
                      <Input
                        value={transportadoraIe}
                        onChange={(e) => setTransportadoraIe(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Endereço</Label>
                      <Input
                        value={transportadoraEndereco}
                        onChange={(e) => setTransportadoraEndereco(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Cidade</Label>
                      <Input
                        value={transportadoraCidade}
                        onChange={(e) => setTransportadoraCidade(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>UF</Label>
                      <Select value={transportadoraUf} onValueChange={setTransportadoraUf}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">SP</SelectItem>
                          <SelectItem value="RJ">RJ</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Veículo</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Placa</Label>
                      <Input
                        value={veiculoPlaca}
                        onChange={(e) => setVeiculoPlaca(e.target.value)}
                        placeholder="ABC-1234"
                      />
                    </div>

                    <div>
                      <Label>UF</Label>
                      <Select value={veiculoUf} onValueChange={setVeiculoUf}>
                        <SelectTrigger>
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">SP</SelectItem>
                          <SelectItem value="RJ">RJ</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>RNTC</Label>
                      <Input
                        value={veiculoRntc}
                        onChange={(e) => setVeiculoRntc(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Volumes</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        value={volumesQtd}
                        onChange={(e) => setVolumesQtd(parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label>Espécie</Label>
                      <Input
                        value={volumesEspecie}
                        onChange={(e) => setVolumesEspecie(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Marca</Label>
                      <Input
                        value={volumesMarca}
                        onChange={(e) => setVolumesMarca(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Numeração</Label>
                      <Input
                        value={volumesNumeracao}
                        onChange={(e) => setVolumesNumeracao(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Peso Bruto (kg)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={pesoBruto}
                        onChange={(e) => setPesoBruto(parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label>Peso Líquido (kg)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={pesoLiquido}
                        onChange={(e) => setPesoLiquido(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA 5: COBRANÇA */}
              <TabsContent value="cobranca" className="space-y-4 mt-0">
                <h3 className="text-lg font-semibold">Cobrança</h3>

                <div>
                  <Label>Forma de Pagamento *</Label>
                  <RadioGroup value={formaPagamento} onValueChange={setFormaPagamento}>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="avista" id="avista" />
                        <Label htmlFor="avista">À Vista</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="aprazo" id="aprazo" />
                        <Label htmlFor="aprazo">À Prazo</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Meio de Pagamento *</Label>
                  <Select value={meioPagamento} onValueChange={setMeioPagamento}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">01 - Dinheiro</SelectItem>
                      <SelectItem value="02">02 - Cheque</SelectItem>
                      <SelectItem value="03">03 - Cartão de Crédito</SelectItem>
                      <SelectItem value="04">04 - Cartão de Débito</SelectItem>
                      <SelectItem value="15">15 - PIX</SelectItem>
                      <SelectItem value="99">99 - Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg mt-6">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Valor Total:</span>
                    <span className="text-primary">R$ {totais.totalNota.toFixed(2)}</span>
                  </div>
                </div>
              </TabsContent>

              {/* ABA 6: INFORMAÇÕES ADICIONAIS */}
              <TabsContent value="informacoes" className="space-y-4 mt-0">
                <h3 className="text-lg font-semibold">Informações Adicionais</h3>

                <div>
                  <Label>Informações Complementares</Label>
                  <Textarea
                    value={infComplementar}
                    onChange={(e) => setInfComplementar(e.target.value)}
                    placeholder="Digite informações adicionais sobre a nota fiscal..."
                    rows={8}
                    maxLength={5000}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {infComplementar.length}/5000 caracteres
                  </p>
                </div>

                <div>
                  <Label>Informações Fiscais (Gerado automaticamente)</Label>
                  <Textarea
                    value="As informações fiscais serão geradas automaticamente com base nos itens e impostos calculados."
                    disabled
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* RODAPÉ FIXO */}
          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <div className="text-sm text-muted-foreground">
              {itens.length} {itens.length === 1 ? "item" : "itens"} • Total: R$ {totais.totalNota.toFixed(2)}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button variant="outline" onClick={salvarRascunho} disabled={loading || itens.length === 0}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Rascunho
              </Button>
              <Button variant="outline" disabled={!validarFormulario()}>
                <FileText className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
              <Button onClick={transmitirNota} disabled={loading || !validarFormulario()}>
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Transmitindo..." : "Transmitir"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL ADICIONAR ITEM */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Item</DialogTitle>
          </DialogHeader>

          {itemAtual && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Produto *</Label>
                  <Select
                    value={itemAtual.produto_id}
                    onValueChange={selecionarProduto}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto..." />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingProdutos ? (
                        <div className="p-3 text-sm text-muted-foreground">Carregando produtos...</div>
                      ) : !produtos || produtos.length === 0 ? (
                        <div className="p-3 text-sm text-muted-foreground">Nenhum produto cadastrado</div>
                      ) : (
                        produtos.map((produto) => (
                          <SelectItem key={produto.id} value={produto.id}>
                            {produto.codigo_sku} - {produto.descricao}
                          </SelectItem>
                        ))
                      )}
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
                  <Label>Descrição *</Label>
                  <Input
                    value={itemAtual.descricao}
                    onChange={(e) => setItemAtual({ ...itemAtual, descricao: e.target.value })}
                  />
                </div>

                <div>
                  <Label>NCM *</Label>
                  <Input
                    value={itemAtual.ncm}
                    onChange={(e) => setItemAtual({ ...itemAtual, ncm: e.target.value })}
                    placeholder="0000.00.00"
                  />
                </div>

                <div>
                  <Label>CEST</Label>
                  <Input
                    value={itemAtual.cest}
                    onChange={(e) => setItemAtual({ ...itemAtual, cest: e.target.value })}
                    placeholder="00.000.00"
                  />
                </div>

                <div>
                  <Label>CFOP *</Label>
                  <Select
                    value={itemAtual.cfop}
                    onValueChange={(value) => setItemAtual({ ...itemAtual, cfop: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cfops.map((cfop) => (
                        <SelectItem key={cfop.value} value={cfop.value}>
                          {cfop.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Unidade *</Label>
                  <Input
                    value={itemAtual.unidade}
                    onChange={(e) => setItemAtual({ ...itemAtual, unidade: e.target.value })}
                    placeholder="UN"
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
                  <Label>Valor Total</Label>
                  <Input
                    value={(itemAtual.quantidade * itemAtual.valor_unitario).toFixed(2)}
                    disabled
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-4">Impostos</h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3">
                      <Label>ICMS CST *</Label>
                      <Select
                        value={itemAtual.icms_cst}
                        onValueChange={(value) => setItemAtual({ ...itemAtual, icms_cst: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cstIcms.map((cst) => (
                            <SelectItem key={cst.value} value={cst.value}>
                              {cst.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Alíquota ICMS (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={itemAtual.icms_aliquota}
                        onChange={(e) =>
                          setItemAtual({ ...itemAtual, icms_aliquota: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>

                    <div>
                      <Label>Base de Cálculo ICMS</Label>
                      <Input
                        value={(itemAtual.quantidade * itemAtual.valor_unitario).toFixed(2)}
                        disabled
                      />
                    </div>

                    <div>
                      <Label>Valor ICMS</Label>
                      <Input
                        value={(
                          (itemAtual.quantidade * itemAtual.valor_unitario * itemAtual.icms_aliquota) /
                          100
                        ).toFixed(2)}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3">
                      <Label>IPI CST *</Label>
                      <Select
                        value={itemAtual.ipi_cst}
                        onValueChange={(value) => setItemAtual({ ...itemAtual, ipi_cst: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cstIpi.map((cst) => (
                            <SelectItem key={cst.value} value={cst.value}>
                              {cst.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Alíquota IPI (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={itemAtual.ipi_aliquota}
                        onChange={(e) =>
                          setItemAtual({ ...itemAtual, ipi_aliquota: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>

                    <div>
                      <Label>Valor IPI</Label>
                      <Input
                        value={(
                          (itemAtual.quantidade * itemAtual.valor_unitario * itemAtual.ipi_aliquota) /
                          100
                        ).toFixed(2)}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>PIS CST *</Label>
                      <Select
                        value={itemAtual.pis_cst}
                        onValueChange={(value) => setItemAtual({ ...itemAtual, pis_cst: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cstPisCofins.map((cst) => (
                            <SelectItem key={cst.value} value={cst.value}>
                              {cst.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Alíquota PIS (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={itemAtual.pis_aliquota}
                        onChange={(e) =>
                          setItemAtual({ ...itemAtual, pis_aliquota: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>

                    <div>
                      <Label>COFINS CST *</Label>
                      <Select
                        value={itemAtual.cofins_cst}
                        onValueChange={(value) => setItemAtual({ ...itemAtual, cofins_cst: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cstPisCofins.map((cst) => (
                            <SelectItem key={cst.value} value={cst.value}>
                              {cst.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Alíquota COFINS (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={itemAtual.cofins_aliquota}
                        onChange={(e) =>
                          setItemAtual({ ...itemAtual, cofins_aliquota: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowItemDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={salvarItem}>Adicionar Item</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
