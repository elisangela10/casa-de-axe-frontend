import api from "./api";
import { getCurrentUser, type AuthUser } from "../auth/token";
import { cargoCasaPorId } from "../constants/cargosCasa";

export type UserProfile = AuthUser & {
  id: number | string;
  roleId?: number | string;
};

type RawUser = Record<string, unknown>;

function asText(value: unknown) {
  return typeof value === "string" ? value : value == null ? undefined : String(value);
}

export function roleNameFromId(value: unknown) {
  return cargoCasaPorId(value);
}

function normalizeUser(value: RawUser): UserProfile {
  return {
    id: (value.id ?? value.Id ?? value.userId ?? value.UserId ?? "") as number | string,
    roleId: (value.roleId ?? value.RoleId) as number | string | undefined,
    nomeCompleto: asText(value.nomeCompleto ?? value.NomeCompleto ?? value.name ?? value.Name),
    username: asText(value.username ?? value.Username ?? value.userName ?? value.UserName),
    email: asText(value.email ?? value.Email),
    telefone: asText(value.telefone ?? value.Telefone ?? value.phone),
    role: asText(value.role ?? value.Role) || roleNameFromId(value.roleId ?? value.RoleId),
    roleNome: asText(value.roleNome ?? value.RoleNome ?? value.roleName ?? value.RoleName) || roleNameFromId(value.roleId ?? value.RoleId),
    statusNome: asText(value.statusNome ?? value.StatusNome ?? value.status ?? value.Status),
  };
}

function extractUsers(data: unknown): UserProfile[] {
  if (Array.isArray(data)) return data.map((item) => normalizeUser(item as RawUser));
  if (data && typeof data === "object") {
    const value = data as { data?: unknown; items?: unknown; result?: unknown };
    const list = value.data ?? value.items ?? value.result;
    if (Array.isArray(list)) return list.map((item) => normalizeUser(item as RawUser));
    return [normalizeUser(data as RawUser)];
  }
  return [];
}

function sameUser(user: UserProfile, current: AuthUser) {
  const currentId = current.id == null ? "" : String(current.id);
  const userId = String(user.id);
  return (currentId && userId === currentId)
    || (!!current.username && user.username?.toLowerCase() === current.username.toLowerCase())
    || (!!current.email && user.email?.toLowerCase() === current.email.toLowerCase());
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const current = getCurrentUser();
  if (!current) return null;

  const response = await api.get("/User/GetUser", { requiresAuth: true });
  return extractUsers(response.data).find((user) => sameUser(user, current)) || null;
}
