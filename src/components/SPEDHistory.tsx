import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download, CheckCircle } from "lucide-react";
import { ArquivoSPED } from "@/hooks/useSPEDFiscal";

interface SPEDHistoryProps {
  historico: ArquivoSPED[];
  onDownload: (arquivo: ArquivoSPED) => void;
  onValidar: (arquivo: ArquivoSPED) => void;
}

const SPEDHistory = ({ historico, onDownload, onValidar }: SPEDHistoryProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">Histórico de Arquivos</h3>
      
      <div className="space-y-3">
        {historico.map((arquivo) => (
          <div 
            key={arquivo.id} 
            className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">SPED {arquivo.periodo}</div>
                <div className="text-sm text-muted-foreground">
                  Perfil {arquivo.perfil} • {arquivo.dataGeracao} • {arquivo.tamanho} MB
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDownload(arquivo)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onValidar(arquivo)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Validar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SPEDHistory;
