import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface XMLFiltersProps {
  busca: string;
  onBuscaChange: (value: string) => void;
  tipoFiltro: string;
  onTipoChange: (value: string) => void;
  periodoFiltro: string;
  onPeriodoChange: (value: string) => void;
}

const XMLFilters = ({
  busca,
  onBuscaChange,
  tipoFiltro,
  onTipoChange,
  periodoFiltro,
  onPeriodoChange,
}: XMLFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Label htmlFor="search">Buscar XML</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Nome do arquivo, chave..."
            className="pl-10"
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full md:w-48">
        <Label htmlFor="tipo">Tipo</Label>
        <Select value={tipoFiltro} onValueChange={onTipoChange}>
          <SelectTrigger id="tipo">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="NF-e">NF-e</SelectItem>
            <SelectItem value="NFS-e">NFS-e</SelectItem>
            <SelectItem value="NFC-e">NFC-e</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-48">
        <Label htmlFor="periodo">Período</Label>
        <Select value={periodoFiltro} onValueChange={onPeriodoChange}>
          <SelectTrigger id="periodo">
            <SelectValue placeholder="Último mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ultimo-mes">Último mês</SelectItem>
            <SelectItem value="3-meses">Últimos 3 meses</SelectItem>
            <SelectItem value="6-meses">Últimos 6 meses</SelectItem>
            <SelectItem value="ultimo-ano">Último ano</SelectItem>
            <SelectItem value="todos">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default XMLFilters;
