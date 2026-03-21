import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7218/api", // Ajustado para desenvolvimento local
});

export default api;
