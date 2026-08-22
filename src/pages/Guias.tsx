import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { readLocal, writeLocal } from "../lib/localStore";

type Guia = { id: number; nome: string; linha: string; caracteristicas: string };
const STORAGE_KEY = "casa_de_axe_guias";
const ENDPOINT = import.meta.env.VITE_GUIAS_ENDPOINT || "/Guia";
const EMPTY: Omit<Guia, "id"> = { nome: "", linha: "", caracteristicas: "" };
const linhas = ["Preto Velho", "Caboclo", "Erê", "Baiano", "Boiadeiro", "Marinheiro", "Zé Pelintra / Malandro", "Exu", "Pombagira", "Exu Mirim", "Cigano", "Oriente", "Outro"];

export default function Guias() {
  const [guias, setGuias] = useState<Guia[]>(() => readLocal(STORAGE_KEY, []));
  const [formData, setFormData] = useState(EMPTY);
  const [editId, setEditId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get(ENDPOINT).then(({ data }) => {
      const items = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      if (active && items.length) { setGuias(items); writeLocal(STORAGE_KEY, items); }
    }).catch(() => undefined).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => guias.filter((guia) => `${guia.nome} ${guia.linha} ${guia.caracteristicas}`.toLowerCase().includes(query.toLowerCase())), [guias, query]);
  const closeModal = () => { setModalOpen(false); setEditId(null); setFormData(EMPTY); setError(""); };
  const openNew = () => { setEditId(null); setFormData(EMPTY); setError(""); setModalOpen(true); };
  const openEdit = (guia: Guia) => { setEditId(guia.id); setFormData({ nome: guia.nome, linha: guia.linha, caracteristicas: guia.caracteristicas || "" }); setModalOpen(true); };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.nome.trim() || !formData.linha) { setError("Informe o nome e a linha de trabalho."); return; }
    setSaving(true); setError("");
    try {
      let saved: Guia;
      if (editId) {
        try { await api.put(`${ENDPOINT}/${editId}`, { id: editId, ...formData }); } catch { /* fallback local */ }
        saved = { id: editId, ...formData };
      } else {
        let responseData: Guia | null = null;
        try { const response = await api.post(ENDPOINT, { id: 0, ...formData }); responseData = response.data; } catch { /* fallback local */ }
        saved = responseData || { id: Date.now(), ...formData };
      }
      const next = editId ? guias.map((item) => item.id === editId ? saved : item) : [saved, ...guias];
      setGuias(next); writeLocal(STORAGE_KEY, next); closeModal();
    } catch { setError("Não foi possível salvar o guia."); } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este guia?")) return;
    try { await api.delete(`${ENDPOINT}/${id}`); } catch { /* mantém fallback local */ }
    const next = guias.filter((item) => item.id !== id); setGuias(next); writeLocal(STORAGE_KEY, next);
  };

  return <MainLayout>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Meus Guias</h1><p className="mt-1 text-sm text-gray-600">Organize suas entidades e linhas de trabalho.</p></div><button onClick={openNew} className="rounded-lg bg-amber-700 px-4 py-2 font-medium text-white hover:bg-amber-800"><i className="bi-plus-lg mr-2" />Novo guia</button></div>
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><label htmlFor="guia-search" className="sr-only">Buscar guias</label><div className="relative"><i className="bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input id="guia-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome ou linha..." className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200" /></div></div>
    {loading ? <div className="py-16 text-center text-gray-500"><i className="bi-arrow-repeat mr-2 animate-spin" />Carregando guias...</div> : filtered.length === 0 ? <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center"><i className="bi-stars mb-3 block text-5xl text-gray-300" /><h2 className="font-semibold text-gray-800">Nenhum guia encontrado</h2><p className="mt-1 text-sm text-gray-500">Cadastre seu primeiro guia para começar.</p></div> : <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((guia) => <article key={guia.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm"><div className="mb-4 flex items-start justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl text-amber-700"><i className="bi-person-badge" /></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{guia.linha}</span></div><h2 className="text-lg font-bold text-gray-900">{guia.nome}</h2><p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{guia.caracteristicas || "Sem características cadastradas."}</p><div className="mt-5 flex justify-end gap-2 border-t border-gray-100 pt-4"><button onClick={() => openEdit(guia)} className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-700"><i className="bi-pencil mr-1" />Editar</button><button onClick={() => remove(guia.id)} className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700"><i className="bi-trash mr-1" />Excluir</button></div></article>)}</div>}
    {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="guia-modal-title"><form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white shadow-xl"><div className="flex items-center justify-between border-b border-gray-200 p-5"><h2 id="guia-modal-title" className="font-bold text-gray-900">{editId ? "Editar guia" : "Novo guia"}</h2><button type="button" onClick={closeModal} aria-label="Fechar" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><i className="bi-x-lg" /></button></div><div className="space-y-4 p-5"><div><label htmlFor="nome-guia" className="mb-1 block text-sm font-medium">Nome do guia *</label><input id="nome-guia" autoFocus required value={formData.nome} onChange={(event) => setFormData({ ...formData, nome: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200" /></div><div><label htmlFor="linha-guia" className="mb-1 block text-sm font-medium">Linha de trabalho *</label><select id="linha-guia" required value={formData.linha} onChange={(event) => setFormData({ ...formData, linha: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-amber-500"><option value="">Selecione...</option>{linhas.map((linha) => <option key={linha}>{linha}</option>)}</select></div><div><label htmlFor="detalhes-guia" className="mb-1 block text-sm font-medium">Características / ferramentas</label><textarea id="detalhes-guia" rows={4} value={formData.caracteristicas} onChange={(event) => setFormData({ ...formData, caracteristicas: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-amber-500" /></div>{error && <p role="alert" className="text-sm text-red-600">{error}</p>}</div><div className="flex justify-end gap-3 border-t border-gray-200 p-5"><button type="button" onClick={closeModal} className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">Cancelar</button><button disabled={saving} className="rounded-lg bg-amber-700 px-4 py-2 font-medium text-white hover:bg-amber-800 disabled:opacity-60">{saving ? "Salvando..." : "Salvar guia"}</button></div></form></div>}
  </MainLayout>;
}
