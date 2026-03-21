import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";

interface User {
    id: number;
    nomeCompleto: string;
    email: string;
    telefone: string;
    role: string;
    status: string;
}

export default function Usuarios() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Dados mockados para exibição inicial enquanto a API não retorna a lista completa
    const mockUsers: User[] = [
        { id: 1, nomeCompleto: "Mãe Carmen de Oxum", email: "carmen@terreiro.com", telefone: "(11) 99999-9999", role: "Mãe de Santo", status: "Ativo" },
        { id: 2, nomeCompleto: "Pai Ricardo de Ogum", email: "ricardo@terreiro.com", telefone: "(11) 98888-8888", role: "Pai Pequeno", status: "Ativo" },
        { id: 3, nomeCompleto: "João Silva", email: "joao@email.com", telefone: "(11) 97777-7777", role: "Ogan", status: "Ativo" },
        { id: 4, nomeCompleto: "Maria Souza", email: "maria@email.com", telefone: "(11) 96666-6666", role: "Ekedi", status: "Ativo" },
        { id: 5, nomeCompleto: "Carlos Ferreira", email: "carlos@email.com", telefone: "(11) 95555-5555", role: "Filho de Santo", status: "Ativo" },
    ];

    useEffect(() => {
        // Tenta buscar os usuários da API, se falhar ou estiver vazio, usa o mock
        const fetchUsers = async () => {
            try {
                const response = await api.get("/User");
                if (response.data && response.data.length > 0) {
                    setUsers(response.data);
                } else {
                    setUsers(mockUsers);
                }
            } catch (error) {
                console.error("Erro ao carregar usuários da API:", error);
                setUsers(mockUsers); // Fallback para visualização do layout
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const getRoleBadgeColor = (role: string) => {
        const roleLower = role.toLowerCase();
        if (roleLower.includes("mãe") || roleLower.includes("pai") || roleLower === "admin") return "bg-amber-100 text-amber-800";
        if (roleLower.includes("ogan") || roleLower.includes("ekedi")) return "bg-blue-100 text-blue-800";
        return "bg-green-100 text-green-800";
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h2>
                    <p className="text-gray-600 text-sm mt-1">Gerencie os membros, cargos e hierarquias da Casa.</p>
                </div>
                <button className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm">
                    <i className="bi-plus-lg mr-2"></i>
                    Novo Membro
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filtros */}
                <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center bg-gray-50/50">
                    <div className="relative flex-1 min-w-[250px]">
                        <i className="bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Buscar por nome, email ou cargo..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                        />
                    </div>
                    <select className="border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-amber-500 outline-none">
                        <option value="">Todos os Cargos</option>
                        <option value="mae_pai">Mãe/Pai de Santo</option>
                        <option value="ogan_ekedi">Ogan/Ekedi</option>
                        <option value="filho">Filho(a) de Santo</option>
                    </select>
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                                <th className="p-4 font-semibold">Membro</th>
                                <th className="p-4 font-semibold">Contato</th>
                                <th className="p-4 font-semibold">Cargo / Papel</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-amber-600 rounded-full mb-2"></div>
                                        <p>Carregando membros...</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                                                    {user.nomeCompleto.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{user.nomeCompleto}</p>
                                                    <p className="text-xs text-gray-500">ID: #{user.id.toString().padStart(4, '0')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-gray-800">{user.email}</p>
                                            <p className="text-xs text-gray-500">{user.telefone}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${user.status.toLowerCase() === 'ativo' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <span className="text-sm text-gray-700 capitalize">{user.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-gray-400 hover:text-amber-600 transition-colors p-2" title="Editar">
                                                <i className="bi-pencil-square text-lg"></i>
                                            </button>
                                            <button className="text-gray-400 hover:text-red-600 transition-colors p-2" title="Remover">
                                                <i className="bi-trash text-lg"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginação simples */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
                    <p>Mostrando <span className="font-semibold">{users.length}</span> membros cadastrados</p>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50" disabled>&laquo;</button>
                        <button className="px-3 py-1 bg-amber-600 text-white rounded font-medium">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">&raquo;</button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
