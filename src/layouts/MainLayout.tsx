import { Link, useLocation, useNavigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { clearToken } from "../auth/token";



export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard", icon: "bi-house-door", label: "Dashboard" },
    { path: "/calendario", icon: "bi-calendar-event", label: "Calendário de Giras" },
    { path: "/usuarios", icon: "bi-people", label: "Usuários" },
    { path: "/guias", icon: "bi-star", label: "Meus Guias" },
    { path: "/pontos", icon: "bi-music-note-list", label: "Meus Pontos" },
  ];
  const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };
  return (

    <div className="flex h-screen bg-gray-50">
      <Analytics />
      {/* Sidebar / Menu Lateral */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="flex items-center justify-center h-20 border-b border-gray-200">
          <h1 className="text-xl font-bold text-amber-700">Casa de Axé</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Topbar) */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {menuItems.find((m) => m.path === location.pathname)?.label || "Página"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
              CA
            </div>
          </div>
        </header>

        {/* Área do conteúdo (onde as telas entram) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

    </div >



  );
}
