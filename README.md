# casa-de-axe-frontend
CRM casa de Axé Ile Tenda são geronimo 
# Casa de Axé Frontend

Frontend React + TypeScript do CRM da Casa de Axé Ilê Tenda São Gerônimo.

## Stack
- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS + classes utilitárias adicionais
- Axios para integração com API

## Scripts
- `npm run dev`: sobe ambiente de desenvolvimento com Vite.
- `npm run build`: gera build de produção.
- `npm run preview`: serve o build localmente para validação.

## Estrutura principal
- `src/routes/AppRoutes.tsx`: configuração de rotas públicas e privadas (sem guard de autenticação no momento).
- `src/layouts/MainLayout.tsx`: layout base com sidebar, topbar e área de conteúdo.
- `src/pages/*`: telas da aplicação (`Login`, `Cadastro`, `Dashboard`, `Pontos`, `Usuários`, `Guias`, `Calendário`).
- `src/api/axios.ts`: instância HTTP central para chamadas à API.

## Fluxo atual
1. Usuário entra pela rota `/login`.
2. Ao autenticar, token retornado por `/User/login` é salvo no `localStorage`.
3. Usuário é redirecionado para `/dashboard`.
4. Demais páginas são renderizadas dentro do `MainLayout`.

## Observações técnicas
- A rota curinga (`*`) redireciona para `/login`.
- Atualmente não há proteção formal de rotas por token (ex.: `PrivateRoute`).
- Grande parte do conteúdo do Dashboard e demais telas está mockada para prototipação visual.
