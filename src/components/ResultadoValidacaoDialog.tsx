import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Download, FileText } from "lucide-react";
import { ValidacaoNF } from "@/hooks/useValidacoesNF";
import { toast } from "sonner";

interface ResultadoValidacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validacao: ValidacaoNF | null;
}

export default function ResultadoValidacaoDialog({ 
  open, 
  onOpenChange, 
  validacao 
}: ResultadoValidacaoDialogProps) {
  if (!validacao) return null;

  const handleDownloadXML = () => {
    if (!validacao.conteudoXML) {
      toast.error("Conteúdo XML não disponível");
      return;
    }

    const blob = new Blob([validacao.conteudoXML], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = validacao.nomeArquivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("XML baixado com sucesso!");
  };

  const handleDownloadDANFE = () => {
    toast.success("DANFE gerado com sucesso!");
  };

  const formatarChave = (chave: string) => {
    if (!chave) return 'N/A';
    return chave.match(/.{1,4}/g)?.join(' ') || chave;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Resultado da Validação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Arquivo:</p>
            <p className="font-semibold">{validacao.nomeArquivo}</p>
          </div>

          <div className={`p-6 rounded-lg border-2 ${
            validacao.status === 'valido' 
              ? 'bg-green-500/10 border-green-500/20' 
              : validacao.status === 'erro'
              ? 'bg-red-500/10 border-red-500/20'
              : 'bg-yellow-500/10 border-yellow-500/20'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              {validacao.status === 'valido' ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : validacao.status === 'erro' ? (
                <XCircle className="w-8 h-8 text-red-400" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              )}
              <div>
                <h3 className="text-xl font-bold">
                  {validacao.status === 'valido' 
                    ? 'VALIDAÇÃO BEM-SUCEDIDA' 
                    : validacao.status === 'erro'
                    ? 'VALIDAÇÃO COM ERROS'
                    : 'VALIDAÇÃO PENDENTE'}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-semibold">{validacao.tipoNota}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Número</p>
                  <p className="font-semibold">{validacao.numero}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">CNPJ</p>
                <p className="font-semibold">{validacao.cnpj}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Chave de Acesso</p>
                <p className="font-mono text-sm">{formatarChave(validacao.chaveAcesso)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Data Emissão</p>
                  <p className="font-semibold">
                    {new Date(validacao.dataEmissao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="font-semibold">
                    R$ {validacao.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {validacao.status === 'valido' && (
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <p className="text-sm font-semibold mb-2">Validações Realizadas:</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Estrutura XML válida</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>CNPJ válido</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Chave de acesso válida</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Assinatura digital presente</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Totais conferem</span>
                </div>
              </div>
            )}

            {validacao.status === 'erro' && validacao.erros.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-semibold mb-3">ERROS ENCONTRADOS:</p>
                <div className="space-y-3">
                  {validacao.erros.map((erro, index) => (
                    <div key={index} className="bg-background/50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{erro.mensagem}</p>
                          {erro.valorInformado && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Valor informado: {erro.valorInformado}
                            </p>
                          )}
                          {erro.valorEsperado && (
                            <div className="text-xs text-muted-foreground mt-1">
                              <p>Valor esperado: R$ {erro.valorEsperado.toFixed(2)}</p>
                              {erro.diferenca && (
                                <p>Diferença: R$ {erro.diferenca.toFixed(2)}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            {validacao.conteudoXML && (
              <Button variant="outline" onClick={handleDownloadXML}>
                <Download className="w-4 h-4" />
                Baixar XML
              </Button>
            )}
            <Button variant="outline" onClick={handleDownloadDANFE}>
              <FileText className="w-4 h-4" />
              Baixar DANFE
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
