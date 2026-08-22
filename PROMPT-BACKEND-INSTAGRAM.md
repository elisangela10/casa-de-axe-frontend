# Prompt para implementação do backend — Instagram e site público

## Contexto

Temos um frontend React/Vite para a Casa de Axé Ilê Tenda São Gerônimo.

Foi criada uma página pública em `/site` que apresenta:

- Próximas giras;
- Pontos cantados;
- Informações institucionais;
- Uma galeria com as publicações mais recentes do Instagram.

O frontend espera buscar o feed do Instagram pelo endpoint:

```text
GET /api/instagram
```

O token do Instagram nunca deve ser enviado ao frontend. O backend deve funcionar como um proxy seguro entre o site e a API oficial da Meta.

## Objetivo

Implemente no backend uma integração segura com o Instagram Graph API para que as publicações da conta `@tendasaojeronimo_` sejam refletidas automaticamente na galeria do site público.

A implementação deve:

1. Buscar as publicações da conta profissional do Instagram;
2. Armazenar ou armazenar em cache os resultados por alguns minutos;
3. Nunca expor o access token nas respostas ou logs;
4. Disponibilizar os dados por `GET /api/instagram`;
5. Suportar imagens, vídeos e posts em carrossel;
6. Informar erros de forma segura e previsível;
7. Permitir paginação para carregar publicações antigas futuramente.

## Pré-requisitos da Meta

Antes da implementação, confirme que:

- A conta do Instagram é uma conta profissional, Business ou Creator;
- A conta está vinculada a uma página do Facebook, quando exigido pelo fluxo de autenticação utilizado;
- Existe um aplicativo criado no Meta for Developers;
- O aplicativo possui as permissões necessárias para leitura das mídias da conta;
- O access token foi gerado para a conta correta;
- O Instagram User ID foi identificado;
- O aplicativo está em modo adequado para produção;
- Os domínios e URLs necessários estão configurados na Meta.

Não implemente scraping do HTML do Instagram. A integração deve utilizar a API oficial da Meta.

## Variáveis de ambiente

Adicione as seguintes variáveis no backend:

```env
INSTAGRAM_ACCESS_TOKEN=token_secreto_da_meta
INSTAGRAM_USER_ID=id_profissional_do_instagram
INSTAGRAM_GRAPH_VERSION=v25.0
INSTAGRAM_CACHE_MINUTES=5
INSTAGRAM_MEDIA_LIMIT=9
```

Regras obrigatórias:

- Nunca utilizar o prefixo `VITE_` nessas variáveis;
- Nunca devolver o token em JSON;
- Nunca salvar o token em banco sem criptografia;
- Nunca registrar o token em logs;
- Nunca colocar o token no código-fonte;
- Usar um gerenciador de secrets em produção.

## Endpoint público

Crie:

```http
GET /api/instagram
```

Resposta de sucesso:

```json
{
  "data": [
    {
      "id": "18000000000000000",
      "caption": "Texto da publicação",
      "mediaType": "IMAGE",
      "mediaUrl": "https://...",
      "thumbnailUrl": null,
      "permalink": "https://www.instagram.com/p/.../",
      "timestamp": "2026-08-21T20:00:00+0000",
      "children": []
    }
  ],
  "paging": {
    "next": null,
    "previous": null
  },
  "cachedAt": "2026-08-21T20:05:00Z"
}
```

O frontend atual consegue consumir também uma resposta simplificada no formato:

```json
{
  "data": []
}
```

## Campos da mídia

Para cada publicação, normalize os campos da Meta para o contrato abaixo:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| `id` | string | Sim | ID da mídia no Instagram |
| `caption` | string ou null | Não | Legenda da publicação |
| `mediaType` | string | Sim | `IMAGE`, `VIDEO` ou `CAROUSEL_ALBUM` |
| `mediaUrl` | string ou null | Não | URL principal da imagem ou vídeo |
| `thumbnailUrl` | string ou null | Não | Miniatura para vídeos |
| `permalink` | string | Sim | Link original da publicação |
| `timestamp` | string | Sim | Data de publicação |
| `children` | array | Não | Itens internos de um carrossel |

Para o frontend atual, se o backend preferir manter os nomes originais da Meta, também pode retornar:

```json
{
  "id": "...",
  "caption": "...",
  "media_type": "IMAGE",
  "media_url": "https://...",
  "thumbnail_url": null,
  "permalink": "https://www.instagram.com/p/.../",
  "timestamp": "..."
}
```

Recomenda-se, porém, padronizar a resposta para camelCase própria do backend.

## Integração com a Meta

Consulte as mídias da conta profissional usando o endpoint equivalente a:

```http
GET https://graph.facebook.com/{GRAPH_VERSION}/{INSTAGRAM_USER_ID}/media
```

