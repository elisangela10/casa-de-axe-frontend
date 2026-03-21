import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Pontos from "../pages/Pontos";
import Usuarios from "../pages/Usuarios";
import Guias from "../pages/Guias";
import Calendario from "../pages/Calendario";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pontos" element={<Pontos />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/guias" element={<Guias />} />
        <Route path="/calendario" element={<Calendario />} />
      </Routes>
    </BrowserRouter>
  );
}
