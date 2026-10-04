import { Building2, Check } from 'lucide-react';
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useEmpresa } from '@/contexts/EmpresaContext';
import { cn } from '@/lib/utils';

const EmpresaSelector = () => {
  const { empresaAtual, empresas, selecionarEmpresa } = useEmpresa();

  const empresasAtivas = empresas.filter((e) => e.status === 'Ativa');

  if (empresasAtivas.length === 0) {
    return null;
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Building2 className="w-4 h-4 mr-2" />
        Selecionar Empresa
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-64 bg-background">
        {empresasAtivas.map((empresa) => (
          <DropdownMenuItem
            key={empresa.id}
            onClick={() => selecionarEmpresa(empresa)}
            className={cn(
              "cursor-pointer",
              empresaAtual?.id === empresa.id && "bg-primary/10"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="truncate">
                {empresa.codigo} - {empresa.nome_fantasia}
              </span>
              {empresaAtual?.id === empresa.id && (
                <Check className="w-4 h-4 ml-2 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

export default EmpresaSelector;
