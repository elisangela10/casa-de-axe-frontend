const TOKEN_KEY = "auth_token";

export type AuthUser = {
    id?: number | string;
    nomeCompleto?: string;
    username?: string;
    role?: string;
    roleNome?: string;
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
        nomeCompleto: (payload["name"] ?? payload["nomeCompleto"]) as string | undefined,
        username: payload["unique_name"] as string | undefined,
        role: (payload.role ?? payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) as string | undefined,
        roleNome: payload.roleNome as string | undefined,
    };
}

export function hasRole(roles: string[]): boolean {
    const user = getCurrentUser();
    const role = (user?.roleNome || user?.role || "").toLowerCase();
    return roles.some((allowedRole) => allowedRole.toLowerCase() === role);
}
