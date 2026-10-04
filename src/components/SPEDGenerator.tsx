import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, Loader2 } from "lucide-react";

const perfis = ["Perfil A", "Perfil B", "Perfil C"];

const periodos = [
  "Outubro/2025", "Setembro/2025", "Agosto/2025", 
  "Julho/2025", "Junho/2025", "Maio/2025",
  "Abril/2025", "Março/2025", "Fevereiro/2025",
  "Janeiro/2025", "Dezembro/2024", "Novembro/2024"
];

interface SPEDGeneratorProps {
  onGerar: (periodo: string, perfil: string) => Promise<boolean>;
  loading: boolean;
}

const SPEDGenerator = ({ onGerar, loading }: SPEDGeneratorProps) => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("");
  const [perfilSelecionado, setPerfilSelecionado] = useState("");

  const handleGerar = async () => {
    if (!periodoSelecionado || !perfilSelecionado) {
      return;
    }

    const perfil = perfilSelecionado.split(' ')[1]; // Extrair apenas a letra (A, B, C)
    await onGerar(periodoSelecionado, perfil);
    
    // Limpar seleções após gerar
    setPeriodoSelecionado("");
    setPerfilSelecionado("");
  };

  return (
    <Card className="p-8">
      <h3 className="text-xl font-bold mb-6">Gerar Novo SPED Fiscal</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="periodo">Período de Apuração</Label>
          <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
            <SelectTrigger id="periodo" className="w-full">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              {periodos.map((periodo) => (
                <SelectItem key={periodo} value={periodo}>
                  {periodo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="perfil">Perfil de Apresentação</Label>
          <Select value={perfilSelecionado} onValueChange={setPerfilSelecionado}>
            <SelectTrigger id="perfil" className="w-full">
              <SelectValue placeholder="Selecione o perfil" />
            </SelectTrigger>
            <SelectContent>
              {perfis.map((perfil) => (
                <SelectItem key={perfil} value={perfil}>
                  {perfil}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        size="lg" 
        onClick={handleGerar}
        disabled={!periodoSelecionado || !perfilSelecionado || loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Gerando SPED...
          </>
        ) : (
          <>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Gerar SPED Fiscal
          </>
        )}
      </Button>
    </Card>
  );
};

export default SPEDGenerator;
