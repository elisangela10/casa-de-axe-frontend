import axios from "axios";

const api = axios.create({
  baseURL: "https://casadeaxe-api.onrender.com/api", // Ajustado para desenvolvimento local
});

export default api;
