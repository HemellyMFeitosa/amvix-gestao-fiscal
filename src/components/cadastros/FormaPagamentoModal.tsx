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
import { FormaPagamento, FormaPagamentoInput, CODIGOS_PAGAMENTO } from "@/hooks/useFormasPagamento";
import { Loader2 } from "lucide-react";

interface FormaPagamentoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (forma: FormaPagamentoInput) => Promise<any>;
  forma?: FormaPagamento | null;
}

export const FormaPagamentoModal = ({ open, onClose, onSave, forma }: FormaPagamentoModalProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormaPagamentoInput>({
    codigo: "",
    descricao: "",
    aceita_parcelamento: false,
    max_parcelas: 1,
    taxa_desconto: 0,
    ativo: true,
  });

  useEffect(() => {
    if (forma) {
      setForm({
        codigo: forma.codigo,
        descricao: forma.descricao,
        aceita_parcelamento: forma.aceita_parcelamento,
        max_parcelas: forma.max_parcelas,
        taxa_desconto: forma.taxa_desconto,
        ativo: forma.ativo,
      });
    } else {
      setForm({
        codigo: "",
        descricao: "",
        aceita_parcelamento: false,
        max_parcelas: 1,
        taxa_desconto: 0,
        ativo: true,
      });
    }
  }, [forma, open]);

  const handleCodigoChange = (codigo: string) => {
    const descricaoPadrao = CODIGOS_PAGAMENTO.find((c) => c.codigo === codigo)?.descricao || "";
    setForm({ ...form, codigo, descricao: descricaoPadrao });
  };

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {forma ? "Editar Forma de Pagamento" : "Nova Forma de Pagamento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codigo">Código *</Label>
            <Select
              value={form.codigo}
              onValueChange={handleCodigoChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o código" />
              </SelectTrigger>
              <SelectContent>
                {CODIGOS_PAGAMENTO.map((c) => (
                  <SelectItem key={c.codigo} value={c.codigo}>
                    {c.codigo} - {c.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div className="flex items-center gap-2">
            <Switch
              id="aceita_parcelamento"
              checked={form.aceita_parcelamento}
              onCheckedChange={(checked) => setForm({
                ...form,
                aceita_parcelamento: checked,
                max_parcelas: checked ? form.max_parcelas : 1
              })}
            />
            <Label htmlFor="aceita_parcelamento">Aceita Parcelamento</Label>
          </div>

          {form.aceita_parcelamento && (
            <div className="space-y-2">
              <Label htmlFor="max_parcelas">Máximo de Parcelas</Label>
              <Input
                id="max_parcelas"
                type="number"
                min="1"
                max="48"
                value={form.max_parcelas || 1}
                onChange={(e) => setForm({ ...form, max_parcelas: parseInt(e.target.value) || 1 })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="taxa_desconto">Taxa/Desconto (%)</Label>
            <Input
              id="taxa_desconto"
              type="number"
              step="0.01"
              value={form.taxa_desconto || 0}
              onChange={(e) => setForm({ ...form, taxa_desconto: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="ativo"
              checked={form.ativo}
              onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
            />
            <Label htmlFor="ativo">Ativo</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {forma ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
