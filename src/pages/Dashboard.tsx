import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { readLocal } from "../lib/localStore";

type Gira = { id: number; data: string; titulo: string; guiaCura?: string };
const GIRAS_KEY = "casa_de_axe_giras";

export default function Dashboard() {
  const [users, setUsers] = useState(0);
  const [pontos, setPontos] = useState(0);
  const [giras, setGiras] = useState<Gira[]>(() => readLocal(GIRAS_KEY, []));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([api.get("/User/GetUser"), api.get("/TextoPonto")]).then(([usersResult, pontosResult]) => {
      if (usersResult.status === "fulfilled") { const data = usersResult.value.data; setUsers(Array.isArray(data) ? data.length : Array.isArray(data?.data) ? data.data.length : 0); }
      if (pontosResult.status === "fulfilled") { const data = pontosResult.value.data; setPontos(Array.isArray(data) ? data.length : Array.isArray(data?.data) ? data.data.length : 0); }
    }).finally(() => setLoading(false));
  }, []);

  const upcoming = giras.filter((gira) => new Date(gira.data).getTime() >= Date.now()).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()).slice(0, 4);
  const stats = [
    { label: "Giras próximas", value: upcoming.length, icon: "bi-calendar-heart", tone: "bg-amber-100 text-amber-700" },
    { label: "Membros cadastrados", value: users, icon: "bi-people", tone: "bg-blue-100 text-blue-700" },
    { label: "Pontos no acervo", value: pontos, icon: "bi-music-note-beamed", tone: "bg-purple-100 text-purple-700" },
  ];
  const formatDate = (date: string) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(date));

  return <MainLayout>
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-800 via-amber-900 to-stone-950 p-6 text-white shadow-lg md:p-8"><div className="relative z-10 max-w-2xl"><p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-200">Painel da Casa</p><h1 className="text-2xl font-bold md:text-3xl">Bem-vindo(a) à Casa de Axé</h1><p className="mt-3 text-sm leading-6 text-amber-100 md:text-base">Organize suas giras, membros, guias e pontos cantados em um só lugar.</p></div><i className="bi-sun-fill absolute -bottom-10 -right-6 text-[10rem] text-white/10" /></section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{stats.map((stat) => <article key={stat.label} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><div><p className="text-sm text-gray-500">{stat.label}</p><p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : stat.value}</p></div><div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${stat.tone}`}><i className={stat.icon} /></div></article>)}</div>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]"><section className="rounded-xl border border-gray-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-gray-200 p-5"><div><h2 className="font-bold text-gray-900">Próximas giras</h2><p className="mt-1 text-sm text-gray-500">Acompanhe os próximos compromissos da Casa.</p></div><Link to="/calendario" className="text-sm font-semibold text-amber-700 hover:text-amber-900">Ver calendário</Link></div>{upcoming.length === 0 ? <div className="p-10 text-center text-gray-500"><i className="bi-calendar-x mb-3 block text-4xl text-gray-300" /><p>Nenhuma gira futura cadastrada.</p><Link to="/calendario" className="mt-3 inline-block text-sm font-semibold text-amber-700">Cadastrar gira</Link></div> : <div className="divide-y divide-gray-100">{upcoming.map((gira) => <div key={gira.id} className="flex items-center gap-4 p-5"><div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-amber-50 text-amber-700"><span className="text-xl font-black">{new Date(gira.data).getDate()}</span><span className="text-[10px] font-bold uppercase">{new Date(gira.data).toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</span></div><div className="min-w-0"><h3 className="truncate font-semibold text-gray-900">{gira.titulo}</h3><p className="mt-1 text-sm capitalize text-gray-500"><i className="bi-clock mr-1" />{formatDate(gira.data)}</p>{gira.guiaCura && <p className="mt-1 truncate text-xs text-gray-500">{gira.guiaCura}</p>}</div></div>)}</div>}</section><section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-gray-900">Acesso rápido</h2><p className="mt-1 text-sm text-gray-500">Continue de onde parou.</p><div className="mt-5 grid gap-3">{[["/pontos", "bi-music-note-list", "Consultar pontos"], ["/guias", "bi-stars", "Meus guias"], ["/calendario", "bi-calendar-event", "Calendário"]].map(([path, icon, label]) => <Link key={path} to={path} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-700 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"><i className={`${icon} text-lg text-amber-700`} />{label}<i className="bi-arrow-right ml-auto" /></Link>)}</div></section></div>
    </div>
  </MainLayout>;
}
