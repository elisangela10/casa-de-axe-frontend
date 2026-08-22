import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nomeCompleto: "", email: "", telefone: "", username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => setFormData((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError("");
    if (formData.password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; }
    if (formData.password !== formData.confirmPassword) { setError("As senhas não coincidem."); return; }
    setLoading(true);
    try {
      const { confirmPassword: _, ...data } = formData;
      await api.post("/User/register", { ...data, role: "user", status: "ativo", id: 0 }, { requiresAuth: false });
      navigate("/login", { replace: true });
    } catch { setError("Não foi possível criar a conta. Verifique os dados ou se o usuário já existe."); } finally { setLoading(false); }
  };

  return <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-950 via-stone-900 to-emerald-950 p-4"><section className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10"><div className="mb-8 text-center"><img src="/images/logo.svg" alt="Casa de Axé" className="mx-auto h-14 w-auto" /><p className="mt-5 text-sm font-semibold uppercase tracking-wider text-amber-700">Criar acesso</p><h1 className="mt-2 text-3xl font-bold text-gray-900">Faça parte da Casa</h1><p className="mt-2 text-sm text-gray-500">Preencha seus dados para solicitar seu acesso.</p></div><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-gray-700">Nome completo *</label><input id="nome" required value={formData.nomeCompleto} onChange={update("nomeCompleto")} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200" /></div><div><label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">E-mail *</label><input id="email" type="email" required value={formData.email} onChange={update("email")} autoComplete="email" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200" /></div><div><label htmlFor="telefone" className="mb-1.5 block text-sm font-medium text-gray-700">Telefone</label><input id="telefone" value={formData.telefone} onChange={update("telefone")} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200" /></div><div><label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-700">Usuário *</label><input id="username" required value={formData.username} onChange={update("username")} autoComplete="username" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200" /></div><div><label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">Senha *</label><input id="password" type="password" required value={formData.password} onChange={update("password")} autoComplete="new-password" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200" /></div><div><label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-gray-700">Confirmar senha *</label><input id="confirm-password" type="password" required value={formData.confirmPassword} onChange={update("confirmPassword")} autoComplete="new-password" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200" /></div><label className="flex items-start gap-2 text-sm text-gray-600 sm:col-span-2"><input type="checkbox" required className="mt-1 rounded border-gray-300 text-amber-700 focus:ring-amber-500" />Concordo com os termos de uso da Casa.</label>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-amber-700 px-4 py-3 font-semibold text-white hover:bg-amber-800 disabled:opacity-60 sm:col-span-2">{loading ? "Criando conta..." : "Criar conta"}</button></form><p className="mt-8 text-center text-sm text-gray-600">Já possui acesso? <Link to="/login" className="font-semibold text-amber-700 hover:text-amber-900">Entrar</Link></p></section></main>;
}
