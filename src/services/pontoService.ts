import api from "./api";

export type Ponto = {
  id: number;
  tituloDoponto: string;
  linkDoYouTube: string;
  letraDoPonto: string;
  categoriaDoPontos: string;
  dataHora?: string;
};

export type PontoPayload = Omit<Ponto, "id"> & { dataHora?: string };

function withRequiredDate(payload: PontoPayload): PontoPayload {
  return { ...payload, dataHora: payload.dataHora || new Date().toISOString() };
}

function normalizePonto(value: Partial<Ponto>): Ponto {
  return {
    id: Number(value.id) || Date.now(),
    tituloDoponto: value.tituloDoponto || "Ponto cantado",
    linkDoYouTube: value.linkDoYouTube || "",
    letraDoPonto: value.letraDoPonto || "",
    categoriaDoPontos: value.categoriaDoPontos || "Outro",
    dataHora: value.dataHora,
  };
}

function listFromResponse(data: unknown): Ponto[] {
  if (Array.isArray(data)) return data.map((item) => normalizePonto(item as Partial<Ponto>));
  if (data && typeof data === "object") {
    const value = data as { data?: unknown; items?: unknown; result?: unknown };
    const list = value.data ?? value.items ?? value.result;
    if (Array.isArray(list)) return list.map((item) => normalizePonto(item as Partial<Ponto>));
  }
  return [];
}

export async function listPontos() {
  const response = await api.get<Ponto[]>("/TextoPonto", { requiresAuth: true });
  return listFromResponse(response.data);
}

export async function getPonto(id: number) {
  const response = await api.get<Ponto>(`/TextoPonto/${id}`, { requiresAuth: true });
  return normalizePonto(response.data);
}

export async function createPonto(payload: PontoPayload) {
  const response = await api.post<Ponto>("/TextoPonto", withRequiredDate(payload), { requiresAuth: true });
  return normalizePonto(response.data);
}

export async function updatePonto(id: number, payload: PontoPayload) {
  const response = await api.put<Ponto>(`/TextoPonto/${id}`, withRequiredDate(payload), { requiresAuth: true });
  return normalizePonto(response.data);
}

export async function deletePonto(id: number) {
  await api.delete(`/TextoPonto/${id}`, { requiresAuth: true });
}
