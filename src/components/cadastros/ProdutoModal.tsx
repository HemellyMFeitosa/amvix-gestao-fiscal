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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Produto, ProdutoInput } from "@/hooks/useProdutos";
import { Loader2 } from "lucide-react";

interface ProdutoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (produto: ProdutoInput) => Promise<any>;
  produto?: Produto | null;
}

const UNIDADES = ["UN", "CX", "KG", "G", "L", "ML", "M", "M2", "M3", "PC", "PAR", "DZ", "CT", "FD", "KIT"];

export const ProdutoModal = ({ open, onClose, onSave, produto }: ProdutoModalProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProdutoInput>({
    codigo_sku: "",
    descricao: "",
    ncm: "",
    cest: "",
    unidade: "UN",
    preco_custo: 0,
    preco_venda: 0,
    estoque_atual: 0,
    estoque_minimo: 0,
    ativo: true,
  });

  useEffect(() => {
    if (produto) {
      setForm({
        codigo_sku: produto.codigo_sku,
        descricao: produto.descricao,
        ncm: produto.ncm || "",
        cest: produto.cest || "",
        unidade: produto.unidade,
        preco_custo: produto.preco_custo,
        preco_venda: produto.preco_venda,
        estoque_atual: produto.estoque_atual,
        estoque_minimo: produto.estoque_minimo,
        ativo: produto.ativo,
      });
    } else {
      setForm({
        codigo_sku: "",
        descricao: "",
        ncm: "",
        cest: "",
        unidade: "UN",
        preco_custo: 0,
        preco_venda: 0,
        estoque_atual: 0,
        estoque_minimo: 0,
        ativo: true,
      });
    }
  }, [produto, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const formatNCM = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 8);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {produto ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo_sku">Código/SKU *</Label>
              <Input
                id="codigo_sku"
                value={form.codigo_sku}
                onChange={(e) => setForm({ ...form, codigo_sku: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade *</Label>
              <Select
                value={form.unidade}
                onValueChange={(value) => setForm({ ...form, unidade: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIDADES.map((un) => (
                    <SelectItem key={un} value={un}>
                      {un}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Input
              id="descricao"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ncm">NCM</Label>
              <Input
                id="ncm"
                value={form.ncm || ""}
                onChange={(e) => setForm({ ...form, ncm: formatNCM(e.target.value) })}
                placeholder="00000000"
                maxLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cest">CEST</Label>
              <Input
                id="cest"
                value={form.cest || ""}
                onChange={(e) => setForm({ ...form, cest: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco_custo">Preço de Custo</Label>
              <Input
                id="preco_custo"
                type="number"
                step="0.01"
                min="0"
                value={form.preco_custo}
                onChange={(e) => setForm({ ...form, preco_custo: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco_venda">Preço de Venda *</Label>
              <Input
                id="preco_venda"
                type="number"
                step="0.01"
                min="0"
                value={form.preco_venda}
                onChange={(e) => setForm({ ...form, preco_venda: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estoque_atual">Estoque Atual</Label>
              <Input
                id="estoque_atual"
                type="number"
                step="0.01"
                min="0"
                value={form.estoque_atual}
                onChange={(e) => setForm({ ...form, estoque_atual: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
              <Input
                id="estoque_minimo"
                type="number"
                step="0.01"
                min="0"
                value={form.estoque_minimo}
                onChange={(e) => setForm({ ...form, estoque_minimo: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="ativo"
              checked={form.ativo}
              onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
            />
            <Label htmlFor="ativo">Produto Ativo</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {produto ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
