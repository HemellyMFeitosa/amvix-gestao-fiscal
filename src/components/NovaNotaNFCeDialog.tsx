import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Search, ShoppingCart, Minus, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useProdutosNFCe, ProdutoNFCe } from "@/hooks/useProdutosNFCe";
import { CadastrarProdutoDialog } from "@/components/CadastrarProdutoDialog";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ItemCarrinho {
  produto: ProdutoNFCe;
  quantidade: number;
  valor_total: number;
  icms_valor: number;
}

export const NovaNotaNFCeDialog = ({ empresaId, onSuccess, disabled }: { empresaId: string | undefined; onSuccess: () => void; disabled?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("produtos");
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [searchProduto, setSearchProduto] = useState("");
  const [clienteId, setClienteId] = useState("consumidor_final");
  const [formaPagamento, setFormaPagamento] = useState("dinheiro");
  const [naturezaOperacao, setNaturezaOperacao] = useState("Venda");
  const [quantidadeDialog, setQuantidadeDialog] = useState<{ open: boolean; produto: ProdutoNFCe | null; quantidade: string }>({
    open: false,
    produto: null,
    quantidade: "1",
  });
  const [removerDialog, setRemoverDialog] = useState<{ open: boolean; index: number }>({
    open: false,
    index: -1,
  });

  const { produtos, adicionarProduto, baixarEstoque, buscarProdutos } = useProdutosNFCe();

  // Buscar clientes
  const { data: clientes } = useQuery({
    queryKey: ['clientes', empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clientes_fornecedores')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('tipo', 'Cliente');
      if (error) throw error;
      return data;
    },
    enabled: !!empresaId,
  });

  const abrirDialogQuantidade = (produto: ProdutoNFCe) => {
    setQuantidadeDialog({ open: true, produto, quantidade: "1" });
  };

  const adicionarAoCarrinho = () => {
    if (!quantidadeDialog.produto) return;
    
    const quantidade = Number(quantidadeDialog.quantidade);
    if (quantidade <= 0) {
      toast.error("Quantidade deve ser maior que zero");
      return;
    }

    if (quantidade > quantidadeDialog.produto.estoqueAtual) {
      toast.error("Estoque insuficiente");
      return;
    }

    const produto = quantidadeDialog.produto;
    const valor_total = quantidade * produto.valorVenda;
    const icms_valor = (valor_total * produto.icms.aliquota) / 100;

    const novoItem: ItemCarrinho = {
      produto,
      quantidade,
      valor_total,
      icms_valor,
    };

    setCarrinho([...carrinho, novoItem]);
    setQuantidadeDialog({ open: false, produto: null, quantidade: "1" });
    toast.success("Produto adicionado ao carrinho");
  };

  const handleAdicionarProdutoCadastrado = (produto: ProdutoNFCe) => {
    abrirDialogQuantidade(produto);
    setSearchProduto("");
  };

  const atualizarQuantidadeCarrinho = (index: number, delta: number) => {
    const novosItens = [...carrinho];
    const novaQuantidade = novosItens[index].quantidade + delta;

    if (novaQuantidade <= 0) {
      setRemoverDialog({ open: true, index });
      return;
    }

    if (novaQuantidade > novosItens[index].produto.estoqueAtual) {
      toast.error("Estoque insuficiente");
      return;
    }

    novosItens[index].quantidade = novaQuantidade;
    novosItens[index].valor_total = novaQuantidade * novosItens[index].produto.valorVenda;
    novosItens[index].icms_valor = (novosItens[index].valor_total * novosItens[index].produto.icms.aliquota) / 100;
    setCarrinho(novosItens);
  };

  const removerDoCarrinho = () => {
    if (removerDialog.index === -1) return;
    setCarrinho(carrinho.filter((_, i) => i !== removerDialog.index));
    setRemoverDialog({ open: false, index: -1 });
    toast.success("Produto removido do carrinho");
  };

  const calcularTotalProdutos = () => {
    return carrinho.reduce((sum, item) => sum + item.valor_total, 0);
  };

  const calcularTotalICMS = () => {
    return carrinho.reduce((sum, item) => sum + item.icms_valor, 0);
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  const handleEmitir = async () => {
    if (!empresaId) {
      toast.error("Empresa não identificada");
      return;
    }
    
    if (carrinho.length === 0) {
      toast.error("Adicione pelo menos um produto ao carrinho");
      return;
    }

    // Baixar estoque
    for (const item of carrinho) {
      const sucesso = baixarEstoque(item.produto.id, item.quantidade);
      if (!sucesso) {
        toast.error(`Erro ao baixar estoque do produto ${item.produto.descricao}`);
        return;
      }
    }

    const dadosFiscais = {
      produtos: carrinho.map(item => ({
        codigo: item.produto.codigoInterno,
        descricao: item.produto.descricao,
        quantidade: item.quantidade,
        valor_unitario: item.produto.valorVenda,
        valor_total: item.valor_total,
        icms: item.icms_valor,
      })),
      forma_pagamento: formaPagamento,
      total_produtos: calcularTotalProdutos(),
      total_icms: calcularTotalICMS(),
    };

    const clienteFinalId = clienteId === "consumidor_final" ? clientes?.[0]?.id : clienteId;
    
    const { error } = await supabase
      .from('notas_fiscais')
      .insert([{
        empresa_id: empresaId,
        tipo: 'NFC-e',
        natureza_operacao: naturezaOperacao,
        cliente_fornecedor_id: clienteFinalId,
        valor_total: calcularTotalProdutos(),
        status: 'Autorizada',
        dados_fiscais: dadosFiscais,
        numero: Math.floor(Math.random() * 100000),
      }]);

    if (error) {
      toast.error("Erro ao emitir NFC-e");
      return;
    }

    toast.success("NFC-e emitida com sucesso!");
    setOpen(false);
    limparCarrinho();
    setClienteId("consumidor_final");
    onSuccess();
  };

  const produtosFiltrados = buscarProdutos(searchProduto);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" disabled={disabled}>
          <Plus className="w-4 h-4 mr-2" />
          Nova NFC-e
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Emitir NFC-e</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="cliente">Cliente</TabsTrigger>
            <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
          </TabsList>

          <TabsContent value="produtos" className="space-y-4">
            <div className="space-y-4">
              {/* Busca e Cadastro */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="🔍 Digite código ou descrição..."
                    value={searchProduto}
                    onChange={(e) => setSearchProduto(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <CadastrarProdutoDialog
                  onSalvar={adicionarProduto}
                  onAdicionarAoCarrinho={abrirDialogQuantidade}
                />
              </div>

              {/* Lista de Produtos Disponíveis */}
              {!searchProduto && produtos.length === 0 && (
                <Card className="p-8 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Nenhum produto cadastrado</p>
                  <CadastrarProdutoDialog
                    onSalvar={adicionarProduto}
                    onAdicionarAoCarrinho={abrirDialogQuantidade}
                  />
                </Card>
              )}

              {searchProduto && produtosFiltrados.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Produtos Cadastrados</Label>
                  <div className="grid gap-2 max-h-60 overflow-y-auto">
                    {produtosFiltrados.map((produto) => (
                      <Card
                        key={produto.id}
                        className="p-3 hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => handleAdicionarProdutoCadastrado(produto)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">📦 {produto.descricao}</div>
                            <div className="text-sm text-muted-foreground">
                              Cód: {produto.codigoInterno} | Estoque: {produto.estoqueAtual} {produto.unidade}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-400">R$ {produto.valorVenda.toFixed(2)}</div>
                            <Button size="sm" variant="outline" className="mt-1">
                              <Plus className="w-3 h-3 mr-1" />
                              Adicionar
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Carrinho */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">
                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                    Carrinho
                  </Label>
                  {carrinho.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={limparCarrinho}>
                      Limpar
                    </Button>
                  )}
                </div>

                {carrinho.length === 0 ? (
                  <Card className="p-8 text-center text-muted-foreground">
                    Carrinho vazio
                  </Card>
                ) : (
                  <div className="space-y-2">
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-2 text-sm">Produto</th>
                            <th className="text-center p-2 text-sm">Qtd</th>
                            <th className="text-right p-2 text-sm">Vlr.Unit</th>
                            <th className="text-right p-2 text-sm">Total</th>
                            <th className="text-right p-2 text-sm">ICMS</th>
                            <th className="p-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {carrinho.map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-2">
                                <div className="font-medium text-sm">{item.produto.descricao}</div>
                                <div className="text-xs text-muted-foreground">
                                  Cód: {item.produto.codigoInterno}
                                </div>
                              </td>
                              <td className="p-2">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => atualizarQuantidadeCarrinho(index, -1)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">{item.quantidade}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => atualizarQuantidadeCarrinho(index, 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                              <td className="p-2 text-right text-sm">
                                R$ {item.produto.valorVenda.toFixed(2)}
                              </td>
                              <td className="p-2 text-right font-medium">
                                R$ {item.valor_total.toFixed(2)}
                              </td>
                              <td className="p-2 text-right text-sm text-muted-foreground">
                                R$ {item.icms_valor.toFixed(2)}
                              </td>
                              <td className="p-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => setRemoverDialog({ open: true, index })}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <Card className="p-4 bg-muted/50">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Total Produtos:</span>
                          <span className="font-medium">R$ {calcularTotalProdutos().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Total ICMS:</span>
                          <span>R$ {calcularTotalICMS().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                          <span>TOTAL:</span>
                          <span className="text-green-400">R$ {calcularTotalProdutos().toFixed(2)}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cliente" className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente (Opcional)</Label>
              <Select value={clienteId} onValueChange={setClienteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Consumidor Final" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumidor_final">Consumidor Final</SelectItem>
                  {clientes?.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome_razao_social} - {cliente.cpf_cnpj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Natureza da Operação</Label>
              <Input
                value={naturezaOperacao}
                onChange={(e) => setNaturezaOperacao(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="pagamento" className="space-y-4">
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="vale">Vale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Valor Total a Pagar:</span>
                <span className="text-green-400">R$ {calcularTotalProdutos().toFixed(2)}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleEmitir} disabled={carrinho.length === 0}>
            Emitir NFC-e
          </Button>
        </div>
      </DialogContent>

      {/* Dialog de Quantidade */}
      <Dialog open={quantidadeDialog.open} onOpenChange={(open) => setQuantidadeDialog({ ...quantidadeDialog, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar ao Carrinho</DialogTitle>
          </DialogHeader>
          
          {quantidadeDialog.produto && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">{quantidadeDialog.produto.descricao}</p>
                <p className="text-sm text-muted-foreground">Valor: R$ {quantidadeDialog.produto.valorVenda.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Estoque: {quantidadeDialog.produto.estoqueAtual} {quantidadeDialog.produto.unidade}</p>
              </div>

              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  min="1"
                  max={quantidadeDialog.produto.estoqueAtual}
                  value={quantidadeDialog.quantidade}
                  onChange={(e) => setQuantidadeDialog({ ...quantidadeDialog, quantidade: e.target.value })}
                />
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>R$ {(Number(quantidadeDialog.quantidade) * quantidadeDialog.produto.valorVenda).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setQuantidadeDialog({ open: false, produto: null, quantidade: "1" })}>
                  Cancelar
                </Button>
                <Button onClick={adicionarAoCarrinho}>
                  Adicionar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Remoção */}
      <AlertDialog open={removerDialog.open} onOpenChange={(open) => setRemoverDialog({ ...removerDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este produto do carrinho?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRemoverDialog({ open: false, index: -1 })}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={removerDoCarrinho}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};
