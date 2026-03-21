import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
export default function Pontos() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container mt-4">
        <h2>Pontos</h2>
        <p>Bem-vindo à área de Pontos.</p>
      </div>
    </MainLayout>
  );
}