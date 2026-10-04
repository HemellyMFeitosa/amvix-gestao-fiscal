import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download, Trash2 } from "lucide-react";
import { ArquivoXML } from "@/hooks/useArquivosXML";

interface XMLTableProps {
  arquivos: ArquivoXML[];
  onDownload: (arquivo: ArquivoXML) => void;
  onDelete: (id: string) => void;
}

const XMLTable = ({ arquivos, onDownload, onDelete }: XMLTableProps) => {
  const [arquivoParaExcluir, setArquivoParaExcluir] = useState<string | null>(null);

  const getTipoBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "NF-e":
        return "default";
      case "NFS-e":
        return "secondary";
      case "NFC-e":
        return "outline";
      default:
        return "default";
    }
  };

  const handleDelete = () => {
    if (arquivoParaExcluir) {
      onDelete(arquivoParaExcluir);
      setArquivoParaExcluir(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Arquivo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Chave</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {arquivos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhum arquivo encontrado
                </TableCell>
              </TableRow>
            ) : (
              arquivos.map((xml) => (
                <TableRow key={xml.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{xml.nome}</TableCell>
                  <TableCell>
                    <Badge variant={getTipoBadgeVariant(xml.tipo)}>{xml.tipo}</Badge>
                  </TableCell>
                  <TableCell>{xml.data}</TableCell>
                  <TableCell className="text-muted-foreground">{xml.tamanho}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {xml.chave}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(xml)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-destructive"
                        onClick={() => setArquivoParaExcluir(xml.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!arquivoParaExcluir}
        onOpenChange={(open) => !open && setArquivoParaExcluir(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este arquivo XML? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default XMLTable;
