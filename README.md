# AMVIX — Gestão fiscal para escritórios contábeis

Plataforma web para escritórios de contabilidade acompanharem a rotina fiscal de **toda a carteira de clientes** num único painel, oferecendo a cada empresa atendida um **portal de consulta** dos próprios dados.

> 🔗 **Demo:** [amvix-nova-gestao-07154.vercel.app](https://amvix-nova-gestao-07154.vercel.app)
> _Conta de demonstração (somente leitura): em breve_

<!-- PRINTS: adicionar 3 imagens em docs/img/ (landing, dashboard, tela de NF-e) -->

---

## 👥 Para quem é

| Público | Papel no AMVIX |
|---|---|
| **Escritórios contábeis** (foco principal: pequenos e médios, com dezenas a algumas centenas de clientes) | Sócio administra, equipe fiscal opera todos os CNPJs da carteira |
| **Empresas atendidas pelo escritório** | Consultam notas, indicadores e painel da própria empresa, sem editar nada |
| Médias empresas com setor fiscal interno e filiais | Usam o mesmo modelo multiempresa para as próprias unidades |

## 🎯 Problema

No escritório contábil, a rotina fiscal de cada cliente fica espalhada entre planilhas, portais da SEFAZ e e-mails. Isso gera retrabalho, perda de prazos, ligações de clientes pedindo informações e pouco controle sobre quem acessa o quê. O AMVIX reúne a carteira inteira num único painel, com dados separados por empresa e permissões por perfil.

## ✨ Funcionalidades

| Área | O que faz |
|---|---|
| **Carteira multiempresa** | Empresas e filiais da carteira, com troca rápida da empresa ativa |
| **Portal do cliente** | Perfil de consulta para a empresa atendida acompanhar painel, notas e indicadores |
| **Notas fiscais** | Cadastro e listagem de NF-e, NFS-e e NFC-e, cancelamento, geração de XML e PDF |
| **Validação** | Validação de notas e armazenamento de XML |
| **Obrigações** | Telas de SPED Fiscal e EFD-Reinf |
| **Cadastros** | Clientes/fornecedores, produtos e formas de pagamento |
| **Gestão** | Dashboard com indicadores fiscais, relatórios, monitoramento e certificados digitais |
| **Administração** | Usuários, perfis e configuração de permissões por módulo |
| **LGPD** | Controle LGPD, política de privacidade, termos de uso e banner de cookies |

> ⚠️ **Status:** a transmissão de documentos à SEFAZ, o envio de NF-e por e-mail, o armazenamento de XML, o SPED Fiscal e a EFD-Reinf ainda funcionam em modo de demonstração (dados simulados). Ver os próximos passos em [`docs/SOBRE-O-PROJETO.md`](docs/SOBRE-O-PROJETO.md).

## 🔐 Perfis de acesso

Permissões granulares por **módulo × ação** (`visualizar`, `criar`, `editar`, `excluir`, `exportar`):

| Perfil | Quem é | Acesso padrão |
|---|---|---|
| **Admin** | Sócio ou gestor do escritório | Total, não pode ser restringido |
| **Contador** | Equipe fiscal e contábil | Módulos operacionais, sem administração de usuários |
| **Cliente** | Empresa atendida | Apenas visualização de dashboard, notas e indicadores |

A segurança real fica no banco: todas as tabelas usam **Row Level Security (RLS)** no PostgreSQL, e cada empresa só enxerga os próprios dados. Detalhes em [`docs/PERMISSOES.md`](docs/PERMISSOES.md).

## 🚀 Como rodar localmente

```bash
git clone https://github.com/HemellyMFeitosa/amvix-gestao-fiscal.git
cd amvix-gestao-fiscal
cp .env.example .env      # preencha com as chaves do seu projeto Supabase
npm install
npm run dev
```

Para recriar o banco, aplique as migrations de `supabase/migrations` num projeto Supabase novo (`supabase db push`).

## 📚 Documentação

- [`docs/PERMISSOES.md`](docs/PERMISSOES.md): guia do sistema de permissões
- [`docs/SOBRE-O-PROJETO.md`](docs/SOBRE-O-PROJETO.md): arquitetura, stack, qualidade, como foi construído e autoria