Solicite apenas os campos necessários para a galeria:

```text
id,caption,media_type,media_url,thumbnail_url,permalink,timestamp
```

Inclua o access token apenas na requisição entre o backend e a Meta.

O backend deve:

1. Fazer a chamada para a Meta;
2. Validar o status HTTP;
3. Validar se a resposta contém `data` como array;
4. Normalizar os campos;
5. Ordenar por data decrescente;
6. Limitar a quantidade retornada;
7. Salvar o resultado no cache;
8. Retornar o contrato público sem informações sensíveis.

## Cache

Não faça uma chamada à Meta a cada visita ao site.

Implemente cache com duração configurável por `INSTAGRAM_CACHE_MINUTES`.

Opções aceitáveis:

- Redis;
- Memória do servidor para ambientes simples;
- Tabela de cache no banco;
- Cache nativo da plataforma de hospedagem.

Comportamento recomendado:

- Se o cache estiver válido, responder com o cache;
- Se estiver expirado, buscar dados novos;
- Se a Meta estiver temporariamente indisponível e existir cache antigo, retornar o cache antigo com `stale: true`;
- Se não existir cache e a Meta falhar, retornar erro controlado.

## Paginação

A resposta da Meta pode conter `paging.next`.

Não exponha diretamente uma URL contendo access token. Em vez disso, converta a paginação em um cursor interno:

```http
GET /api/instagram?cursor=cursor_publico
```

O cursor deve ser assinado ou armazenado no servidor para evitar manipulação.

## Erros esperados

### Integração não configurada

Status HTTP: `503`

```json
{
  "error": {
    "code": "INSTAGRAM_NOT_CONFIGURED",
    "message": "A integração com o Instagram ainda não foi configurada."
  }
}
```

### Falha da Meta

Status HTTP: `502`

```json
{
  "error": {
    "code": "INSTAGRAM_PROVIDER_ERROR",
    "message": "Não foi possível atualizar as publicações agora."
  }
}
```

### Limite de requisições

Status HTTP: `429`

```json
{
  "error": {
    "code": "INSTAGRAM_RATE_LIMIT",
    "message": "A atualização será tentada novamente mais tarde."
  }
}
```

Nunca retorne a mensagem bruta da Meta contendo token, parâmetros sensíveis ou detalhes internos.

## Segurança

Implemente também:

- CORS permitindo apenas o domínio oficial do site;
- Rate limiting no endpoint público;
- Cache para reduzir chamadas externas;
- Timeout para requisições à Meta;
- Logs sem tokens ou credenciais;
- Validação de URLs retornadas;
- Sanitização da legenda antes de renderização, se ela for convertida para HTML;
- Headers de segurança;
- Tratamento de falhas sem stack trace em produção.

## Atualização automática

O frontend atual consulta o endpoint quando a página é aberta.

Para uma solução mais robusta, crie também um job agendado que atualize o cache periodicamente:

```text
Job: InstagramFeedSync
Frequência: a cada 5 ou 10 minutos
Responsabilidade: atualizar o cache da conta profissional
```

O site não deve depender exclusivamente do job. Se o cache estiver expirado, o endpoint pode fazer uma atualização sob demanda, respeitando rate limiting.

## Testes obrigatórios

Crie testes unitários e de integração cobrindo:

- Endpoint sem variáveis de ambiente;
- Token inválido;
- Instagram User ID inválido;
- Resposta válida com imagens;
- Resposta com vídeos;
- Resposta com carrossel;
- Resposta vazia;
- Falha de rede;
- Erro HTTP da Meta;
- Cache válido;
- Cache expirado;
- Retorno de cache antigo quando a Meta falha;
- Ausência do token na resposta pública;
- CORS para domínio permitido;
- Bloqueio de origem não permitida;
- Rate limit.

## Critérios de aceite

Considere a implementação concluída quando:

- `GET /api/instagram` responder com o contrato documentado;
- O frontend conseguir renderizar a galeria em `/site`;
- O access token não aparecer no navegador;
- O access token não aparecer nos logs;
- A API não fizer chamadas desnecessárias por causa do cache;
- Imagens, vídeos e carrosséis forem tratados sem quebrar o frontend;
- O endpoint continuar retornando cache antigo durante uma falha temporária da Meta;
- Os testes automatizados estiverem passando;
- As variáveis de produção estiverem documentadas;
- A integração funcionar sem scraping do Instagram.

## Resultado esperado para o frontend

Depois da implementação, ao acessar:

```text
https://dominio-do-site.com/site#instagram
```

o usuário deverá visualizar as publicações recentes da conta:

```text
https://www.instagram.com/tendasaojeronimo_/
```

Cada item da galeria deve abrir a publicação original no Instagram ao ser selecionado.

