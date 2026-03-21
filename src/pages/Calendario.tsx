import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

interface Gira {
    id: number;
    data: string;
    titulo: string;
    guiaCura: string;
}

export default function Calendario() {
    // Simulação: para ver o formulário de ADMIN, podemos usar um toggle ou estado
    const [isAdmin, setIsAdmin] = useState(true);

    const [giras, setGiras] = useState<Gira[]>([
        { id: 1, data: "2023-11-15T20:00", titulo: "Gira Prática de Esquerda", guiaCura: "Sr. Tranca Ruas das Almas" },
        { id: 2, data: "2023-11-22T19:30", titulo: "Gira de Pretos Velhos e Caboclos", guiaCura: "Pai Cipriano e Caboclo Rompe Mato" }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ data: "", titulo: "", guiaCura: "" });
    const [editId, setEditId] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.data && formData.titulo) {
            if (editId) {
                setGiras(giras.map(g => g.id === editId ? { ...g, ...formData } : g));
            } else {
                setGiras([...giras, { id: Date.now(), ...formData }]);
            }
            handleCloseModal();
        }
    };

    const handleEdit = (gira: Gira) => {
        setFormData({ data: gira.data, titulo: gira.titulo, guiaCura: gira.guiaCura });
        setEditId(gira.id);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Tem certeza que deseja excluir esta gira?")) {
            setGiras(giras.filter(g => g.id !== id));
        }
    };

    const handleOpenModal = () => {
        setFormData({ data: "", titulo: "", guiaCura: "" });
        setEditId(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setFormData({ data: "", titulo: "", guiaCura: "" });
        setEditId(null);
        setIsModalOpen(false);
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Calendário de Giras</h2>
                    <p className="text-gray-600 text-sm mt-1">Acompanhe as próximas sessões, festas e obrigações da Casa.</p>
                </div>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                        <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} className="form-checkbox text-amber-600 rounded" />
                        Visão de ADM
                    </label>

                    {isAdmin && (
                        <button
                            onClick={handleOpenModal}
                            className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm"
                        >
                            <i className="bi-calendar-plus mr-2"></i>
                            Nova Gira
                        </button>
                    )}
                </div>
            </div>

            {isModalOpen && isAdmin && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">{editId ? "Editar Gira" : "Agendar Nova Gira"}</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500">
                                <i className="bi-x-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora *</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.data}
                                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título da Gira *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="Ex: Gira Festiva de Erês"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Guia de Cura (Responsável)</label>
                                <input
                                    type="text"
                                    value={formData.guiaCura}
                                    onChange={(e) => setFormData({ ...formData, guiaCura: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="Ex: Mãe Maria Conga (Médium: Ana)"
                                />
                                <p className="text-xs text-gray-500 mt-1">Quem será o guia chefe / pilar de atendimento nesta sessão.</p>
                            </div>
                            <div className="pt-4 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-600 border border-transparent text-white rounded-lg hover:bg-amber-700 font-medium"
                                >
                                    {editId ? "Salvar Alterações" : "Agendar Gira"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lista de Giras Agendadas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {giras.length === 0 ? (
                    <div className="p-12 text-center">
                        <i className="bi-calendar-x text-5xl text-gray-200 mb-4 block"></i>
                        <p className="text-gray-500">Nenhuma gira programada.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {giras.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()).map(gira => (
                            <div key={gira.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center">

                                {/* Ícone Data */}
                                <div className="bg-amber-50 text-amber-700 w-20 h-20 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-sm border border-amber-100/50">
                                    <span className="text-xs font-bold uppercase">{new Date(gira.data).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                                    <span className="text-3xl font-black">{new Date(gira.data).getDate().toString().padStart(2, '0')}</span>
                                </div>

                                {/* Infos */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{gira.titulo}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                                        <span className="flex items-center gap-1">
                                            <i className="bi-clock text-amber-500"></i> {formatDate(gira.data)}
                                        </span>
                                        {gira.guiaCura && (
                                            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-medium">
                                                <i className="bi-heart-pulse-fill"></i> Cura: {gira.guiaCura}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* ADM Actions */}
                                {isAdmin && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(gira)}
                                            className="p-2 w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-all flex items-center justify-center"
                                            title="Editar Gira"
                                        >
                                            <i className="bi-pencil"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(gira.id)}
                                            className="p-2 w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center"
                                            title="Excluir Gira"
                                        >
                                            <i className="bi-trash"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </MainLayout>
    );
}
