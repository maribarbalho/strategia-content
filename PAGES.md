# GitHub Pages

Em Settings → Pages, selecione Deploy from a branch → main → /docs → Save.

A pasta docs contém somente a apresentação estática. Login, painel, catálogos publicados, banco de dados e atendimento por IA continuam em https://strategiacontent.marianabarbalho2003.chatgpt.site. Os botões encaminham para esse aplicativo; não há chamadas de API entre origens nem chaves secretas na exportação.

Após alterar web/index.html, execute `node scripts/build-pages.mjs` e faça commit da pasta docs atualizada. O script valida que não restam chamadas locais de API ou URLs relativas à raiz.

GitHub Pages em repositório privado depende de plano compatível do GitHub. Esta adaptação não altera a visibilidade do repositório.
