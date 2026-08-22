import api from "./api";

export type Gira = {
  id: number;
  data: string;
  titulo: string;
  guiaCura: string;
  descricao?: string;
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
    data: asString(value.data ?? value.Data ?? value.dataGira ?? value.DataGira ?? value.startsAt ?? value.StartsAt),
    titulo: asString(value.titulo ?? value.Titulo ?? value.tituloGira ?? value.TituloGira ?? value.title ?? value.Title),
    guiaCura: asString(value.guiaCura ?? value.GuiaCura ?? value.guia ?? value.Guia ?? value.responsibleGuide ?? value.ResponsibleGuide),
    descricao: asString(value.descricao ?? value.Descricao ?? value.description ?? value.Description),
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

export function getGirasEndpoint(): string {
  return ENDPOINT;
}
