import { Link, useLocation, useNavigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { clearToken, getCurrentUser, hasUserRole } from "../auth/token";
import { getCurrentUserProfile, type UserProfile } from "../services/userService";
import { useState } from "react";
import { useEffect } from "react";
import { APP_VERSION } from "../config/version";
import PushNotificationButton from "../components/PushNotificationButton";



export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem("casa_sidebar_collapsed") === "true");
  const [user, setUser] = useState<UserProfile | ReturnType<typeof getCurrentUser>>(getCurrentUser());
  const profileRole = (user?.roleNome || user?.role || "").toLowerCase();
  const isAdmin = hasUserRole(user, ["admin", "administrador"])
    || profileRole === "adm";

  useEffect(() => {
    let active = true;
    void getCurrentUserProfile().then((profile) => {
      if (active && profile) setUser(profile);
    }).catch(() => {
      // O JWT continua sendo usado como fallback para renderizar o cabeçalho.
    });
    return () => { active = false; };
  }, []);

  const menuItems = [
    { path: "/dashboard", icon: "bi-house-door", label: "Dashboard" },
    { path: "/calendario", icon: "bi-calendar-event", label: "Calendário de Giras" },
    { path: "/guias", icon: "bi-star", label: "Meus Guias" },
    { path: "/pontos", icon: "bi-music-note-list", label: "Meus Pontos" },
    ...(isAdmin ? [{ path: "/usuarios", icon: "bi-people", label: "Usuários" }] : []),
  ];
  const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };
  const toggleSidebar = () => {
    setSidebarCollapsed((collapsed) => {
      const next = !collapsed;
      localStorage.setItem("casa_sidebar_collapsed", String(next));
      return next;
    });
  };
  return (

    <div className="flex h-screen bg-gray-50">
      <Analytics />
      {/* Sidebar / Menu Lateral */}
      {mobileMenuOpen && <button aria-label="Fechar menu" className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200 bg-white transition-all duration-200 md:static md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} ${sidebarCollapsed ? "md:w-20" : "md:w-72"}`}>
        <div className={`flex h-20 items-center border-b border-gray-200 ${sidebarCollapsed ? "justify-center" : "justify-center"}`}>
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-xl font-bold text-amber-700">
            <img src="/images/logo.svg" alt="Casa de Axé" className="h-10 w-auto" />
            {!sidebarCollapsed && <span>Casa de Axé</span>}
          </Link>
        </div>
        <nav className={`flex-1 space-y-2 overflow-y-auto ${sidebarCollapsed ? "p-3" : "p-4"}`}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              aria-label={sidebarCollapsed ? item.label : undefined}
              title={sidebarCollapsed ? item.label : undefined}
              className={`flex items-center rounded-lg py-3 text-sm font-medium transition-colors ${sidebarCollapsed ? "justify-center px-2" : "px-4"} ${location.pathname === item.path
                ? "bg-amber-100 text-amber-800"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <i className={`${item.icon} text-lg ${sidebarCollapsed ? "" : "mr-3"}`}></i>
              {!sidebarCollapsed && item.label}
            </Link>
          ))}
        </nav>
        <div className={`border-t border-gray-200 ${sidebarCollapsed ? "p-3" : "p-4"}`}>
          {!sidebarCollapsed && <p className="mb-2 text-center text-[10px] uppercase tracking-wider text-gray-400">Versão {APP_VERSION}</p>}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Expandir menu" : "Minimizar menu"}
            title={sidebarCollapsed ? "Expandir menu" : "Minimizar menu"}
            className="mb-2 flex w-full items-center justify-center rounded-lg px-2 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <i className={`${sidebarCollapsed ? "bi-chevron-right" : "bi-chevron-left"} text-lg`} />
          </button>

          <button
            onClick={handleLogout}
            aria-label="Sair"
            title={sidebarCollapsed ? "Sair" : undefined}
            className={`flex w-full items-center rounded-lg py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 ${sidebarCollapsed ? "justify-center px-2" : "px-4"}`}
          >
            <i className={`bi-box-arrow-right text-lg ${sidebarCollapsed ? "" : "mr-3"}`}></i>
            {!sidebarCollapsed && "Sair"}
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header (Topbar) */}
        <header className="flex min-h-20 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button aria-label="Abrir menu" onClick={() => setMobileMenuOpen(true)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden">
              <i className="bi-list text-2xl" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 md:text-xl">
            {menuItems.find((m) => m.path === location.pathname)?.label || "Página"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <PushNotificationButton />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-800">{user?.nomeCompleto || user?.username || "Usuário"}</p>
              <p className="text-xs text-gray-500">{user?.roleNome || user?.role || "Membro"}</p>
              {user?.email && <p className="hidden text-[11px] text-gray-400 lg:block">{user.email}</p>}
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 font-bold text-white" aria-hidden="true">
              {(user?.nomeCompleto || user?.username || "CA").slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Área do conteúdo (onde as telas entram) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>

    </div >



  );
}
