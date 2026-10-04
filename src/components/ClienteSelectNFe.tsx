import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Plus, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ClienteFornecedorModal } from "@/components/cadastros/ClienteFornecedorModal";
import { ClienteFornecedorInput } from "@/hooks/useClientesFornecedores";

interface Cliente {
  id: string;
  tipo: string;
  tipo_pessoa: string | null;
  cpf_cnpj: string;
  nome_razao_social: string;
  nome_fantasia: string | null;
  ie: string | null;
  telefone: string | null;
  email: string | null;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  ativo: boolean | null;
}

interface ClienteSelectNFeProps {
  empresaId: string;
  value: string;
  onSelect: (cliente: Cliente) => void;
}

const formatCpfCnpj = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (numbers.length === 14) {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return value;
};

export const ClienteSelectNFe = ({ empresaId, value, onSelect }: ClienteSelectNFeProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: clientes, isLoading, refetch } = useQuery({
    queryKey: ["clientes-nfe", empresaId],
    queryFn: async () => {
      if (!empresaId) throw new Error("Empresa ID não fornecido");

      const { data, error } = await supabase
        .from("clientes_fornecedores")
        .select("*")
        .eq("empresa_id", empresaId)
        .eq("ativo", true)
        .order("nome_razao_social", { ascending: true });

      if (error) throw error;
      return data as Cliente[];
    },
    enabled: !!empresaId,
  });

  const clientesFiltrados = useMemo(() => {
    if (!clientes) return [];
    if (!searchTerm) return clientes;

    const termLower = searchTerm.toLowerCase();
    const termNumbers = searchTerm.replace(/\D/g, "");

    return clientes.filter((cliente) => {
      const matchNome = cliente.nome_razao_social.toLowerCase().includes(termLower);
      const matchFantasia = cliente.nome_fantasia?.toLowerCase().includes(termLower);
      const matchCpfCnpj = cliente.cpf_cnpj.replace(/\D/g, "").includes(termNumbers);
      return matchNome || matchFantasia || matchCpfCnpj;
    });
  }, [clientes, searchTerm]);

  const selectedCliente = useMemo(() => {
    return clientes?.find((c) => c.id === value);
  }, [clientes, value]);

  const handleSelect = (clienteId: string) => {
    const cliente = clientes?.find((c) => c.id === clienteId);
    if (cliente) {
      // Verificar campos obrigatórios
      const camposFaltando: string[] = [];
      if (!cliente.endereco) camposFaltando.push("Endereço");
      if (!cliente.cidade) camposFaltando.push("Cidade");
      if (!cliente.uf) camposFaltando.push("UF");
      if (!cliente.bairro) camposFaltando.push("Bairro");
      if (cliente.tipo_pessoa === "juridica" && !cliente.ie) {
        camposFaltando.push("Inscrição Estadual");
      }

      if (camposFaltando.length > 0) {
        toast.warning(
          `Atenção: Cliente sem ${camposFaltando.join(", ")} cadastrado(s). Por favor, complete os dados.`,
          { duration: 5000 }
        );
      }

      onSelect(cliente);
      setOpen(false);
    }
  };

  const handleSaveNovoCliente = async (registro: ClienteFornecedorInput) => {
    const { data, error } = await supabase
      .from("clientes_fornecedores")
      .insert({
        ...registro,
        empresa_id: empresaId,
      })
      .select()
      .single();

    if (error) {
      toast.error("Erro ao cadastrar cliente");
      throw error;
    }

    toast.success("Cliente cadastrado com sucesso!");
    
    // Atualizar lista e selecionar o novo cliente
    await refetch();
    if (data) {
      onSelect(data as Cliente);
    }
    
    return data;
  };

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex-1 justify-between font-normal"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando...
              </span>
            ) : selectedCliente ? (
              <span className="flex flex-col items-start text-left">
                <span className="font-medium truncate max-w-[300px]">
                  {selectedCliente.nome_razao_social}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatCpfCnpj(selectedCliente.cpf_cnpj)}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground flex items-center gap-2">
                <Search className="h-4 w-4" />
                Selecione um cliente...
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Buscar por nome, CNPJ ou CPF..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : clientesFiltrados.length === 0 ? (
                <CommandEmpty className="py-6 text-center text-sm">
                  Nenhum cliente encontrado
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {clientesFiltrados.map((cliente) => (
                    <CommandItem
                      key={cliente.id}
                      value={cliente.id}
                      onSelect={() => handleSelect(cliente.id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === cliente.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {cliente.nome_razao_social}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatCpfCnpj(cliente.cpf_cnpj)}
                          {cliente.cidade && cliente.uf && (
                            <span className="ml-2">• {cliente.cidade}/{cliente.uf}</span>
                          )}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={() => setModalOpen(true)}
        title="Cadastrar novo cliente"
      >
        <Plus className="h-4 w-4" />
      </Button>

      <ClienteFornecedorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveNovoCliente}
      />
    </div>
  );
};
