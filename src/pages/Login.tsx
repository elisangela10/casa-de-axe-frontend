import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import { saveToken } from "../auth/token";

function getLoginErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Não foi possível conectar à API. Verifique se o backend está em execução e se VITE_API_URL está correto.";
    }

    const status = error.response.status;
    const apiMessage = error.response.data?.message;

    if (status === 401) return apiMessage || "Usuário ou senha inválidos.";
    if (status === 400) return apiMessage || "Confira os dados informados para entrar.";
    if (status === 404) return "Endpoint de login não encontrado. Verifique a URL da API.";
    return apiMessage || `A API retornou um erro (${status}). Tente novamente mais tarde.`;
  }

  if (error instanceof Error && error.message === "invalid_response") {
    return "A API respondeu sem fornecer um token de acesso.";
  }

  return "Não foi possível concluir o login. Tente novamente.";
}

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); setError("");
    if (!login.trim() || !password) { setError("Informe seu usuário ou e-mail e sua senha."); return; }
    setLoading(true);
    try {
      const response = await api.post("/User/login", { login: login.trim(), password }, { requiresAuth: false });
      if (!response.data?.token) throw new Error("invalid_response");
      saveToken(response.data.token, rememberMe); navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(getLoginErrorMessage(error));
    } finally { setLoading(false); }
  };

  return <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-950 via-stone-900 to-emerald-950 p-4"><div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2"><section className="hidden flex-col justify-between bg-amber-900 p-10 text-white md:flex"><div><img src="/images/logo-white.svg" alt="Casa de Axé" className="h-14 w-auto" /><p className="mt-16 text-sm font-semibold uppercase tracking-[.2em] text-amber-200">Gestão da Casa</p><h1 className="mt-4 text-4xl font-bold leading-tight">Tudo o que a Casa precisa, em um só lugar.</h1><p className="mt-5 leading-7 text-amber-100">Organize giras, membros, guias e pontos cantados com cuidado e simplicidade.</p></div><p className="text-sm text-amber-200">Ilê Tenda São Gerônimo</p></section><section className="p-6 sm:p-10"><div className="mb-8 md:hidden"><img src="/images/logo.svg" alt="Casa de Axé" className="mx-auto h-14 w-auto" /></div><div className="mx-auto max-w-md"><p className="text-sm font-semibold uppercase tracking-wider text-amber-700">Bem-vindo de volta</p><h2 className="mt-2 text-3xl font-bold text-gray-900">Entrar na sua conta</h2><p className="mt-2 text-sm text-gray-500">Acesse o painel administrativo da Casa.</p><form onSubmit={handleLogin} className="mt-8 space-y-5"><div><label htmlFor="login" className="mb-1.5 block text-sm font-medium text-gray-700">Usuário, e-mail ou telefone</label><input id="login" type="text" required value={login} onChange={(event) => setLogin(event.target.value)} autoComplete="username" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-200" /></div><div><label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">Senha</label><input id="password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-200" /></div><div className="flex items-center justify-between gap-4 text-sm"><label className="flex items-center gap-2 text-gray-600"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="rounded border-gray-300 text-amber-700 focus:ring-amber-500" />Lembrar de mim</label><span className="text-gray-400">Esqueceu a senha? Fale com a direção.</span></div>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-amber-700 px-4 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Entrando..." : "Entrar"}</button></form><p className="mt-8 text-center text-sm text-gray-600">Ainda não tem uma conta? <Link to="/cadastro" className="font-semibold text-amber-700 hover:text-amber-900">Criar conta</Link></p></div></section></div></main>;
}
