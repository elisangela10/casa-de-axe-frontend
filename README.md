# casa-de-axe-frontend

CRM da Casa de Axé Ilê Tenda São Jerônimo.
# Casa de Axé Frontend

Frontend React + TypeScript do CRM da Casa de Axé Ilê Tenda São Jerônimo.

## Stack
- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios para integração com API

## Scripts
- `npm run dev`: sobe ambiente de desenvolvimento com Vite.
- `npm run build`: gera build de produção.
- `npm run preview`: serve o build localmente para validação.
- `npm run test:e2e`: executa os testes end-to-end com Playwright.
- `npm run test:e2e:ui`: abre a interface visual do Playwright.

## Estrutura principal
- `src/routes/AppRoutes.tsx`: configuração de rotas públicas, privadas e página 404.
- `src/layouts/MainLayout.tsx`: layout base com sidebar, topbar e área de conteúdo.
- `src/pages/*`: telas da aplicação (`Login`, `Cadastro`, `Dashboard`, `Pontos`, `Usuários`, `Guias`, `Calendário`).
- `src/services/api.ts`: cliente HTTP central, autenticação JWT e tratamento de status HTTP.

## Fluxo atual
1. Usuário entra pela rota `/login`.
2. Ao autenticar, token retornado por `/User/login` é salvo no `localStorage`.
3. Usuário é redirecionado para `/dashboard`.
4. Demais páginas são renderizadas dentro do `MainLayout`.

## Configuração da API

Copie `.env.example` para `.env.local` e ajuste a URL da API. O cliente acrescenta `/api` automaticamente:

```env
VITE_API_URL=http://localhost:5000
# alternativa HTTPS:
# VITE_API_URL=https://localhost:7218
```

Os endpoints de guias, giras, usuários, pontos e Instagram também podem ser ajustados pelas variáveis `VITE_GUIAS_ENDPOINT`, `VITE_GIRAS_ENDPOINT`, `VITE_USUARIOS_ENDPOINT`, `VITE_PONTOS_ENDPOINT` e `VITE_INSTAGRAM_FEED_URL`.

Guias e giras mantêm uma cópia local no navegador quando a API não está disponível. Assim, o protótipo continua utilizável durante o desenvolvimento, mas a persistência definitiva deve ser garantida pelo backend.

## Site público e Instagram

A página pública está disponível em `/site`. Ela apresenta a Casa, próximas giras, pontos cantados e uma galeria sincronizada com o Instagram.

O arquivo `api/instagram.js` funciona como proxy serverless. Configure no ambiente de produção:

```env
INSTAGRAM_ACCESS_TOKEN=seu_token_da_meta
INSTAGRAM_USER_ID=id_da_conta_profissional
INSTAGRAM_GRAPH_VERSION=v25.0
```

A conta do Instagram precisa ser uma conta profissional e o token deve ficar somente no servidor. O frontend chama `/api/instagram` pelo proxy da API e nunca recebe o token. Não use `VITE_INSTAGRAM_ACCESS_TOKEN`.

Durante o desenvolvimento, a API deve permitir as origens `http://localhost:5173`, `https://localhost:5173`, `http://localhost:4173` e `http://localhost:3000`. O frontend usa JWT Bearer e não usa `credentials: "include"` nem `mode: "no-cors"`.

## Testes end-to-end

Os cenários ficam em `e2e/app.spec.ts` e usam mocks das respostas da API. Isso evita que os testes dependam da disponibilidade da API externa.

Antes da primeira execução, instale o navegador do Playwright:

```bash
npx playwright install chromium
```

Os testes cobrem:

- Redirecionamento da raiz para o login;
- Proteção do dashboard;
- Página 404;
- Login;
- Validação do cadastro;
- Cadastro e busca de guias;
- Cadastro de giras;
- Administração de usuários.

## Observações técnicas
- A rota `/` redireciona para `/login` e a rota curinga (`*`) exibe uma página 404.
- As rotas privadas usam `PrivateRoute` e verificam o token e, quando necessário, o perfil do usuário.
- O Dashboard, usuários, guias e calendário possuem estados de carregamento, busca, formulários e feedback de erro.
