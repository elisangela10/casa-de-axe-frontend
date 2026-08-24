import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { readLocal, writeLocal } from "../lib/localStore";
import { hasRole } from "../auth/token";
import { createGira, deleteGira, getGirasEndpoint, listGiras, updateGira, type Gira } from "../services/giraService";
import { Button, EmptyState, LoadingState, PageHeader } from "../components/ui";
import { LINHAS_CASA } from "../constants/linhasCasa";

const STORAGE_KEY = "casa_de_axe_giras";
const ENDPOINT = getGirasEndpoint();
const EMPTY = { data: "", titulo: "", guiaCura: "", descricao: "", linha: "" };

export default function CalendarioAtualizado() {
  const [giras, setGiras] = useState<Gira[]>(() => readLocal(STORAGE_KEY, []));
  const [formData, setFormData] = useState(EMPTY);
  const [editId, setEditId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [usingLocalData, setUsingLocalData] = useState(false);
  const canManage = hasRole(["admin", "administrador"]);

  const loadGiras = async () => {
    setLoading(true); setError("");
    try { const items = await listGiras(); setGiras(items); setUsingLocalData(false); writeLocal(STORAGE_KEY, items); }
    catch { const localItems = readLocal<Gira[]>(STORAGE_KEY, []); setGiras(localItems); setUsingLocalData(localItems.length > 0); setError(`Não foi possível carregar ${ENDPOINT}. Verifique a API ou tente novamente.`); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadGiras(); }, []);

  const sorted = useMemo(() => giras.filter((gira) => `${gira.titulo} ${gira.linha || ""} ${gira.guiaCura} ${gira.descricao || ""}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()), [giras, query]);
  const closeModal = () => { setModalOpen(false); setEditId(null); setFormData(EMPTY); setError(""); };
  const openNew = () => { setEditId(null); setFormData(EMPTY); setError(""); setModalOpen(true); };
  const openEdit = (gira: Gira) => { setEditId(gira.id); setFormData({ data: gira.data.slice(0, 16), titulo: gira.titulo, guiaCura: gira.guiaCura, descricao: gira.descricao || "", linha: gira.linha || "" }); setModalOpen(true); };
  const formatDate = (value: string) => new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.data || !formData.titulo.trim() || !formData.linha) { setError("Informe a data, o título e a linha da gira."); return; }
    setSaving(true); setError("");
    try {
      let saved: Gira;
      if (editId) { try { saved = await updateGira(editId, formData); } catch { saved = { id: editId, ...formData }; } }
      else { try { saved = await createGira(formData); } catch { saved = { id: Date.now(), ...formData }; } }
      const next = editId ? giras.map((item) => item.id === editId ? saved : item) : [saved, ...giras]; setGiras(next); writeLocal(STORAGE_KEY, next); closeModal();
    } catch { setError("Não foi possível salvar a gira."); } finally { setSaving(false); }
  };
  const remove = async (id: number) => { if (!window.confirm("Tem certeza que deseja excluir esta gira?")) return; try { await deleteGira(id); } catch { /* mantém fallback local */ } const next = giras.filter((item) => item.id !== id); setGiras(next); writeLocal(STORAGE_KEY, next); };

  return <MainLayout>
    <PageHeader title="Calendário de giras" description="Acompanhe sessões, festas e obrigações da Casa." action={canManage && <Button onClick={openNew}><i className="bi-calendar-plus mr-2" />Nova gira</Button>} />
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><label htmlFor="gira-search" className="sr-only">Buscar giras</label><div className="relative"><i className="bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input id="gira-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por título, linha ou guia..." className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200" /></div></div>
    {loading ? <LoadingState label="Carregando calendário..." /> : <>{error && <div role="alert" className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"><span><i className="bi-exclamation-triangle mr-2" />{error}{usingLocalData && " Exibindo os dados salvos neste dispositivo."}</span><button onClick={() => void loadGiras()} className="font-semibold underline hover:no-underline">Tentar novamente</button></div>}{sorted.length === 0 ? <EmptyState icon="bi-calendar-x" title="Nenhuma gira programada" description="Cadastre a próxima atividade da Casa." /> : <div className="space-y-4">{sorted.map((gira) => <article key={gira.id} className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center"><div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><span className="text-xs font-bold uppercase">{new Date(gira.data).toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</span><span className="text-3xl font-black">{new Date(gira.data).getDate().toString().padStart(2, "0")}</span></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold text-gray-900">{gira.titulo}</h2>{gira.linha && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{gira.linha}</span>}</div><p className="mt-1 text-sm capitalize text-gray-500"><i className="bi-clock mr-2" />{formatDate(gira.data)}</p>{gira.guiaCura && <p className="mt-2 text-sm text-gray-600"><i className="bi-stars mr-2 text-amber-600" />{gira.guiaCura}</p>}{gira.descricao && <p className="mt-2 text-sm text-gray-600">{gira.descricao}</p>}</div>{canManage && <div className="flex gap-2 md:flex-col"><button onClick={() => openEdit(gira)} className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-700"><i className="bi-pencil mr-1" />Editar</button><button onClick={() => remove(gira.id)} className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700"><i className="bi-trash mr-1" />Excluir</button></div>}</article>)}</div>}</>}
    {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="gira-modal-title"><form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white shadow-xl"><div className="flex items-center justify-between border-b border-gray-200 p-5"><h2 id="gira-modal-title" className="font-bold text-gray-900">{editId ? "Editar gira" : "Nova gira"}</h2><button type="button" onClick={closeModal} aria-label="Fechar" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><i className="bi-x-lg" /></button></div><div className="space-y-4 p-5"><div><label htmlFor="data-gira" className="mb-1 block text-sm font-medium">Data e hora *</label><input id="data-gira" type="datetime-local" required autoFocus value={formData.data} onChange={(event) => setFormData({ ...formData, data: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-amber-500" /></div><div><label htmlFor="titulo-gira" className="mb-1 block text-sm font-medium">Título *</label><input id="titulo-gira" required value={formData.titulo} onChange={(event) => setFormData({ ...formData, titulo: event.target.value })} placeholder="Ex.: Gira de Caboclos" className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-amber-500" /></div><div><label htmlFor="linha-gira" className="mb-1 block text-sm font-medium">Linha da gira *</label><select id="linha-gira" required value={formData.linha} onChange={(event) => setFormData({ ...formData, linha: event.target.value })} className="w-full rounded-lg border border-gray-300 bg-white p-2.5 outline-none focus:border-amber-500"><option value="">Selecione a linha...</option>{LINHAS_CASA.map((linha) => <option key={linha} value={linha}>{linha}</option>)}</select></div><div><label htmlFor="guia-gira" className="mb-1 block text-sm font-medium">Guia responsável</label><input id="guia-gira" value={formData.guiaCura} onChange={(event) => setFormData({ ...formData, guiaCura: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-amber-500" /></div><div><label htmlFor="descricao-gira" className="mb-1 block text-sm font-medium">Observações</label><textarea id="descricao-gira" rows={3} value={formData.descricao} onChange={(event) => setFormData({ ...formData, descricao: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-amber-500" /></div>{error && <p role="alert" className="text-sm text-red-600">{error}</p>}</div><div className="flex justify-end gap-3 border-t border-gray-200 p-5"><button type="button" onClick={closeModal} className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">Cancelar</button><button disabled={saving} className="rounded-lg bg-amber-700 px-4 py-2 font-medium text-white hover:bg-amber-800 disabled:opacity-60">{saving ? "Salvando..." : "Salvar gira"}</button></div></form></div>}
  </MainLayout>;
}
