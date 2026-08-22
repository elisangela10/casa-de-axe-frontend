import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { readLocal, writeLocal } from "../lib/localStore";

type User = { id: number; nomeCompleto: string; email: string; telefone?: string; username: string; roleNome: string; statusNome: string };
type UserForm = { nomeCompleto: string; email: string; telefone: string; username: string; password: string; role: string; status: string };
const STORAGE_KEY = "casa_de_axe_usuarios";
const ENDPOINT = import.meta.env.VITE_USUARIOS_ENDPOINT || "/User/GetUser";
const EMPTY: UserForm = { nomeCompleto: "", email: "", telefone: "", username: "", password: "", role: "user", status: "ativo" };

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>(() => readLocal(STORAGE_KEY, []));
  const [formData, setFormData] = useState(EMPTY);
  const [editId, setEditId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get(ENDPOINT).then(({ data }) => {
      const items = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      if (active && items.length) { setUsers(items); writeLocal(STORAGE_KEY, items); }
    }).catch(() => undefined).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => users.filter((user) => {
    const text = `${user.nomeCompleto} ${user.email} ${user.username} ${user.roleNome}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (!roleFilter || user.roleNome.toLowerCase().includes(roleFilter));
  }), [users, query, roleFilter]);
  const closeModal = () => { setModalOpen(false); setEditId(null); setFormData(EMPTY); setError(""); };
  const openNew = () => { setEditId(null); setFormData(EMPTY); setError(""); setModalOpen(true); };
  const openEdit = (user: User) => { setEditId(user.id); setFormData({ nomeCompleto: user.nomeCompleto, email: user.email, telefone: user.telefone || "", username: user.username, password: "", role: user.roleNome || "user", status: user.statusNome || "ativo" }); setModalOpen(true); };
  const normalize = (data: UserForm, id: number) => ({ id, nomeCompleto: data.nomeCompleto, email: data.email, telefone: data.telefone, username: data.username, roleNome: data.role, statusNome: data.status });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.nomeCompleto.trim() || !formData.email.trim() || !formData.username.trim() || (!editId && !formData.password)) { setError("Preencha os campos obrigatórios."); return; }
    setSaving(true); setError("");
    try {
      let saved: User;
      if (editId) {
        try { await api.put(`/User/${editId}`, { id: editId, ...formData }); } catch { /* fallback local */ }
        saved = normalize(formData, editId);
      } else {
        let responseData: User | null = null;
        try { const response = await api.post("/User/register", { id: 0, ...formData }); responseData = response.data; } catch { /* fallback local */ }
        saved = responseData || normalize(formData, Date.now());
      }
      const next = editId ? users.map((item) => item.id === editId ? saved : item) : [saved, ...users];
      setUsers(next); writeLocal(STORAGE_KEY, next); closeModal();
    } catch { setError("Não foi possível salvar o usuário."); } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja remover este usuário?")) return;
    try { await api.delete(`/User/${id}`); } catch { /* mantém fallback local */ }
    const next = users.filter((user) => user.id !== id); setUsers(next); writeLocal(STORAGE_KEY, next);
  };

  const badge = (role: string) => role.toLowerCase().includes("admin") || role.toLowerCase().includes("adm") ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800";
  return <MainLayout>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Usuários</h1><p className="mt-1 text-sm text-gray-600">Gerencie membros, cargos e status da Casa.</p></div><button onClick={openNew} className="rounded-lg bg-amber-700 px-4 py-2 font-medium text-white hover:bg-amber-800"><i className="bi-plus-lg mr-2" />Novo membro</button></div>
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50/70 p-4 sm:flex-row"><label className="relative flex-1" htmlFor="user-search"><i className="bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input id="user-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, e-mail ou cargo..." className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-amber-500" /></label><select aria-label="Filtrar por cargo" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-amber-500"><option value="">Todos os cargos</option><option value="admin">Administradores</option><option value="user">Usuários</option></select></div><div className="overflow-x-auto">{loading ? <div className="p-12 text-center text-gray-500"><i className="bi-arrow-repeat mr-2 animate-spin" />Carregando usuários...</div> : filtered.length === 0 ? <div className="p-12 text-center text-gray-500">Nenhum usuário encontrado.</div> : <table className="w-full min-w-[720px] text-left"><thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="p-4">Membro</th><th className="p-4">Contato</th><th className="p-4">Cargo</th><th className="p-4">Status</th><th className="p-4 text-right">Ações</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map((user) => <tr key={user.id} className="hover:bg-gray-50"><td className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700">{user.nomeCompleto.slice(0, 2).toUpperCase()}</div><div><p className="font-semibold text-gray-800">{user.nomeCompleto}</p><p className="text-xs text-gray-500">@{user.username}</p></div></div></td><td className="p-4 text-sm text-gray-700"><p>{user.email}</p><p className="text-xs text-gray-500">{user.telefone || "Sem telefone"}</p></td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge(user.roleNome || "user")}`}>{user.roleNome || "Usuário"}</span></td><td className="p-4"><span className={`inline-flex items-center gap-2 text-sm ${user.statusNome?.toLowerCase() === "ativo" ? "text-green-700" : "text-gray-500"}`}><span className={`h-2 w-2 rounded-full ${user.statusNome?.toLowerCase() === "ativo" ? "bg-green-500" : "bg-gray-400"}`} />{user.statusNome || "Ativo"}</span></td><td className="p-4 text-right"><button onClick={() => openEdit(user)} className="rounded-lg p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-700" title="Editar"><i className="bi-pencil-square" /></button><button onClick={() => remove(user.id)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-700" title="Remover"><i className="bi-trash" /></button></td></tr>)}</tbody></table>}</div><div className="border-t border-gray-200 p-4 text-sm text-gray-500">Mostrando <strong>{filtered.length}</strong> de <strong>{users.length}</strong> membros</div></section>
    {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="user-modal-title"><form onSubmit={submit} className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"><div className="flex items-center justify-between border-b border-gray-200 p-5"><h2 id="user-modal-title" className="font-bold text-gray-900">{editId ? "Editar membro" : "Novo membro"}</h2><button type="button" onClick={closeModal} aria-label="Fechar" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><i className="bi-x-lg" /></button></div><div className="grid gap-4 p-5 sm:grid-cols-2"><div><label htmlFor="user-name" className="mb-1 block text-sm font-medium">Nome completo *</label><input id="user-name" autoFocus required value={formData.nomeCompleto} onChange={(event) => setFormData({ ...formData, nomeCompleto: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5" /></div><div><label htmlFor="user-email" className="mb-1 block text-sm font-medium">E-mail *</label><input id="user-email" type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5" /></div><div><label htmlFor="user-phone" className="mb-1 block text-sm font-medium">Telefone</label><input id="user-phone" value={formData.telefone} onChange={(event) => setFormData({ ...formData, telefone: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5" /></div><div><label htmlFor="user-login" className="mb-1 block text-sm font-medium">Usuário *</label><input id="user-login" required value={formData.username} onChange={(event) => setFormData({ ...formData, username: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5" /></div><div><label htmlFor="user-password" className="mb-1 block text-sm font-medium">Senha {!editId && "*"}</label><input id="user-password" type="password" required={!editId} value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5" /></div><div><label htmlFor="user-role" className="mb-1 block text-sm font-medium">Cargo</label><select id="user-role" value={formData.role} onChange={(event) => setFormData({ ...formData, role: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5"><option value="user">Usuário</option><option value="admin">Administrador</option><option value="ogan">Ogan</option><option value="ekedi">Ekedi</option></select></div>{editId && <div><label htmlFor="user-status" className="mb-1 block text-sm font-medium">Status</label><select id="user-status" value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5"><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select></div>}{error && <p role="alert" className="sm:col-span-2 text-sm text-red-600">{error}</p>}</div><div className="flex justify-end gap-3 border-t border-gray-200 p-5"><button type="button" onClick={closeModal} className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">Cancelar</button><button disabled={saving} className="rounded-lg bg-amber-700 px-4 py-2 font-medium text-white hover:bg-amber-800 disabled:opacity-60">{saving ? "Salvando..." : "Salvar membro"}</button></div></form></div>}
  </MainLayout>;
}
