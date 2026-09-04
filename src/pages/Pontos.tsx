import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { getApiErrorMessage } from "../services/api";
import { createPonto, deletePonto, listPontos, Ponto, updatePonto } from "../services/pontoService";
import { getLinhaCasaColor, LINHAS_CASA } from "../constants/linhasCasa";
import { getSocialLinkInfo } from "../utils/socialLink";

const CATEGORIAS = LINHAS_CASA;

const EMPTY_FORM = {
  tituloDoponto: "",
  linkDoYouTube: "",
  letraDoPonto: "",
  categoriaDoPontos: "",
};

export default function Pontos() {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // ── Busca pontos da API ──────────────────────────────────────────────────
  useEffect(() => {
    fetchPontos();
  }, []);

  const fetchPontos = async () => {
    setLoading(true);
    try {
      setPontos(await listPontos());
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível carregar os pontos."));
    } finally {
      setLoading(false);
    }
  };

  // ── Salva (cria ou edita) ─────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.tituloDoponto || !formData.categoriaDoPontos || !formData.letraDoPonto) {
      setError("Preencha os campos obrigatórios: Título, Categoria e Letra do Ponto.");
      return;
    }

    setSaving(true);
    try {
      if (editId) {
        const atualizado = await updatePonto(editId, formData);
        setPontos(pontos.map((p) => (p.id === editId ? (atualizado || { id: editId, ...formData }) : p)));
        showSuccess("Ponto atualizado com sucesso!");
      } else {
        const novoPonto = await createPonto(formData);
        setPontos([novoPonto, ...pontos]);
        showSuccess("Ponto cadastrado com sucesso!");
      }
      handleCloseModal();
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível salvar o ponto."));
    } finally {
      setSaving(false);
    }
  };

  // ── Editar ────────────────────────────────────────────────────────────────
  const handleEdit = (ponto: Ponto) => {
    setFormData({
      tituloDoponto: ponto.tituloDoponto,
      linkDoYouTube: ponto.linkDoYouTube,
      letraDoPonto: ponto.letraDoPonto,
      categoriaDoPontos: ponto.categoriaDoPontos,
    });
    setEditId(ponto.id);
    setIsModalOpen(true);
  };

  // ── Deletar ───────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este ponto?")) return;
    try {
      await deletePonto(id);
      setPontos(pontos.filter((p) => p.id !== id));
      showSuccess("Ponto excluído com sucesso!");
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível excluir o ponto."));
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const handleOpenModal = () => {
    setFormData(EMPTY_FORM);
    setEditId(null);
    setError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setFormData(EMPTY_FORM);
    setEditId(null);
    setError("");
    setIsModalOpen(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|v=|\/embed\/)([^&?/]+)/);
    return match ? match[1] : null;
  };

  // ── Filtragem ─────────────────────────────────────────────────────────────
  const pontosFiltrados = pontos.filter((p) => {
    const buscaOk =
      !busca ||
      p.tituloDoponto.toLowerCase().includes(busca.toLowerCase()) ||
      p.letraDoPonto.toLowerCase().includes(busca.toLowerCase());
    const categoriaOk = !categoriaFiltro || p.categoriaDoPontos === categoriaFiltro;
    return buscaOk && categoriaOk;
  });

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <MainLayout>
      {/* Toast de sucesso */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg animate-fade-in">
          <i className="bi-check-circle-fill text-xl" />
          <span className="font-medium text-sm">{successMsg}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Meus Pontos</h2>
          <p className="text-gray-600 text-sm mt-1">
            Gerencie o acervo de pontos cantados da Casa.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <i className="bi-plus-lg" />
          Novo Ponto
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <i className="bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título ou letra..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          />
        </div>
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-amber-500 outline-none"
        >
          <option value="">Todas as Categorias</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500 ml-auto">
          <span className="font-semibold text-gray-700">{pontosFiltrados.length}</span> ponto(s)
        </span>
      </div>

      {/* Listagem */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3" />
          <p className="text-sm">Carregando pontos...</p>
        </div>
      ) : pontosFiltrados.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <i className="bi-music-note-list text-5xl text-gray-300 block mb-3" />
          <h3 className="text-gray-700 font-semibold mb-1">
            {pontos.length === 0 ? "Nenhum ponto cadastrado" : "Nenhum resultado encontrado"}
          </h3>
          <p className="text-gray-500 text-sm">
            {pontos.length === 0
              ? "Clique em Novo Ponto para começar a montar o acervo."
              : "Tente ajustar os filtros de busca."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pontosFiltrados.map((ponto) => {
            const isExpanded = expandedId === ponto.id;
            const ytId = getYoutubeId(ponto.linkDoYouTube);
            const socialLink = getSocialLinkInfo(ponto.linkDoYouTube);
            const badgeClass = getLinhaCasaColor(ponto.categoriaDoPontos);

            return (
              <div
                key={ponto.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all"
              >
                {/* Linha superior do card */}
                <div className="p-5 flex items-start gap-4">
                  {/* Ícone decorativo */}
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
                    <i className="bi-music-note-beamed text-xl" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-gray-800 truncate">
                        {ponto.tituloDoponto}
                      </h3>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeClass}`}>
                        {ponto.categoriaDoPontos}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {ponto.letraDoPonto}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {ponto.linkDoYouTube && (
                      <a
                        href={ponto.linkDoYouTube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 text-gray-400 transition-colors ${socialLink.color}`}
                        title={`Abrir no ${socialLink.label}`}
                      >
                        <i className={`${socialLink.icon} text-lg`} />
                      </a>
                    )}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : ponto.id)}
                      className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                      title={isExpanded ? "Recolher" : "Ver letra completa"}
                    >
                      <i className={`bi-chevron-${isExpanded ? "up" : "down"} text-lg`} />
                    </button>
                    <button
                      onClick={() => handleEdit(ponto)}
                      className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                      title="Editar"
                    >
                      <i className="bi-pencil text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(ponto.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Excluir"
                    >
                      <i className="bi-trash text-lg" />
                    </button>
                  </div>
                </div>

                {/* Expansão: letra completa + YouTube */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-amber-50/30 px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Letra completa */}
                    <div>
                      <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-1">
                        <i className="bi-file-text" /> Letra do Ponto
                      </h4>
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed bg-white border border-gray-100 rounded-lg p-4">
                        {ponto.letraDoPonto}
                      </pre>
                    </div>

                    {/* Player YouTube */}
                    {ytId ? (
                      <div>
                        <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-1">
                          <i className="bi-youtube" /> Ouvir
                        </h4>
                        <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm aspect-video">
                          <iframe
                            src={`https://www.youtube.com/embed/${ytId}`}
                            title={ponto.tituloDoponto}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ) : ponto.linkDoYouTube ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <i className={socialLink.icon} />
                        <a href={ponto.linkDoYouTube} target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-700 break-all">
                          {ponto.linkDoYouTube}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm gap-2">
                        <i className="bi-music-note" />
                        Sem link de áudio cadastrado.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL ─────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header do modal */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-amber-700 to-amber-800 text-white">
              <div className="flex items-center gap-3">
                <i className="bi-music-note-beamed text-2xl" />
                <h3 className="font-bold text-lg">
                  {editId ? "Editar Ponto" : "Cadastrar Novo Ponto"}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-amber-200 hover:text-white transition-colors p-1"
              >
                <i className="bi-x-lg text-xl" />
              </button>
            </div>

            {/* Corpo do formulário */}
            <form id="form-ponto" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                  <i className="bi-exclamation-triangle-fill mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Título do Ponto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.tituloDoponto}
                  onChange={(e) => setFormData({ ...formData, tituloDoponto: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  placeholder="Ex: Salve o Caboclo das Sete Encruzilhadas"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.categoriaDoPontos}
                  onChange={(e) => setFormData({ ...formData, categoriaDoPontos: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                >
                  <option value="">Selecione a categoria...</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Link de referência */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Link de referência (YouTube, Instagram, Facebook ou TikTok)
                  <span className="text-gray-400 font-normal ml-1">(opcional)</span>
                </label>
                <div className="relative">
                    <i className="bi-link-45deg absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 text-lg" />
                  <input
                    type="url"
                    value={formData.linkDoYouTube}
                    onChange={(e) => setFormData({ ...formData, linkDoYouTube: e.target.value })}
                    className="w-full pl-10 pr-4 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    placeholder="https://www.youtube.com/..."
                  />
                </div>
              </div>

              {/* Letra do Ponto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Letra do Ponto <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.letraDoPonto}
                  onChange={(e) => setFormData({ ...formData, letraDoPonto: e.target.value })}
                  rows={8}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-mono leading-relaxed resize-y"
                  placeholder={"Cole ou digite aqui a letra do ponto cantado...\n\nEx:\nSalve o caboclo, salve!\nSalve a floresta, salve!\n..."}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Dica: use Enter para separar versos e estrofes.
                </p>
              </div>
            </form>

            {/* Footer do modal */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="form-ponto"
                disabled={saving}
                className="px-5 py-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-sm"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="bi-floppy" />
                    {editId ? "Salvar Alterações" : "Cadastrar Ponto"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
