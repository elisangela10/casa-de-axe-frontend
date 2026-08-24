export const LINHAS_CASA = [
  "Exu",
  "Pombagira",
  "Preto Velho",
  "Caboclo",
  "Er\u00EA",
  "Baiano",
  "Boiadeiro",
  "Marinheiro",
  "Malandro",
  "Exu Mirim",
  "Cigano",
  "Orix\u00E1",
  "Outro",
] as const;

export type LinhaCasa = typeof LINHAS_CASA[number];

const CORES_LINHAS: Record<string, string> = {
  "Exu": "bg-red-100 text-red-700",
  "Pombagira": "bg-pink-100 text-pink-700",
  "Preto Velho": "bg-stone-100 text-stone-700",
  "Caboclo": "bg-green-100 text-green-700",
  "Er\u00EA": "bg-yellow-100 text-yellow-700",
  "Baiano": "bg-blue-100 text-blue-700",
  "Boiadeiro": "bg-orange-100 text-orange-700",
  "Marinheiro": "bg-cyan-100 text-cyan-700",
  "Malandro": "bg-purple-100 text-purple-700",
  "Exu Mirim": "bg-violet-100 text-violet-700",
  "Cigano": "bg-fuchsia-100 text-fuchsia-700",
  "Orix\u00E1": "bg-amber-100 text-amber-700",
  "Outro": "bg-gray-100 text-gray-600",
};

export function getLinhaCasaColor(value: string) {
  const direct = CORES_LINHAS[value.trim()];
  if (direct) return direct;

  const category = value.trim().toLocaleLowerCase("pt-BR");
  if (category.includes("pombagira")) return CORES_LINHAS["Pombagira"];
  if (category.includes("exu mirim")) return CORES_LINHAS["Exu Mirim"];
  if (category.includes("exu")) return CORES_LINHAS["Exu"];
  if (category.includes("cigano")) return CORES_LINHAS["Cigano"];
  if (category.includes("preto velho")) return CORES_LINHAS["Preto Velho"];
  if (category.includes("caboclo")) return CORES_LINHAS["Caboclo"];
  if (category.includes("er\u00EA") || category.includes("er\u00E3") || category.includes("ere")) return CORES_LINHAS["Er\u00EA"];
  if (category.includes("baiano")) return CORES_LINHAS["Baiano"];
  if (category.includes("boiadeiro")) return CORES_LINHAS["Boiadeiro"];
  if (category.includes("marinheiro")) return CORES_LINHAS["Marinheiro"];
  if (category.includes("malandro") || category.includes("pelintra")) return CORES_LINHAS["Malandro"];
  if (category.includes("orix")) return CORES_LINHAS["Orix\u00E1"];
  return CORES_LINHAS["Outro"];
}
