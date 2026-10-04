# Sobre o projeto

Bastidores técnicos do AMVIX: arquitetura, decisões de implementação, qualidade e autoria. A visão de produto está no [README](../README.md).

## 🧱 Arquitetura

```
React (Vite + TS)  ──►  Supabase
 ├─ shadcn/ui + Tailwind     ├─ Auth (JWT)
 ├─ React Query (cache)      ├─ PostgreSQL + RLS
 └─ Context de empresa       ├─ Funções SQL (tem_permissao, has_role)
    ativa (multiempresa)     └─ Edge Functions (Deno)
```

**Principais tabelas:** `profiles`, `user_roles`, `user_empresas`, `modulos_sistema`, `permissoes`, `notas_fiscais`, entre outras. As migrations estão em [`supabase/migrations`](../supabase/migrations).

## 🛠️ Stack

TypeScript · React 18 · Vite · Tailwind CSS · shadcn/ui · TanStack React Query · Supabase (PostgreSQL, Auth, RLS, Edge Functions) · Vercel

## ✅ Qualidade

| Comando | O que faz |
|---|---|
| `npm run lint` | ESLint (0 erros) |
| `npm run typecheck` | Checagem de tipos do TypeScript |
| `npm test` | Testes unitários com Vitest |
| `npm run build` | Build de produção |

O GitHub Actions roda os quatro a cada push e pull request ([`ci.yml`](../.github/workflows/ci.yml)).

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
- [ ] Transmissão real de NF-e/NFC-e à SEFAZ e armazenamento real de XML
- [ ] Envio real de NF-e por e-mail
- [ ] Ativar `strict` no TypeScript
- [ ] Testes de componentes (React Testing Library)
- [ ] Conta de demonstração somente leitura
- [ ] Auditoria de alterações de permissões

## 👩‍💻 Autora

**Hemelly Martins Feitosa**, desenvolvedora backend com foco em automação e IA · Manaus-AM
[LinkedIn](https://www.linkedin.com/in/hemelly-martins-feitosa-829129179/) · [GitHub](https://github.com/HemellyMFeitosa)
