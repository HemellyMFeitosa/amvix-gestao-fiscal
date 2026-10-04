import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle, XCircle, AlertTriangle, Search } from "lucide-react";
import { useValidacoesNF, validarXML, type ValidacaoNF as ValidacaoNFType } from "@/hooks/useValidacoesNF";
import ResultadoValidacaoDialog from "@/components/ResultadoValidacaoDialog";
import { toast } from "sonner";

const ValidacaoNF = () => {
  const { validacoes, adicionarValidacao, getContadores } = useValidacoesNF();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [selectedValidacao, setSelectedValidacao] = useState<ValidacaoNFType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const contadores = getContadores();

  const processarArquivos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const arquivosXML = Array.from(files).filter(file => {
      if (!file.name.toLowerCase().endsWith('.xml')) {
        toast.error(`${file.name}: Apenas arquivos .xml são aceitos`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: Arquivo muito grande (máx 5MB)`);
        return false;
      }
      return true;
    });

    if (arquivosXML.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    for (let i = 0; i < arquivosXML.length; i++) {
      const arquivo = arquivosXML[i];
      setCurrentFile(arquivo.name);
      setProgress(((i + 1) / arquivosXML.length) * 100);

      try {
        const conteudo = await arquivo.text();
        
        // Simular delay de processamento
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const resultado = validarXML(arquivo, conteudo);
        adicionarValidacao(resultado);
        
        // Mostrar resultado do primeiro arquivo
        if (i === 0) {
          setSelectedValidacao(resultado);
          setDialogOpen(true);
        }

        if (resultado.status === 'valido') {
          toast.success(`${arquivo.name}: Validado com sucesso!`);
        } else {
          toast.error(`${arquivo.name}: Validação com erros`);
        }
      } catch (error) {
        toast.error(`${arquivo.name}: Erro ao processar arquivo`);
      }
    }

    setIsProcessing(false);
    setCurrentFile("");
    setProgress(0);
    
    if (arquivosXML.length > 1) {
      toast.success(`${arquivosXML.length} arquivos processados!`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processarArquivos(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processarArquivos(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleVerDetalhes = (validacao: ValidacaoNFType) => {
    setSelectedValidacao(validacao);
    setDialogOpen(true);
  };

  const validacoesFiltradas = validacoes.filter(v => 
    v.nomeArquivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.chaveAcesso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.numero.includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Validação de NF</h1>
          <p className="text-muted-foreground">Valide notas fiscais e XMLs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Validadas</div>
                <div className="text-2xl font-bold">{contadores.validadas}</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Com Erro</div>
                <div className="text-2xl font-bold">{contadores.comErro}</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Pendentes</div>
                <div className="text-2xl font-bold">{contadores.pendentes}</div>
              </div>
            </div>
          </Card>
        </div>

        <div
          className={`bg-card border-2 border-dashed rounded-xl p-8 mb-6 transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Enviar XML para Validação</h3>
            <p className="text-muted-foreground mb-6">
              Arraste e solte ou clique para selecionar arquivos XML
            </p>
            
            {isProcessing ? (
              <div className="space-y-3">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Validando: {currentFile}
                </p>
              </div>
            ) : (
              <>
                <Button size="lg" onClick={handleClickUpload}>
                  Selecionar Arquivos
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Formatos aceitos: .xml | Tamanho máximo: 5MB
                </p>
              </>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".xml"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Histórico de Validações</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {validacoesFiltradas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Nenhuma validação encontrada' : 'Nenhuma validação realizada ainda'}
            </div>
          ) : (
            <div className="space-y-3">
              {validacoesFiltradas.map((validacao) => (
                <div
                  key={validacao.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {validacao.status === "valido" ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : validacao.status === "erro" ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    )}
                    <div>
                      <div className="font-semibold">{validacao.nomeArquivo}</div>
                      <div className="text-sm text-muted-foreground">
                        {validacao.tipoNota} • {new Date(validacao.dataValidacao).toLocaleString('pt-BR')}
                        {validacao.status === 'erro' && validacao.erros.length > 0 && (
                          <> • {validacao.erros.length} erro{validacao.erros.length > 1 ? 's' : ''}</>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        Chave: {validacao.chaveAcesso.substring(0, 8)}...
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerDetalhes(validacao)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ResultadoValidacaoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        validacao={selectedValidacao}
      />
    </DashboardLayout>
  );
};

export default ValidacaoNF;