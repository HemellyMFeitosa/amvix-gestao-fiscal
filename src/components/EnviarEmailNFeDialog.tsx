import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/errorMapper";
import type { NotaFiscal } from "@/types/nfe";

interface EnviarEmailNFeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nota: NotaFiscal | null;
  emailPadrao?: string;
}

export const EnviarEmailNFeDialog = ({
  open,
  onOpenChange,
  nota,
  emailPadrao,
}: EnviarEmailNFeDialogProps) => {
  const [email, setEmail] = useState(emailPadrao || "");
  const [incluirXML, setIncluirXML] = useState(true);
  const [incluirPDF, setIncluirPDF] = useState(true);
  const [mensagem, setMensagem] = useState(
    `Prezado(a),\n\nSegue em anexo a Nota Fiscal Eletrônica nº ${
      nota ? String(nota.numero).padStart(8, "0") : ""
    }.\n\nAtenciosamente,`
  );
  const [enviando, setEnviando] = useState(false);

  const handleEnviar = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Informe um e-mail válido");
      return;
    }

    if (!incluirXML && !incluirPDF) {
      toast.error("Selecione pelo menos um anexo (XML ou PDF)");
      return;
    }

    setEnviando(true);

    try {
      // Simular envio (em produção, chamar edge function)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(`E-mail enviado com sucesso para ${email}`);
      onOpenChange(false);
      
      // Reset form
      setEmail(emailPadrao || "");
      setIncluirXML(true);
      setIncluirPDF(true);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao enviar e-mail"));
    } finally {
      setEnviando(false);
    }
  };

  if (!nota) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Enviar NF-e por E-mail
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-semibold">
              NF-e Nº {String(nota.numero).padStart(8, "0")}
            </p>
            <p className="text-muted-foreground">
              {nota.clientes_fornecedores?.nome_razao_social || "Destinatário"}
            </p>
            <p className="text-muted-foreground">
              Valor: R${" "}
              {Number(nota.valor_total || 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail do destinatário *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Anexos</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="incluirXML"
                  checked={incluirXML}
                  onCheckedChange={(checked) => setIncluirXML(!!checked)}
                />
                <label
                  htmlFor="incluirXML"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Incluir arquivo XML
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="incluirPDF"
                  checked={incluirPDF}
                  onCheckedChange={(checked) => setIncluirPDF(!!checked)}
                />
                <label
                  htmlFor="incluirPDF"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Incluir DANFE (PDF)
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem</Label>
            <Textarea
              id="mensagem"
              placeholder="Mensagem do e-mail..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={enviando}
          >
            Cancelar
          </Button>
          <Button onClick={handleEnviar} disabled={enviando}>
            {enviando ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Enviar E-mail
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
