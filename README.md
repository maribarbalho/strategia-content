# Strategia Content

Site e plataforma de catálogos digitais para pequenos negócios.

## Recursos

- Página institucional com demonstrações e paletas verde, rosé e lilás.
- Temas claro e escuro, briefing e assistente Gemini.
- Login com Firebase (Google e e-mail/senha), com opção ChatGPT.
- Painéis de cliente e administradora.
- Geração de catálogos, revisão, aprovação e publicação.
- Upload de fotos e logo; catálogos aprovados podem ser acessados sem login.
- Indicadores e exportação CSV com separação de dados reais e fictícios.

## Tecnologia

HTML, CSS e JavaScript; servidor Cloudflare Workers, D1/SQLite e R2. Hospedagem atual pelo Sites. Firebase Authentication para os logins externos.

## Validação local

Requer Node.js 24 ou superior. Não há dependências npm para compilar e testar.

```sh
npm run build
npm run validate
npm test
```

O build gera `dist/server/index.js`. Os testes usam SQLite em memória, armazenamento simulado e respostas simuladas do provedor Firebase; não criam contas reais e não validam o login Google ou o Gemini em produção.

## Configuração da hospedagem

- `.openai/hosting.json`: projeto Sites existente e bindings `DB` (D1) e `BUCKET` (R2).
- `drizzle/`: migrações em ordem; preservar as já aplicadas.
- `GEMINI_API_KEY`: variável secreta no servidor, nunca no frontend.
- Firebase: configuração web pública em `worker/firebase-auth.mjs`; ativar Google e e-mail/senha no console e autorizar o domínio do site.
- Administradora: identidade validada no servidor; a configuração atual usa o e-mail da proprietária. Alterar permissões exige revisão de segurança.

Este repositório contém o código; enviar ao GitHub não altera automaticamente a publicação do Sites. A publicação existente usa o fluxo de versões e deploy do Sites.

## Estrutura

- `web/`: páginas e scripts do navegador.
- `worker/`: rotas, autenticação, banco, imagens e integração com IA.
- `db/`: esquema e carga demonstrativa exclusivamente fictícia.
- `assets/`: símbolo da marca.
- `scripts/`: build, validação e testes.

## Dados e credenciais

Não inclui exportações do banco de produção, imagens enviadas por clientes, senhas, tokens de sessão ou a chave Gemini. `db/source-data.json` contém somente dados de demonstração marcados como fictícios. A configuração web do Firebase é pública por definição e não é uma chave privada de administração.
