import { Link, useLocation, useNavigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { clearToken, getCurrentUser, hasRole } from "../auth/token";
import { useState } from "react";



export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = getCurrentUser();
  const isAdmin = hasRole(["admin", "administrador"]);

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
  return (

    <div className="flex h-screen bg-gray-50">
      <Analytics />
      {/* Sidebar / Menu Lateral */}
      {mobileMenuOpen && <button aria-label="Fechar menu" className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform md:static md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-center h-20 border-b border-gray-200">
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-xl font-bold text-amber-700">
            <img src="/images/logo.svg" alt="Casa de Axé" className="h-10 w-auto" />
            <span>Casa de Axé</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === item.path
                ? "bg-amber-100 text-amber-800"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <i className={`${item.icon} text-lg mr-3`}></i>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">

          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <i className="bi-box-arrow-right text-lg mr-3"></i>
            Sair
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
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-800">{user?.nomeCompleto || user?.username || "Usuário"}</p>
              <p className="text-xs text-gray-500">{user?.roleNome || user?.role || "Membro"}</p>
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
