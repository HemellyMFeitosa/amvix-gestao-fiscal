# AMVIX — Gestão Fiscal e Empresarial

Plataforma web para centralizar a rotina fiscal de empresas e escritórios contábeis: emissão e controle de notas fiscais (NF-e, NFS-e, NFC-e), obrigações acessórias (SPED Fiscal, EFD-Reinf), certificados digitais, multiempresa/filiais e controle de acesso por perfil.

> 🔗 **Demo:** [amvix-nova-gestao-07154.vercel.app](https://amvix-nova-gestao-07154.vercel.app)
> _Conta de demonstração (somente leitura): em breve_

<!-- PRINTS: adicionar 3 imagens em docs/img/ (landing, dashboard, tela de NF-e) -->

---

## 🎯 Problema

Rotinas fiscais costumam ficar espalhadas entre planilhas, portais da SEFAZ e e-mails. Isso gera retrabalho, perda de prazos e pouco controle sobre quem acessa o quê. O AMVIX reúne tudo num único painel, com dados separados por empresa e permissões granulares por perfil.

## ✨ Funcionalidades

| Área | O que faz |
|---|---|
| **Notas fiscais** | Cadastro e listagem de NF-e, NFS-e e NFC-e, cancelamento, geração de XML e PDF, envio por e-mail |
| **Validação** | Validação de notas e armazenamento de XML |
| **Obrigações** | Telas de SPED Fiscal e EFD-Reinf |
| **Cadastros** | Clientes/fornecedores, produtos, formas de pagamento, empresas e filiais |
| **Gestão** | Dashboard com indicadores fiscais, relatórios, monitoramento e certificados digitais |
| **Administração** | Usuários, perfis e configuração de permissões por módulo |
| **LGPD** | Controle LGPD, política de privacidade, termos de uso e banner de cookies |

## 🔐 Controle de acesso

Permissões granulares por **módulo × ação** (`visualizar`, `criar`, `editar`, `excluir`, `exportar`) para três perfis:

| Perfil | Acesso padrão |
|---|---|
| **Admin** | Total, não pode ser restringido |
| **Contador** | Módulos operacionais, sem administração de usuários |
| **Cliente** | Apenas visualização de dashboard, notas e indicadores |

A segurança real fica no banco: todas as tabelas usam **Row Level Security (RLS)** no PostgreSQL. As verificações no front-end (`usePermissoes`, `<ProtectedAction>`) servem apenas para a experiência do usuário. A criação de usuários passa pela Edge Function `admin-create-user`, que exige JWT válido e confirma no banco que quem chama é administrador. Detalhes em [`docs/PERMISSOES.md`](docs/PERMISSOES.md).

## 🧱 Arquitetura

```
React (Vite + TS)  ──►  Supabase
 ├─ shadcn/ui + Tailwind     ├─ Auth (JWT)
 ├─ React Query (cache)      ├─ PostgreSQL + RLS
 └─ Context de empresa       ├─ Funções SQL (tem_permissao, has_role)
    ativa (multiempresa)     └─ Edge Functions (Deno)
```

**Principais tabelas:** `profiles`, `user_roles`, `user_empresas`, `modulos_sistema`, `permissoes`, `notas_fiscais`, entre outras. As migrations estão em [`supabase/migrations`](supabase/migrations).

## 🛠️ Stack

TypeScript · React 18 · Vite · Tailwind CSS · shadcn/ui · TanStack React Query · Supabase (PostgreSQL, Auth, RLS, Edge Functions) · Vercel

## 🚀 Como rodar localmente

```bash
git clone https://github.com/HemellyMFeitosa/amvix-gestao-fiscal.git
cd amvix-gestao-fiscal
cp .env.example .env      # preencha com as chaves do seu projeto Supabase
npm install
npm run dev
```

Para recriar o banco, aplique as migrations de `supabase/migrations` num projeto Supabase novo (`supabase db push`).

## ✅ Qualidade

| Comando | O que faz |
|---|---|
| `npm run lint` | ESLint (0 erros) |
| `npm run typecheck` | Checagem de tipos do TypeScript |
| `npm test` | Testes unitários com Vitest |
| `npm run build` | Build de produção |

O GitHub Actions roda os quatro a cada push e pull request ([`ci.yml`](.github/workflows/ci.yml)).

Os testes cobrem as regras que mais importam no domínio fiscal: validação de CNPJ, geração da chave de acesso da NF-e (44 dígitos, dígito verificador módulo 11), XML da NF-e (escape de caracteres especiais e CPF/CNPJ do destinatário), integração com o ViaCEP e tradução segura de erros do banco.

## 🧭 Como foi construído

O protótipo das telas foi gerado com **Lovable** (IA). A partir dele, eu defini e implementei:

- a modelagem de dados e a estrutura multiempresa;
- o sistema de permissões granulares e as políticas de RLS;
- a migração da autenticação de `localStorage` para Supabase Auth;
- as regras de negócio fiscais e os fluxos de cada módulo.

## 🗺️ Próximos passos

- [x] Remoção de `any` e tipagem do conteúdo fiscal das notas
- [x] Testes automatizados (Vitest) e CI com GitHub Actions
- [ ] Ativar `strict` no TypeScript
- [ ] Testes de componentes (React Testing Library)
- [ ] Conta de demonstração somente leitura
- [ ] Auditoria de alterações de permissões

## 👩‍💻 Autora

**Hemelly Martins Feitosa**, desenvolvedora backend com foco em automação e IA · Manaus-AM
[LinkedIn](https://www.linkedin.com/in/hemelly-martins-feitosa-829129179/) · [GitHub](https://github.com/HemellyMFeitosa)
