import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Pontos from "../pages/Pontos";
import Usuarios from "../pages/Usuarios";
import Guias from "../pages/Guias";
import Calendario from "../pages/Calendario";
import NotFound from "../pages/NotFound";
import SitePublico from "../pages/SitePublico";
import PrivateRoute from "../components/PrivateRoute";
import InstagramFeed from "../components/InstagramFeed";

function SiteComInstagram() {
  return <><SitePublico /><InstagramFeed targetSelector="#instagram" /></>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/site" element={<SiteComInstagram />} />
        <Route path="/Site" element={<Navigate to="/site" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/pontos" element={<PrivateRoute><Pontos /></PrivateRoute>} />
        <Route path="/usuarios" element={<PrivateRoute roles={["admin", "administrador"]}><Usuarios /></PrivateRoute>} />
        <Route path="/guias" element={<PrivateRoute><Guias /></PrivateRoute>} />
        <Route path="/calendario" element={<PrivateRoute><Calendario /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
