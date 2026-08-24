const TOKEN_KEY = "auth_token";

export type AuthUser = {
    id?: number | string;
    nomeCompleto?: string;
    username?: string;
    email?: string;
    telefone?: string;
    role?: string;
    roleNome?: string;
    statusNome?: string;
};

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string, rememberMe: boolean): void {
    clearToken();

    if (rememberMe) {
        localStorage.setItem(TOKEN_KEY, token);
        return;
    }

    sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    const token = getToken();
    if (!token) return false;
    const payload = decodePayload(token);
    if (typeof payload?.exp === "number" && payload.exp <= Math.floor(Date.now() / 1000)) {
        clearToken();
        return false;
    }
    return true;
}

function decodePayload(token: string): Record<string, unknown> | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(window.atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")));
    } catch {
        return null;
    }
}

export function getCurrentUser(): AuthUser | null {
    const token = getToken();
    if (!token) return null;

    const payload = decodePayload(token);
    if (!payload) return null;
    if (typeof payload.exp === "number" && payload.exp <= Math.floor(Date.now() / 1000)) return null;

    return {
        id: (payload.sub ?? payload["nameid"]) as string | undefined,
        nomeCompleto: (payload["name"] ?? payload["nomeCompleto"] ?? payload["nomeCompletoUsuario"]) as string | undefined,
        username: (payload["unique_name"] ?? payload["preferred_username"] ?? payload["username"]) as string | undefined,
        email: (payload["email"] ?? payload["emailaddress"]) as string | undefined,
        telefone: (payload["phone_number"] ?? payload["telefone"]) as string | undefined,
        role: (payload.role ?? payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) as string | undefined,
        roleNome: (payload.roleNome ?? payload["role_name"]) as string | undefined,
        statusNome: (payload.statusNome ?? payload["status"]) as string | undefined,
    };
}

export function hasRole(roles: string[]): boolean {
    return hasUserRole(getCurrentUser(), roles);
}

export function hasUserRole(user: AuthUser | null, roles: string[]): boolean {
    const role = (user?.roleNome || user?.role || "").toLowerCase().trim();
    return roles.some((allowedRole) => {
        const allowed = allowedRole.toLowerCase().trim();
        return role === allowed
            || role.endsWith(`_${allowed}`)
            || (allowed === "admin" && role.includes("admin"))
            || (allowed === "admin" && role === "adm")
            || (allowed === "administrador" && role.includes("administrador"));
    });
}
