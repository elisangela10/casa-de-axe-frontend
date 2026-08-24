import { expect, test, type Page } from "@playwright/test";

const apiUrl = "http://localhost:5000/api";

function tokenFor(role = "user") {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: "1", name: "Teste E2E", role, exp: Math.floor(Date.now() / 1000) + 3600 }));
  return `${header}.${payload}.test`;
}

async function loginAs(page: Page, role = "user") {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.evaluate((token) => localStorage.setItem("auth_token", token), tokenFor(role));
}

async function mockApi(page: Page) {
  await page.route(`${apiUrl}/**`, async (route) => {
    const request = route.request();
    const url = request.url();
    if (request.method() === "GET" && url.endsWith("/User/GetUser")) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([{ Id: 1, NomeCompleto: "Mãe Joana", Email: "joana@casa.test", Telefone: "11999999999", Username: "joana", RoleId: 1, StatusUsuarioId: 1 }]) });
      return;
    }
    if (request.method() === "GET" && url.endsWith("/TextoPonto")) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
      return;
    }
    if (request.method() === "POST" && url.endsWith("/TextoPonto")) {
      const payload = request.postDataJSON();
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ id: 10, ...payload }) });
      return;
    }
    if (request.method() === "GET" && (url.endsWith("/Guia") || url.endsWith("/Gira"))) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
      return;
    }
    if (url.endsWith("/Guia") || url.endsWith("/Gira") || url.endsWith("/User/register")) {
      await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "mock fallback" }) });
      return;
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ token: tokenFor("user") }) });
  });
}

test.describe("navegação e acesso", () => {
  test("exibe o site público da Casa", async ({ page }) => {
    await page.route("**/api/instagram", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [] }) });
    });
    await page.goto("/site", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Um espaço para cuidar, aprender e caminhar junto." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Siga a Casa/ })).toHaveAttribute("href", "https://www.instagram.com/tendasaojeronimo_/");
    await expect(page.locator('#instagram [data-behold-id="G0YuxFIQ3sjEBD23Fppk"]')).toBeVisible();
    await expect(page.locator('script[src="https://w.behold.so/widget.js"]')).toHaveCount(1);
  });

  test("redireciona a raiz para login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Entrar na sua conta" })).toBeVisible();
  });

  test("protege o dashboard sem autenticação", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("exibe página 404 para rota desconhecida", async ({ page }) => {
    await page.goto("/rota-inexistente");
    await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
  });
});

test.describe("autenticação", () => {
  test("faz login e abre o dashboard", async ({ page }) => {
    await page.route(`${apiUrl}/User/login`, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ token: tokenFor("user") }) });
    });
    await page.goto("/login");
    await page.getByLabel("Usuário, e-mail ou telefone").fill("teste");
    await page.getByLabel("Senha").fill("senha-segura");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: "Bem-vindo(a) à Casa de Axé" })).toBeVisible();
  });

  test("valida confirmação de senha no cadastro", async ({ page }) => {
    await page.goto("/cadastro");
    await page.getByLabel("Nome completo *").fill("Pessoa Teste");
    await page.getByLabel("E-mail *").fill("pessoa@teste.com");
    await page.getByLabel("Usuário *").fill("pessoa");
    await page.getByLabel("Senha *", { exact: true }).fill("123456");
    await page.getByLabel("Confirmar senha *").fill("654321");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Criar conta" }).click();
    await expect(page.getByRole("alert")).toHaveText("As senhas não coincidem.");
  });
});

test.describe("módulos autenticados", () => {
  test.beforeEach(async ({ page }) => { await mockApi(page); await loginAs(page, "admin"); });

  test("cria e pesquisa um guia", async ({ page }) => {
    await page.goto("/guias", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Novo guia" }).click();
    await page.getByLabel("Nome do guia *").fill("Caboclo Teste");
    await page.getByLabel("Linha de trabalho *").selectOption({ label: "Caboclo" });
    await page.getByRole("button", { name: "Salvar guia" }).click();
    await expect(page.getByRole("heading", { name: "Caboclo Teste" })).toBeVisible();
    await page.getByLabel("Buscar guias").fill("Caboclo Teste");
    await expect(page.getByRole("heading", { name: "Caboclo Teste" })).toBeVisible();
  });

  test("cria uma gira no calendário", async ({ page }) => {
    await page.goto("/calendario", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Nova gira" }).click();
    await page.getByLabel("Data e hora *").fill("2030-12-10T20:00");
    await page.getByLabel("Título *").fill("Gira de Teste");
    await page.getByLabel("Linha da gira *").selectOption({ index: 1 });
    await page.getByRole("button", { name: "Salvar gira" }).click();
    await expect(page.getByRole("heading", { name: "Gira de Teste" })).toBeVisible();
    await expect(page.getByText("Exu", { exact: true })).toBeVisible();
  });

  test("administra usuários", async ({ page }) => {
    await page.goto("/usuarios", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("table").getByText("Mãe Joana")).toBeVisible();
    await page.getByRole("button", { name: "Novo membro" }).click();
    await page.getByLabel("Nome completo").fill("Novo Membro");
    await page.getByLabel("E-mail").fill("membro@casa.test");
    await page.getByRole("textbox", { name: "Usuário *" }).fill("membro");
    await page.getByRole("textbox", { name: "Senha *", exact: true }).fill("123456");
    await page.getByRole("button", { name: "Salvar membro" }).click();
    await expect(page.getByRole("cell").filter({ hasText: "Novo Membro" }).first()).toBeVisible();
  });
});
