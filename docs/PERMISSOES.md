# Guia de Uso do Sistema de Permissões Granulares

## Visão Geral

O sistema implementa controle de acesso granular por módulo e ação, permitindo configurar permissões específicas para cada perfil de usuário (Admin, Contador, Cliente).

## Estrutura do Banco de Dados

### Tabelas Criadas

1. **modulos_sistema**
   - Armazena todos os módulos/funcionalidades do sistema
   - Campos: nome, descrição, ícone, rota, ordem, ativo

2. **permissoes**
   - Relaciona roles (perfis) com módulos e ações
   - Campos: role, modulo_id, acao, permitido
   - Ações possíveis: visualizar, criar, editar, excluir, exportar

3. **Campos adicionados ao profiles**
   - telefone, departamento, observacoes
   - data_cadastro, cadastrado_por

### Funções SQL

- `tem_permissao(_user_id, _modulo, _acao)`: Verifica se usuário tem permissão específica

## Como Usar no Frontend

### 1. Hook usePermissoes

```typescript
import { usePermissoes } from "@/hooks/usePermissoes";

const MeuComponente = () => {
  const { verificarPermissao } = usePermissoes();

  const handleCriar = async () => {
    const podeCriar = await verificarPermissao("nfe", "criar");
    
    if (!podeCriar) {
      toast({ title: "Você não tem permissão para criar NF-e" });
      return;
    }
    
    // Lógica para criar...
  };
};
```

### 2. Componente ProtectedAction

Proteger ações específicas:

```tsx
import { ProtectedAction } from "@/components/ProtectedAction";

// Exemplo 1: Botão protegido
<ProtectedAction modulo="nfe" acao="criar">
  <Button onClick={handleCriarNFe}>
    Criar Nova NF-e
  </Button>
</ProtectedAction>

// Exemplo 2: Com fallback
<ProtectedAction 
  modulo="nfe" 
  acao="excluir"
  fallback={<Button disabled>Sem Permissão</Button>}
>
  <Button onClick={handleExcluir}>
    Excluir
  </Button>
</ProtectedAction>
```

### 3. Hook useAuth

Verificar perfil do usuário:

```typescript
import { useAuth } from "@/hooks/useAuth";

const MeuComponente = () => {
  const { role, isAdmin, isContador, isCliente } = useAuth();

  return (
    <div>
      {isAdmin && <p>Você é administrador</p>}
      {isContador && <p>Você é contador</p>}
      {isCliente && <p>Você é cliente</p>}
    </div>
  );
};
```

## Configuração de Permissões (Admin)

### Interface Administrativa

Na página de Administração (/admin), clique no botão **"Configurar Permissões"**.

1. **Selecione o Perfil**: Admin, Contador ou Cliente
2. **Configure as Permissões**: Marque/desmarque checkboxes para cada módulo
3. **Salvar**: As alterações são salvas automaticamente

### Módulos Disponíveis

- Dashboard
- NF-e, NFS-e, NFC-e
- Validação de Notas Fiscais
- Integração ERP
- Automação RPA
- SPED Fiscal
- EFD-Reinf
- Certificados Digitais
- Empresas e Filiais
- Parâmetros Fiscais
- Indicadores Fiscais
- Armazenamento XML
- Controle LGPD
- Monitoramento
- Administração de Usuários

### Ações por Módulo

Cada módulo pode ter as seguintes permissões:

- **Visualizar**: Acesso para ver/consultar
- **Criar**: Adicionar novos registros
- **Editar**: Modificar registros existentes
- **Excluir**: Remover registros
- **Exportar**: Exportar dados (CSV, XML, etc)

## Permissões Padrão por Perfil

### Administrador
- ✅ Acesso TOTAL a todos os módulos e ações
- Não pode ter permissões alteradas

### Contador
- ✅ Acesso completo a módulos operacionais
- ❌ Sem acesso à Administração de Usuários

### Cliente  
- ✅ Visualização de: Dashboard, NF-e, NFS-e, NFC-e, Indicadores
- ❌ Sem permissões de criar/editar/excluir

## Migração do localStorage para Supabase

### O que mudou:

1. **Usuários agora são armazenados no Supabase**
   - Tabela `profiles` para dados do usuário
   - Tabela `user_roles` para perfis
   - Tabela `user_empresas` para vincular empresas

