import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ProdutoNFCe } from "@/hooks/useProdutosNFCe";

interface CadastrarProdutoDialogProps {
  onSalvar: (produto: Omit<ProdutoNFCe, 'id' | 'dataCadastro'>) => ProdutoNFCe;
  onAdicionarAoCarrinho?: (produto: ProdutoNFCe) => void;
}

export const CadastrarProdutoDialog = ({ onSalvar, onAdicionarAoCarrinho }: CadastrarProdutoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adicionarAoCarrinho, setAdicionarAoCarrinho] = useState(false);

  const [formData, setFormData] = useState({
    codigoBarras: "",
    codigoInterno: "",
    descricao: "",
    categoria: "Outros",
    unidade: "UN",
    valorVenda: "",
    valorCusto: "",
    estoqueAtual: "0",
    estoqueMinimo: "0",
    ncm: "",
    cest: "",
    icmsCst: "00",
    icmsAliquota: "18",
    pisCst: "01",
    pisAliquota: "1.65",
    cofinsCst: "01",
    cofinsAliquota: "7.6",
    observacoes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatNCM = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
  };

  const formatCEST = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 7);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  };

  const validarFormulario = () => {
    if (formData.descricao.length < 3) {
      toast.error("Descrição deve ter no mínimo 3 caracteres");
      return false;
    }
    if (!formData.valorVenda || Number(formData.valorVenda) <= 0) {
      toast.error("Valor de venda deve ser maior que zero");
      return false;
    }
    if (!formData.ncm || formData.ncm.replace(/\D/g, '').length !== 8) {
      toast.error("NCM deve ter 8 dígitos");
      return false;
    }
    return true;
  };

  const handleSalvar = () => {
    if (!validarFormulario()) return;

    setLoading(true);
    
    try {
      const novoProduto = onSalvar({
        codigoBarras: formData.codigoBarras,
        codigoInterno: formData.codigoInterno,
        descricao: formData.descricao,
        categoria: formData.categoria,
        unidade: formData.unidade,
        valorVenda: Number(formData.valorVenda),
        valorCusto: Number(formData.valorCusto) || 0,
        estoqueAtual: Number(formData.estoqueAtual),
        estoqueMinimo: Number(formData.estoqueMinimo),
        ncm: formData.ncm.replace(/\D/g, ''),
        cest: formData.cest.replace(/\D/g, ''),
        icms: {
          cst: formData.icmsCst,
          aliquota: Number(formData.icmsAliquota),
        },
        pis: {
          cst: formData.pisCst,
          aliquota: Number(formData.pisAliquota),
        },
        cofins: {
          cst: formData.cofinsCst,
          aliquota: Number(formData.cofinsAliquota),
        },
        observacoes: formData.observacoes,
      });

      toast.success("Produto cadastrado com sucesso!");
      
      if (adicionarAoCarrinho && onAdicionarAoCarrinho) {
        onAdicionarAoCarrinho(novoProduto);
        toast.success("Produto adicionado ao carrinho");
      }

      setOpen(false);
      setFormData({
        codigoBarras: "",
        codigoInterno: "",
        descricao: "",
        categoria: "Outros",
        unidade: "UN",
        valorVenda: "",
        valorCusto: "",
        estoqueAtual: "0",
        estoqueMinimo: "0",
        ncm: "",
        cest: "",
        icmsCst: "00",
        icmsAliquota: "18",
        pisCst: "01",
        pisAliquota: "1.65",
        cofinsCst: "01",
        cofinsAliquota: "7.6",
        observacoes: "",
      });
      setAdicionarAoCarrinho(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Produto</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">INFORMAÇÕES BÁSICAS</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código de Barras (EAN)</Label>
                <Input
                  value={formData.codigoBarras}
                  onChange={(e) => handleInputChange('codigoBarras', e.target.value)}
                  placeholder="7891234567890"
                />
              </div>
              <div className="space-y-2">
                <Label>Código Interno</Label>
                <Input
                  value={formData.codigoInterno}
                  onChange={(e) => handleInputChange('codigoInterno', e.target.value)}
                  placeholder="001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Input
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                placeholder="Nome completo do produto"
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={formData.categoria} onValueChange={(v) => handleInputChange('categoria', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alimentos">Alimentos</SelectItem>
                  <SelectItem value="Bebidas">Bebidas</SelectItem>
                  <SelectItem value="Limpeza">Limpeza</SelectItem>
                  <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Valores e Estoque */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">VALORES E ESTOQUE</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Unidade</Label>
                <Select value={formData.unidade} onValueChange={(v) => handleInputChange('unidade', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UN">UN - Unidade</SelectItem>
                    <SelectItem value="KG">KG - Quilograma</SelectItem>
                    <SelectItem value="LT">LT - Litro</SelectItem>
                    <SelectItem value="MT">MT - Metro</SelectItem>
                    <SelectItem value="CX">CX - Caixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor de Venda *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valorVenda}
                  onChange={(e) => handleInputChange('valorVenda', e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div className="space-y-2">
                <Label>Valor de Custo</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valorCusto}
                  onChange={(e) => handleInputChange('valorCusto', e.target.value)}
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estoque Inicial</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.estoqueAtual}
                  onChange={(e) => handleInputChange('estoqueAtual', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Estoque Mínimo</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.estoqueMinimo}
                  onChange={(e) => handleInputChange('estoqueMinimo', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tributação */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">TRIBUTAÇÃO (Obrigatório para NFC-e)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>NCM *</Label>
                <Input
                  value={formData.ncm}
                  onChange={(e) => handleInputChange('ncm', formatNCM(e.target.value))}
                  placeholder="00.00.00"
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label>CEST (opcional)</Label>
                <Input
                  value={formData.cest}
                  onChange={(e) => handleInputChange('cest', formatCEST(e.target.value))}
                  placeholder="00.000.00"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CST ICMS</Label>
                <Select value={formData.icmsCst} onValueChange={(v) => handleInputChange('icmsCst', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="00">00 - Tributada integral</SelectItem>
                    <SelectItem value="20">20 - Com redução de BC</SelectItem>
                    <SelectItem value="40">40 - Isenta</SelectItem>
                    <SelectItem value="41">41 - Não tributada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Alíquota ICMS (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.icmsAliquota}
                  onChange={(e) => handleInputChange('icmsAliquota', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>CST PIS/COFINS</Label>
              <Select value={formData.pisCst} onValueChange={(v) => {
                handleInputChange('pisCst', v);
                handleInputChange('cofinsCst', v);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01">01 - Operação tributável</SelectItem>
                  <SelectItem value="04">04 - Operação tributável com ST</SelectItem>
                  <SelectItem value="06">06 - Operação tributável com alíquota zero</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Alíquota PIS (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.pisAliquota}
                  onChange={(e) => handleInputChange('pisAliquota', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Alíquota COFINS (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.cofinsAliquota}
                  onChange={(e) => handleInputChange('cofinsAliquota', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">OBSERVAÇÕES</h3>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Informações adicionais sobre o produto..."
              rows={3}
            />
          </div>

          {/* Checkbox Adicionar ao Carrinho */}
          {onAdicionarAoCarrinho && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="adicionar-carrinho"
                checked={adicionarAoCarrinho}
                onCheckedChange={(checked) => setAdicionarAoCarrinho(checked as boolean)}
              />
              <Label htmlFor="adicionar-carrinho" className="cursor-pointer">
                Adicionar ao carrinho após salvar
              </Label>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} disabled={loading}>
            {loading ? "Salvando..." : "💾 Salvar Produto"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
