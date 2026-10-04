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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClienteFornecedor, ClienteFornecedorInput } from "@/hooks/useClientesFornecedores";
import { Loader2 } from "lucide-react";
import { buscarCEP } from "@/lib/viacep";

interface ClienteFornecedorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (registro: ClienteFornecedorInput) => Promise<any>;
  registro?: ClienteFornecedor | null;
}

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO"
];

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatCNPJ = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 14);
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

const formatTelefone = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const formatCEP = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 8);
  return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
};

export const ClienteFornecedorModal = ({ open, onClose, onSave, registro }: ClienteFornecedorModalProps) => {
  const [loading, setLoading] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [isCliente, setIsCliente] = useState(true);
  const [isFornecedor, setIsFornecedor] = useState(false);
  
  const [form, setForm] = useState<ClienteFornecedorInput>({
    tipo: "cliente",
    tipo_pessoa: "juridica",
    cpf_cnpj: "",
    nome_razao_social: "",
    nome_fantasia: null,
    ie: null,
    telefone: null,
    email: null,
    cep: null,
    endereco: null,
    numero: null,
    complemento: null,
    bairro: null,
    cidade: null,
    uf: null,
    ativo: true,
  });

  useEffect(() => {
    if (registro) {
      setForm({
        tipo: registro.tipo,
        tipo_pessoa: registro.tipo_pessoa,
        cpf_cnpj: registro.cpf_cnpj,
        nome_razao_social: registro.nome_razao_social,
        nome_fantasia: registro.nome_fantasia,
        ie: registro.ie,
        telefone: registro.telefone,
        email: registro.email,
        cep: registro.cep,
        endereco: registro.endereco,
        numero: registro.numero,
        complemento: registro.complemento,
        bairro: registro.bairro,
        cidade: registro.cidade,
        uf: registro.uf,
        ativo: registro.ativo,
      });
      setIsCliente(registro.tipo === "cliente" || registro.tipo === "ambos");
      setIsFornecedor(registro.tipo === "fornecedor" || registro.tipo === "ambos");
    } else {
      setForm({
        tipo: "cliente",
        tipo_pessoa: "juridica",
        cpf_cnpj: "",
        nome_razao_social: "",
        nome_fantasia: null,
        ie: null,
        telefone: null,
        email: null,
        cep: null,
        endereco: null,
        numero: null,
        complemento: null,
        bairro: null,
        cidade: null,
        uf: null,
        ativo: true,
      });
      setIsCliente(true);
      setIsFornecedor(false);
    }
  }, [registro, open]);

  useEffect(() => {
    let tipo: "cliente" | "fornecedor" | "ambos" = "cliente";
    if (isCliente && isFornecedor) {
      tipo = "ambos";
    } else if (isFornecedor) {
      tipo = "fornecedor";
    }
    setForm((prev) => ({ ...prev, tipo }));
  }, [isCliente, isFornecedor]);

  const handleCepBlur = async () => {
    const cepLimpo = form.cep?.replace(/\D/g, "") || "";
    if (cepLimpo.length === 8) {
      setBuscandoCep(true);
      try {
        const endereco = await buscarCEP(cepLimpo);
        if (endereco) {
          setForm((prev) => ({
            ...prev,
            endereco: endereco.logradouro || prev.endereco,
            bairro: endereco.bairro || prev.bairro,
            cidade: endereco.localidade || prev.cidade,
            uf: endereco.uf || prev.uf,
          }));
        }
      } finally {
        setBuscandoCep(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCliente && !isFornecedor) {
      return;
    }
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {registro ? "Editar Cadastro" : "Novo Cadastro"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div className="space-y-2">
            <Label>Tipo *</Label>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isCliente"
                  checked={isCliente}
                  onCheckedChange={(checked) => setIsCliente(!!checked)}
                />
                <Label htmlFor="isCliente" className="font-normal">Cliente</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isFornecedor"
                  checked={isFornecedor}
                  onCheckedChange={(checked) => setIsFornecedor(!!checked)}
                />
                <Label htmlFor="isFornecedor" className="font-normal">Fornecedor</Label>
              </div>
            </div>
          </div>

          {/* Tipo de Pessoa */}
          <div className="space-y-2">
            <Label>Pessoa *</Label>
            <RadioGroup
              value={form.tipo_pessoa}
              onValueChange={(value: "fisica" | "juridica") => setForm({ ...form, tipo_pessoa: value, cpf_cnpj: "" })}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="fisica" id="fisica" />
                <Label htmlFor="fisica" className="font-normal">Pessoa Física</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="juridica" id="juridica" />
                <Label htmlFor="juridica" className="font-normal">Pessoa Jurídica</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf_cnpj">{form.tipo_pessoa === "fisica" ? "CPF" : "CNPJ"} *</Label>
              <Input
                id="cpf_cnpj"
                value={form.cpf_cnpj}
                onChange={(e) => setForm({
                  ...form,
                  cpf_cnpj: form.tipo_pessoa === "fisica" ? formatCPF(e.target.value) : formatCNPJ(e.target.value)
                })}
                placeholder={form.tipo_pessoa === "fisica" ? "000.000.000-00" : "00.000.000/0000-00"}
                required
              />
            </div>

            {form.tipo_pessoa === "juridica" && (
              <div className="space-y-2">
                <Label htmlFor="ie">Inscrição Estadual</Label>
                <Input
                  id="ie"
                  value={form.ie || ""}
                  onChange={(e) => setForm({ ...form, ie: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_razao_social">
                {form.tipo_pessoa === "fisica" ? "Nome Completo" : "Razão Social"} *
              </Label>
              <Input
                id="nome_razao_social"
                value={form.nome_razao_social}
                onChange={(e) => setForm({ ...form, nome_razao_social: e.target.value })}
                required
              />
            </div>

            {form.tipo_pessoa === "juridica" && (
              <div className="space-y-2">
                <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                <Input
                  id="nome_fantasia"
                  value={form.nome_fantasia || ""}
                  onChange={(e) => setForm({ ...form, nome_fantasia: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={form.telefone || ""}
                onChange={(e) => setForm({ ...form, telefone: formatTelefone(e.target.value) })}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={form.cep || ""}
                onChange={(e) => setForm({ ...form, cep: formatCEP(e.target.value) })}
                onBlur={handleCepBlur}
                placeholder="00000-000"
              />
              {buscandoCep && <p className="text-xs text-muted-foreground">Buscando...</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={form.endereco || ""}
                onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                value={form.numero || ""}
                onChange={(e) => setForm({ ...form, numero: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={form.complemento || ""}
                onChange={(e) => setForm({ ...form, complemento: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                value={form.bairro || ""}
                onChange={(e) => setForm({ ...form, bairro: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={form.cidade || ""}
                onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uf">UF</Label>
              <Select
                value={form.uf || ""}
                onValueChange={(value) => setForm({ ...form, uf: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {UFS.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="ativo"
              checked={form.ativo}
              onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
            />
            <Label htmlFor="ativo">Cadastro Ativo</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || (!isCliente && !isFornecedor)}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {registro ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
