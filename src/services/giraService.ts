import api from "./api";

export type Gira = {
  id: number;
  data: string;
  titulo: string;
  guiaCura: string;
  descricao?: string;
  linha?: string;
};

export type GiraForm = {
  data: string;
  titulo: string;
  guiaCura: string;
  descricao: string;
  linha: string;
};

type RawGira = Record<string, unknown>;

const ENDPOINT = import.meta.env.VITE_GIRAS_ENDPOINT || "/Gira";

function asString(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function asId(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Date.now();
}

export function normalizeGira(value: RawGira): Gira {
  return {
    id: asId(value.id ?? value.Id ?? value.giraId ?? value.GiraId),
    data: asString(value.data ?? value.Data ?? value.dataGira ?? value.DataGira ?? value.dataHora ?? value.DataHora ?? value.startsAt ?? value.StartsAt),
    titulo: asString(value.titulo ?? value.Titulo ?? value.tituloGira ?? value.TituloGira ?? value.nome ?? value.Nome ?? value.name ?? value.Name ?? value.title ?? value.Title),
    guiaCura: asString(value.guiaCura ?? value.GuiaCura ?? value.guia ?? value.Guia ?? value.cura ?? value.Cura ?? value.responsavel ?? value.Responsavel ?? value.responsibleGuide ?? value.ResponsibleGuide),
    descricao: asString(value.descricao ?? value.Descricao ?? value.description ?? value.Description),
    linha: asString(value.linha ?? value.Linha ?? value.linhaGira ?? value.LinhaGira ?? value.categoria ?? value.Categoria ?? value.category ?? value.Category),
  };
}

function extractList(data: unknown): RawGira[] {
  if (Array.isArray(data)) return data as RawGira[];
  if (!data || typeof data !== "object") return [];
  const response = data as Record<string, unknown>;
  const list = response.data ?? response.items ?? response.result ?? response.results ?? response.giras ?? response.Giras;
  return Array.isArray(list) ? list as RawGira[] : [];
}

export async function listGiras(): Promise<Gira[]> {
  const response = await api.get(ENDPOINT, { requiresAuth: false });
  return extractList(response.data)
    .map(normalizeGira)
    .filter((gira) => gira.id && gira.data && gira.titulo);
}

function toApiPayload(form: GiraForm) {
  return {
    nome: form.titulo.trim(),
    descricao: form.descricao.trim(),
    cura: form.guiaCura.trim(),
    responsavel: form.guiaCura.trim(),
    linha: form.linha.trim(),
    dataHora: new Date(form.data).toISOString(),
  };
}

export async function createGira(form: GiraForm): Promise<Gira> {
  const response = await api.post(ENDPOINT, toApiPayload(form));
  return normalizeGira(response.data);
}

export async function updateGira(id: number, form: GiraForm): Promise<Gira> {
  const response = await api.put(`${ENDPOINT}/${id}`, {
    ...toApiPayload(form),
    status: 1,
  });
  return normalizeGira(response.data);
}

export async function deleteGira(id: number) {
  await api.delete(`${ENDPOINT}/${id}`);
}

export function getGirasEndpoint(): string {
  return ENDPOINT;
}
