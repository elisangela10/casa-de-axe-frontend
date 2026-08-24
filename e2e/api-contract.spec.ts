import { expect, test, type Page } from "@playwright/test";

const apiUrl = "http://localhost:5000/api";

function tokenFor(role = "admin") {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode({ sub: "1", role, exp: Math.floor(Date.now() / 1000) + 3600 })}.test`;
}

async function authenticate(page: Page) {
  await page.goto("/login");
  await page.evaluate((token: string) => localStorage.setItem("auth_token", token), tokenFor());
}

test("cria ponto com JSON e JWT Bearer", async ({ page }) => {
  await page.route(`${apiUrl}/TextoPonto`, async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
      return;
    }

    const headers = route.request().headers();
    expect(headers.authorization).toMatch(/^Bearer /);
    expect(headers["content-type"]).toContain("application/json");
    expect(route.request().postDataJSON().dataHora).toBeTruthy();
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ id: 99, tituloDoponto: "Ponto E2E", categoriaDoPontos: "Exu / Pombagira", letraDoPonto: "Saravá" }),
    });
  });
  await authenticate(page);
  await page.goto("/pontos");
  await page.getByRole("button", { name: "Novo Ponto" }).click();
  await page.locator('input[type="text"]').last().fill("Ponto E2E");
  await page.locator("select").last().selectOption({ index: 1 });
  await page.locator("textarea").fill("Saravá");
  await page.getByRole("button", { name: "Cadastrar Ponto" }).click();
  await expect(page.getByText("Ponto E2E", { exact: true })).toBeVisible();
});

test("redireciona uma operação autenticada após 401", async ({ page }) => {
  await page.route(`${apiUrl}/TextoPonto`, async (route) => {
    await route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ message: "Unauthorized" }) });
  });
  await authenticate(page);
  await page.goto("/pontos");
  await expect(page).toHaveURL(/\/login$/);
});

test("exibe mensagem amigável quando o Instagram retorna 503", async ({ page }) => {
  await page.route(`${apiUrl}/instagram`, async (route) => {
    await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: { code: "INSTAGRAM_NOT_CONFIGURED" } }) });
  });
  await page.goto("/site");
  await expect(page.getByText("O feed está temporariamente indisponível. Tente novamente mais tarde.")).toBeVisible();
});

test("reflete no calendário os campos nome e dataHora da API", async ({ page }) => {
  await page.route(`${apiUrl}/Gira`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: 7, nome: "Gira retornada pela API", dataHora: "2030-12-10T20:00:00Z", cura: "Caboclo", responsavel: "Pai da Casa", descricao: "Encontro da Casa", status: "Ativo", dataCriacao: "2030-01-01T12:00:00Z" }]),
    });
  });
  await authenticate(page);
  await page.goto("/calendario");
  await expect(page.getByRole("heading", { name: "Gira retornada pela API" })).toBeVisible();
  await expect(page.getByText("Caboclo", { exact: true })).toBeVisible();
});

test("exibe a próxima gira no site público usando dataHora", async ({ page }) => {
  await page.route(`${apiUrl}/Gira`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: 8, nome: "Próxima gira pública", dataHora: "2030-12-10T20:00:00Z", cura: "Caboclo" }]),
    });
  });
  await page.route(`${apiUrl}/TextoPonto`, async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  });
  await page.route(`${apiUrl}/instagram`, async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [] }) });
  });
  await page.goto("/site");
  await expect(page.getByRole("heading", { name: "Próxima gira pública" })).toBeVisible();
});
