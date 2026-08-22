# Auditoria e plano de modernização

> Status: principais correções de Prioridades 1, 2, 3 e 4 implementadas no frontend. A persistência definitiva de guias e giras depende da disponibilidade e dos contratos do backend.

## Visão geral

O projeto é um CRM para a Casa de Axé Ilê Tenda São Gerônimo, desenvolvido com React, TypeScript e Vite.

Atualmente, a aplicação possui:

- Login e cadastro de usuários;
- Dashboard;
- Calendário de giras;
- Gerenciamento de usuários;
- Gerenciamento de guias;
- Acervo de pontos cantados;
- Autenticação por token;
- Integração parcial com uma API externa.

O sistema já possui uma boa base visual e a tela de Pontos é a mais avançada, com busca, filtros, cadastro, edição, exclusão e integração com API. Porém, o projeto ainda está entre um protótipo visual e um sistema completo de produção.

## Principais pontos encontrados

### Identidade visual e acabamento

- Existem referências para arquivos que não estão presentes, como `public/images/logo.svg` e `/vite.svg`.
- O projeto possui `logo-dark.svg`, mas Login e Cadastro procuram outro arquivo.
- Existem muitos textos com problemas de codificação, como `Casa de AxÃ©`, `CalendÃ¡rio` e `UsuÃ¡rios`.
- Há uma grande quantidade de estilos e assets herdados de um template administrativo antigo.
- São utilizados vários sistemas de ícones e fontes ao mesmo tempo: Bootstrap Icons, Tabler, Font Awesome, Feather, Material e Phosphor.
- A identidade visual ainda não está totalmente personalizada para a Casa de Axé.

### Funcionalidades ainda mockadas

As telas abaixo ainda utilizam dados locais ou dados fixos:

- `src/pages/Guias.tsx`;
- `src/pages/Calendario.tsx`;
- Parte do `src/pages/Dashboard.tsx`.

Isso significa que dados cadastrados nessas telas podem desaparecer ao atualizar a página.

O Dashboard também utiliza números fixos, como quantidade de giras, filhos da casa, assistentes e pontos. Esses valores devem ser carregados da API.

### Usuários

Em `src/pages/Usuarios.tsx`, existem botões e controles visuais para:

- Novo membro;
- Editar usuário;
- Remover usuário;
- Buscar usuários;
- Filtrar por cargo;
- Paginar resultados.

Porém, várias dessas ações ainda não estão implementadas.

Faltam também:

- Formulário de criação de usuário;
- Edição de usuário;
- Exclusão com confirmação;
- Busca funcional;
- Filtro funcional;
- Paginação real;
- Controle de permissões por função.

### Segurança e permissões

O calendário utiliza um controle local semelhante a:

```tsx
const [isAdmin, setIsAdmin] = useState(true);
```

Isso permite que qualquer usuário ative a visão administrativa no navegador. Permissões não devem depender apenas do frontend.

O sistema deve:

- Obter o papel do usuário autenticado;
- Validar permissões no backend;
- Bloquear operações administrativas no servidor;
- Controlar quais menus e ações cada perfil pode acessar.

A autenticação atual também verifica apenas se existe um token. Ainda é necessário tratar:

- Expiração do token;
- Usuário atual;
- Perfil do usuário;
- Refresh token, se existir na API;
- Logout global;
- Token inválido antes das requisições.

### Configuração da API

A URL da API está fixa em `src/api/axios.ts`:

```ts
baseURL: "https://casadeaxe-api.onrender.com/api"
```

O recomendado é utilizar variáveis de ambiente:

```env
VITE_API_URL=https://casadeaxe-api.onrender.com/api
```

Isso permite separar os ambientes de desenvolvimento, homologação e produção.

Também é importante diferenciar mensagens para:

- API indisponível;
- Usuário não autorizado;
- Erro de validação;
- Falha de conexão;
- Erro inesperado.

## Melhorias de experiência do usuário

Para tornar a aplicação mais moderna e específica, recomenda-se implementar:

- Logo e identidade visual própria;
- Paleta com tons terrosos, dourado, vinho e verde profundo;
- Sidebar recolhível;
- Menu mobile funcional;
- Breadcrumbs;
- Notificações;
- Toasts padronizados;
- Skeleton loading;
- Estados vazios mais claros;
- Modal reutilizável;
- Tabelas responsivas;
- Dark mode opcional;
- Página de perfil;
- Configurações da casa;
- Controle de permissões por função.

Atualmente, a sidebar fica escondida em telas menores por meio de `hidden md:flex`, mas não existe um menu alternativo para navegação mobile.

## Organização técnica recomendada

As telas concentram muitas responsabilidades. Uma organização futura pode ser:

```text
src/
├── components/
│   ├── Button/
│   ├── Modal/
│   ├── DataTable/
│   ├── EmptyState/
│   └── Loading/
├── features/
│   ├── auth/
│   ├── usuarios/
│   ├── calendario/
│   ├── guias/
│   └── pontos/
├── services/
│   └── api/
├── hooks/
├── types/
├── layouts/
└── pages/
```

Também são recomendados:

- React Hook Form;
- Zod para validação;
- Tipos compartilhados da API;
- Tratamento global de erros;
- ESLint;
- Prettier;
- Testes unitários;
- Testes de componentes;
- Pipeline de integração contínua.

## Pontos técnicos observados

- `tsc --noEmit` foi executado sem erros.
- O build do Vite apresentou um erro de permissão do esbuild no ambiente local, sem indicar erro TypeScript no código.
- O `README.md` informa que existe uma rota curinga para `/login`, mas ela não está configurada em `src/routes/AppRoutes.tsx`.
- `src/App.tsx` existe, mas não está sendo utilizado pela aplicação principal.
- O favicon ainda é o padrão do Vite.
- O Dashboard contém datas antigas e dados estáticos.
- O projeto ainda não possui testes.
- O projeto ainda não possui lint configurado.
- Existe uma alteração prévia em `src/pages/Pontos.tsx`; essa alteração deve ser preservada.

## Plano de evolução por prioridade

### Prioridade 1 — Correções essenciais

- Corrigir a codificação dos textos para UTF-8;
- Corrigir logo e favicon;
- Configurar a API por variável de ambiente;
- Corrigir a rota padrão e a rota de página não encontrada;
- Implementar feedback consistente de erro, carregamento e sucesso.

### Prioridade 2 — Funcionalidades reais

- Implementar persistência de guias;
- Implementar persistência do calendário;
- Completar o CRUD de usuários;
- Tornar o Dashboard dinâmico;
- Implementar busca, filtros e paginação reais.

### Prioridade 3 — Segurança

- Implementar permissões por perfil;
- Remover controles administrativos simulados no frontend;
- Validar autorização no backend;
- Tratar expiração e invalidação de tokens;
- Melhorar o fluxo de logout.

### Prioridade 4 — Modernização visual

- Criar identidade visual própria;
- Definir tokens de cores, espaçamento e tipografia;
- Escolher um único sistema de ícones;
- Remover assets e estilos não utilizados do template;
- Melhorar a experiência mobile;
- Adicionar dark mode, se fizer sentido para o produto.

### Prioridade 5 — Qualidade e manutenção

- Criar componentes reutilizáveis;
- Separar funcionalidades por domínio;
- Adicionar validação de formulários;
- Adicionar testes;
- Configurar ESLint e Prettier;
- Criar pipeline de CI;
- Documentar os endpoints e regras do sistema.

## Resultado esperado

Ao concluir essas etapas, o projeto deverá deixar de ser apenas um protótipo administrativo e se tornar um sistema confiável, persistente, responsivo e com identidade própria para a Casa de Axé.
