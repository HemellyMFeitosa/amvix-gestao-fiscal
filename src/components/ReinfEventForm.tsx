import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2 } from "lucide-react";
import { tiposEventos, competencias } from "@/hooks/useEFDReinf";

interface ReinfEventFormProps {
  onEnviar: (tipo: string, competencia: string) => Promise<boolean>;
  loading: boolean;
}

const ReinfEventForm = ({ onEnviar, loading }: ReinfEventFormProps) => {
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [competenciaSelecionada, setCompetenciaSelecionada] = useState("");

  const handleEnviar = async () => {
    if (!tipoSelecionado || !competenciaSelecionada) {
      return;
    }

    const sucesso = await onEnviar(tipoSelecionado, competenciaSelecionada);
    
    if (sucesso) {
      setTipoSelecionado("");
      setCompetenciaSelecionada("");
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">Novo Evento</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="tipo">Tipo de Evento</Label>
          <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
            <SelectTrigger id="tipo" className="w-full">
              <SelectValue placeholder="Selecione o tipo de evento" />
            </SelectTrigger>
            <SelectContent>
              {tiposEventos.map((evento) => (
                <SelectItem key={evento.codigo} value={evento.codigo}>
                  {evento.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="competencia">Competência</Label>
          <Select value={competenciaSelecionada} onValueChange={setCompetenciaSelecionada}>
            <SelectTrigger id="competencia" className="w-full">
              <SelectValue placeholder="Selecione a competência" />
            </SelectTrigger>
            <SelectContent>
              {competencias.map((comp) => (
                <SelectItem key={comp} value={comp}>
                  {comp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full"
          onClick={handleEnviar}
          disabled={!tipoSelecionado || !competenciaSelecionada || loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar Evento
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default ReinfEventForm;