2. **Autenticação integrada**
   - Login/logout via Supabase Auth
   - Sessão persistente e segura
   - Tokens JWT

3. **RLS (Row Level Security)**
   - Dados protegidos por políticas de segurança
   - Usuários só veem seus próprios dados
   - Admins têm visibilidade total

### Funcionalidades Mantidas:

✅ Cadastro de usuários  
✅ Edição de usuários  
✅ Exclusão de usuários  
✅ Filtros por perfil e status  
✅ Busca por nome/email  
✅ Exportação CSV  
✅ Visualização de detalhes

## Exemplos Práticos

### Proteger uma Página Inteira

```tsx
import { useAuth } from "@/hooks/useAuth";
import { usePermissoes } from "@/hooks/usePermissoes";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const NFePage = () => {
  const { user, loading: authLoading } = useAuth();
  const { verificarPermissao } = usePermissoes();
  const [podeVisualizar, setPodeVisualizar] = useState<boolean | null>(null);

  useEffect(() => {
    const verificar = async () => {
      const permitido = await verificarPermissao("nfe", "visualizar");
      setPodeVisualizar(permitido);
    };

    if (user) {
      verificar();
    }
  }, [user]);

  if (authLoading || podeVisualizar === null) {
    return <div>Carregando...</div>;
  }

  if (!user || !podeVisualizar) {
    return <Navigate to="/dashboard" />;
  }

  return <div>Conteúdo da página NF-e</div>;
};
```

### Verificar Múltiplas Permissões

```typescript
const verificarPermissoes = async () => {
  const { verificarPermissao } = usePermissoes();
  
  const [podeCriar, podeEditar, podeExcluir] = await Promise.all([
    verificarPermissao("nfe", "criar"),
    verificarPermissao("nfe", "editar"),
    verificarPermissao("nfe", "excluir"),
  ]);

  return { podeCriar, podeEditar, podeExcluir };
};
```

### Condicional em Botões de Ação

```tsx
const TabelaNFe = () => {
  const { verificarPermissao } = usePermissoes();
  const [permissoes, setPermissoes] = useState({
    editar: false,
    excluir: false,
  });

  useEffect(() => {
    const carregar = async () => {
      const podeEditar = await verificarPermissao("nfe", "editar");
      const podeExcluir = await verificarPermissao("nfe", "excluir");
      setPermissoes({ editar: podeEditar, excluir: podeExcluir });
    };
    carregar();
  }, []);

  return (
    <table>
      <tbody>
        <tr>
          <td>Nota 12345</td>
          <td>
            {permissoes.editar && (
              <Button onClick={handleEditar}>Editar</Button>
            )}
            {permissoes.excluir && (
              <Button onClick={handleExcluir}>Excluir</Button>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
```

## Segurança

### Verificações no Backend

⚠️ **IMPORTANTE**: As verificações de permissão no frontend são apenas para UX. Sempre valide permissões no backend (RLS policies) para garantir segurança real.

### Row Level Security (RLS)

Todas as tabelas têm políticas RLS configuradas:

```sql
-- Exemplo: Apenas admins veem todas permissões
CREATE POLICY "Admins podem ver todas permissões"
ON public.permissoes FOR SELECT
USING (has_role(auth.uid(), 'admin'));
```

## Troubleshooting

### Usuário não consegue acessar módulo

1. Verificar se usuário está autenticado
2. Verificar role do usuário na tabela `user_roles`
3. Verificar permissões na tabela `permissoes`
4. Verificar se módulo está ativo em `modulos_sistema`

### Permissões não estão atualizando

1. Limpar cache do navegador
2. Fazer logout e login novamente
3. Verificar se função `tem_permissao` está funcionando no SQL

### Erro ao criar usuário

1. Verificar se email já existe
2. Verificar políticas RLS na tabela `profiles`
3. Verificar se role está sendo criada em `user_roles`

## Próximos Passos

- [ ] Implementar auditoria de alterações de permissões
- [ ] Adicionar permissões temporárias (com data de expiração)
- [ ] Criar grupos de permissões customizados
- [ ] Dashboard de uso de permissões
- [ ] Relatório de acessos por usuário
