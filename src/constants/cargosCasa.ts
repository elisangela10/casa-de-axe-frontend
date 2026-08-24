export const CARGOS_CASA = [
  { id: 1, nome: "ADM", label: "Administrador" },
  { id: 2, nome: "PaiDeSanto", label: "Pai de Santo" },
  { id: 3, nome: "Filho", label: "Filho" },
  { id: 4, nome: "Assistencia", label: "Assistência" },
] as const;

export type CargoCasa = typeof CARGOS_CASA[number]["nome"];

export function cargoCasaPorId(value: unknown) {
  return CARGOS_CASA.find((cargo) => cargo.id === Number(value))?.nome;
}

export function cargoCasaPorNome(value: unknown): CargoCasa | undefined {
  const normalized = String(value ?? "").toLowerCase().replace(/[ _-]/g, "");
  return CARGOS_CASA.find((cargo) => [cargo.nome, cargo.label].some((name) => name.toLowerCase().replace(/[ _-]/g, "") === normalized))?.nome;
}

export function idDoCargoCasa(value: unknown) {
  const nome = cargoCasaPorNome(value);
  return CARGOS_CASA.find((cargo) => cargo.nome === nome)?.id;
}
