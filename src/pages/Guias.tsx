import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

interface Guia {
    id: number;
    nome: string;
    linha: string;
    caracteristicas: string;
}

export default function Guias() {
    const [guias, setGuias] = useState<Guia[]>([
        { id: 1, nome: "Pai Joaquim de Angola", linha: "Preto Velho", caracteristicas: "Trabalha com ervas e benzimento." },
        { id: 2, nome: "Caboclo Tupinambá", linha: "Caboclo", caracteristicas: "Usa charuto e trabalha com desobsessão." }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ nome: "", linha: "", caracteristicas: "" });
    const [editId, setEditId] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.nome && formData.linha) {
            if (editId) {
                setGuias(guias.map(g => g.id === editId ? { ...g, ...formData } : g));
            } else {
                setGuias([...guias, { id: Date.now(), ...formData }]);
            }
            handleCloseModal();
        }
    };

    const handleEdit = (guia: Guia) => {
        setFormData({ nome: guia.nome, linha: guia.linha, caracteristicas: guia.caracteristicas || "" });
        setEditId(guia.id);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Tem certeza que deseja excluir este guia?")) {
            setGuias(guias.filter(g => g.id !== id));
        }
    };

    const handleOpenModal = () => {
        setFormData({ nome: "", linha: "", caracteristicas: "" });
        setEditId(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setFormData({ nome: "", linha: "", caracteristicas: "" });
        setEditId(null);
        setIsModalOpen(false);
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Meus Guias</h2>
                    <p className="text-gray-600 text-sm mt-1">Gerencie os guias (entidades) com os quais você trabalha.</p>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm"
                >
                    <i className="bi-plus-lg mr-2"></i>
                    Novo Guia
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">{editId ? "Editar Guia" : "Cadastrar Novo Guia"}</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500">
                                <i className="bi-x-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Guia *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="Ex: Caboclo Pena Branca"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Linha de Trabalho *</label>
                                <select
                                    required
                                    value={formData.linha}
                                    onChange={(e) => setFormData({ ...formData, linha: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                >
                                    <option value="">Selecione a linha...</option>
                                    <option value="Preto Velho">Preto Velho / Preta Velha</option>
                                    <option value="Caboclo">Caboclo / Cabocla</option>
                                    <option value="Erê">Erê / Criança</option>
                                    <option value="Baiano">Baiano / Baiana</option>
                                    <option value="Boiadeiro">Boiadeiro</option>
                                    <option value="Marinheiro">Marinheiro</option>
                                    <option value="Zé Pelintra / Malandro">Zé Pelintra / Malandro</option>
                                    <option value="Exu">Exu</option>
                                    <option value="Pombagira">Pombagira</option>
                                    <option value="Exu Mirim">Exu Mirim / Pombagira Mirim</option>
                                    <option value="Cigano">Cigano / Cigana</option>
                                    <option value="Oriente">Linha do Oriente</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Características / Ferramentas</label>
                                <textarea
                                    value={formData.caracteristicas}
                                    onChange={(e) => setFormData({ ...formData, caracteristicas: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                    rows={3}
                                    placeholder="Ex: Usa charuto, trabalha com ervas, guia de contas verdes..."
                                ></textarea>
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
                                    {editId ? "Salvar Alterações" : "Salvar Guia"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guias.length === 0 ? (
                    <div className="col-span-full bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center">
                        <i className="bi-stars text-4xl text-gray-300 mb-3 block"></i>
                        <h3 className="text-gray-800 font-medium mb-1">Nenhum guia cadastrado</h3>
                        <p className="text-gray-500 text-sm">Adicione os guias que você incorpora para manter seu registro atualizado.</p>
                    </div>
                ) : (
                    guias.map(guia => (
                        <div key={guia.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col pt-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>
                            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xl mb-4 absolute -right-2 -top-2 opacity-50">
                                <i className="bi-person-badge"></i>
                            </div>

                            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">{guia.linha}</span>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{guia.nome}</h3>
                            <p className="text-gray-600 text-sm flex-1">{guia.caracteristicas || "Sem características cadastradas."}</p>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-2">
                                <button
                                    onClick={() => handleEdit(guia)}
                                    className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                                    title="Editar Guia"
                                >
                                    <i className="bi-pencil"></i>
                                </button>
                                <button
                                    onClick={() => handleDelete(guia.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Excluir Guia"
                                >
                                    <i className="bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </MainLayout>
    );
}
