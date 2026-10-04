import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Mail } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { downloadXMLNFe, gerarPDFNFe } from "@/lib/nfeUtils";
import { EnviarEmailNFeDialog } from "@/components/EnviarEmailNFeDialog";
import type { DadosFiscaisNFe, EmpresaNFe, ItemNFe, NotaFiscal } from "@/types/nfe";

interface VisualizarNFeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nota: NotaFiscal | null;
  empresa?: EmpresaNFe | null;
}

export const VisualizarNFeDialog = ({ open, onOpenChange, nota, empresa }: VisualizarNFeDialogProps) => {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  if (!nota) return null;

  const dadosFiscais = (nota.dados_fiscais ?? {}) as DadosFiscaisNFe;
  const destinatario = dadosFiscais.destinatario || {};
  const itens = dadosFiscais.itens || [];
  const transporte = dadosFiscais.transporte || {};
  const cobranca = dadosFiscais.cobranca || {};
  const totais = dadosFiscais.totais || {};

  const downloadXML = () => {
    if (!empresa) {
      toast.error("Dados da empresa não disponíveis");
      return;
    }
    try {
      downloadXMLNFe(nota, empresa);
      toast.success("Download do XML concluído");
    } catch (error) {
      toast.error("Erro ao gerar XML");
    }
  };

  const downloadPDF = () => {
    if (!empresa) {
      toast.error("Dados da empresa não disponíveis");
      return;
    }
    try {
      gerarPDFNFe(nota, empresa);
      toast.success("Download do PDF concluído");
    } catch (error) {
      toast.error("Erro ao gerar PDF");
    }
  };

  const enviarEmail = () => {
    setEmailDialogOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>NF-e Nº {String(nota.numero).padStart(8, "0")} - Série {nota.serie}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadXML}>
                <Download className="w-4 h-4 mr-2" />
                XML
              </Button>
              <Button variant="outline" size="sm" onClick={downloadPDF}>
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={enviarEmail}>
                <Mail className="w-4 h-4 mr-2" />
                E-mail
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="transporte">Transporte</TabsTrigger>
            <TabsTrigger value="totais">Totais</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Identificação</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Número:</span>
                  <p className="font-semibold">{String(nota.numero).padStart(8, "0")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Série:</span>
                  <p className="font-semibold">{nota.serie}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Data Emissão:</span>
                  <p className="font-semibold">{format(new Date(nota.data_emissao), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-semibold">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        nota.status === "Autorizada"
                          ? "bg-green-500/10 text-green-400"
                          : nota.status === "Cancelada"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {nota.status}
                    </span>
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Natureza da Operação:</span>
                  <p className="font-semibold">{nota.natureza_operacao}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Destinatário</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2">
                  <span className="text-muted-foreground">CNPJ/CPF:</span>
                  <p className="font-semibold">{destinatario.cnpj_cpf || "Não informado"}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Razão Social:</span>
                  <p className="font-semibold">{destinatario.razao_social || nota.clientes_fornecedores?.nome_razao_social || "Não informado"}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Endereço:</span>
                  <p className="font-semibold">
                    {destinatario.endereco ? `${destinatario.endereco}, ${destinatario.numero || "S/N"} - ${destinatario.bairro || ""}, ${destinatario.cidade || ""}-${destinatario.uf || ""}` : "Não informado"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">CEP:</span>
                  <p className="font-semibold">{destinatario.cep || "Não informado"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">IE:</span>
                  <p className="font-semibold">{destinatario.ie || "Não informado"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Telefone:</span>
                  <p className="font-semibold">{destinatario.telefone || "Não informado"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">E-mail:</span>
                  <p className="font-semibold">{destinatario.email || "Não informado"}</p>
                </div>
              </div>
            </Card>

            {dadosFiscais.informacoes_complementares && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Informações Complementares</h3>
                <p className="text-sm">{dadosFiscais.informacoes_complementares}</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="produtos" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2">Item</th>
                    <th className="text-left py-2 px-2">Código</th>
                    <th className="text-left py-2 px-2">Descrição</th>
                    <th className="text-right py-2 px-2">Qtd</th>
                    <th className="text-right py-2 px-2">Vlr. Unit.</th>
                    <th className="text-right py-2 px-2">Total</th>
                    <th className="text-right py-2 px-2">ICMS</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item: ItemNFe, index: number) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-2 px-2">{index + 1}</td>
                      <td className="py-2 px-2 font-mono">{item.codigo}</td>
                      <td className="py-2 px-2">{item.descricao}</td>
                      <td className="py-2 px-2 text-right">{item.quantidade}</td>
                      <td className="py-2 px-2 text-right">
                        R$ {Number(item.valor_unitario).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-2 text-right font-semibold">
                        R$ {Number(item.valor_total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-2 text-right">
                        R$ {Number(item.icms_valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {itens.length === 0 && (
              <Card className="p-8 text-center text-muted-foreground">
                Nenhum item cadastrado
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transporte" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Modalidade de Frete</h3>
              <p className="text-sm">
                {transporte.modalidade_frete === "0" ? "Por conta do emitente" :
                 transporte.modalidade_frete === "1" ? "Por conta do destinatário" :
                 transporte.modalidade_frete === "9" ? "Sem frete" : "Não informado"}
              </p>
            </Card>

            {transporte.transportadora?.cnpj && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Transportadora</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">CNPJ:</span>
                    <p className="font-semibold">{transporte.transportadora.cnpj}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Razão Social:</span>
                    <p className="font-semibold">{transporte.transportadora.razao_social}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">IE:</span>
                    <p className="font-semibold">{transporte.transportadora.ie || "Não informado"}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Endereço:</span>
                    <p className="font-semibold">{transporte.transportadora.endereco || "Não informado"}</p>
                  </div>
                </div>
              </Card>
            )}

            {transporte.volumes?.quantidade > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Volumes</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Quantidade:</span>
                    <p className="font-semibold">{transporte.volumes.quantidade}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Espécie:</span>
                    <p className="font-semibold">{transporte.volumes.especie || "Não informado"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Peso Bruto:</span>
                    <p className="font-semibold">{transporte.volumes.peso_bruto} kg</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Peso Líquido:</span>
                    <p className="font-semibold">{transporte.volumes.peso_liquido} kg</p>
                  </div>
                </div>
              </Card>
            )}

            {!transporte.transportadora?.cnpj && !transporte.volumes?.quantidade && (
              <Card className="p-8 text-center text-muted-foreground">
                Nenhuma informação de transporte cadastrada
              </Card>
            )}
          </TabsContent>

          <TabsContent value="totais" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Valores</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Produtos:</span>
                  <span className="font-semibold">R$ {Number(totais.totalProdutos || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base de Cálculo ICMS:</span>
                  <span>R$ {Number(totais.baseIcms || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor ICMS:</span>
                  <span>R$ {Number(totais.valorIcms || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor IPI:</span>
                  <span>R$ {Number(totais.valorIpi || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor PIS:</span>
                  <span>R$ {Number(totais.valorPis || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor COFINS:</span>
                  <span>R$ {Number(totais.valorCofins || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>TOTAL DA NF-e:</span>
                  <span className="text-primary">R$ {Number(nota.valor_total || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Pagamento</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Forma:</span>
                  <p className="font-semibold">{cobranca.forma_pagamento === "avista" ? "À Vista" : "A Prazo"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Meio:</span>
                  <p className="font-semibold">
                    {cobranca.meio_pagamento === "01" ? "Dinheiro" :
                     cobranca.meio_pagamento === "02" ? "Cheque" :
                     cobranca.meio_pagamento === "03" ? "Cartão de Crédito" :
                     cobranca.meio_pagamento === "04" ? "Cartão de Débito" :
                     cobranca.meio_pagamento === "05" ? "Crédito Loja" :
                     cobranca.meio_pagamento === "10" ? "Vale Alimentação" :
                     cobranca.meio_pagamento === "11" ? "Vale Refeição" :
                     cobranca.meio_pagamento === "12" ? "Vale Presente" :
                     cobranca.meio_pagamento === "13" ? "Vale Combustível" :
                     cobranca.meio_pagamento === "15" ? "Boleto Bancário" :
                     cobranca.meio_pagamento === "17" ? "PIX" :
                     cobranca.meio_pagamento === "99" ? "Outros" : "Não informado"}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>

      <EnviarEmailNFeDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        nota={nota}
        emailPadrao={
          destinatario.email ||
          nota.clientes_fornecedores?.email ||
          ""
        }
      />
    </Dialog>
  );
};
