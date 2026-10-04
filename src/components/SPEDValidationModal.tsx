import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface ValidationResult {
  periodo: string;
  valido: boolean;
  verificacoes: Array<{ item: string; status: boolean }>;
  erros: string[];
}

interface SPEDValidationModalProps {
  open: boolean;
  onClose: () => void;
  resultado: ValidationResult | null;
}

const SPEDValidationModal = ({ open, onClose, resultado }: SPEDValidationModalProps) => {
  if (!resultado) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Validação do SPED {resultado.periodo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {resultado.valido ? (
            <>
              <div className="space-y-3">
                {resultado.verificacoes.map((verificacao, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{verificacao.item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  <span>Status: Arquivo válido e pronto para envio</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3">
                {resultado.verificacoes.map((verificacao, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {verificacao.status ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    )}
                    <span className="text-sm">{verificacao.item}</span>
                  </div>
                ))}
              </div>

              {resultado.erros.length > 0 && (
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span className="text-yellow-400 font-semibold">Erros encontrados:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 ml-7">
                    {resultado.erros.map((erro, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{erro}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SPEDValidationModal;
