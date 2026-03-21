import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <MainLayout>
      {/* Container Principal */}
      <div className="space-y-6">

        {/* Banner de Boas-vindas */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Bem-vindo(a) à Casa de Axé</h2>
            <p className="text-amber-100 max-w-2xl">
              Gerencie suas giras, calendário, membros e pontos de forma centralizada e organizada.
            </p>
          </div>
          <i className="bi-sun-fill absolute -right-10 -bottom-10 text-9xl text-white opacity-10"></i>
        </div>

        {/* Resumo Rápido (Top Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Giras do Mês */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Giras no Mês</p>
              <h3 className="text-3xl font-bold text-gray-800">4</h3>
            </div>
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-2xl">
              <i className="bi-calendar-heart"></i>
            </div>
          </div>

          {/* Card 2: Filhos da Casa */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Filhos da Casa</p>
              <h3 className="text-3xl font-bold text-gray-800">42</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl">
              <i className="bi-people"></i>
            </div>
          </div>

          {/* Card 3: Assistentes / Visitantes */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Assistentes Cadastrados</p>
              <h3 className="text-3xl font-bold text-gray-800">128</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl">
              <i className="bi-person-hearts"></i>
            </div>
          </div>

          {/* Card 4: Total de Pontos */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Pontos do Acervo</p>
              <h3 className="text-3xl font-bold text-gray-800">315</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl">
              <i className="bi-music-note-beamed"></i>
            </div>
          </div>
        </div>

        {/* Divisão Principal: Calendário e Usuários */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Coluna Esquerda: Calendário de Giras (ocupa 2 blocos) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Próximas Giras e Obrigações</h3>
              <Link to="/calendario" className="text-sm font-medium text-amber-600 hover:text-amber-800">
                Ver calendário completo &rarr;
              </Link>
            </div>

            <div className="p-0">
              {/* Evento 1 */}
              <div className="p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-6 items-start">
                <div className="bg-red-50 text-red-700 w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold uppercase">OUT</span>
                  <span className="text-2xl font-black">12</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-1">Gira de Esquerda (Exu e Pombagira)</h4>
                  <p className="text-gray-500 text-sm mb-3">
                    <i className="bi-clock mr-1"></i> Sábado, 20:00 - 23:30
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Roupa Preta/Vermelha</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Aberto ao Público</span>
                  </div>
                </div>
              </div>

              {/* Evento 2 */}
              <div className="p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-6 items-start">
                <div className="bg-amber-50 text-amber-700 w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold uppercase">OUT</span>
                  <span className="text-2xl font-black">20</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-1">Gira de Caboclos e Boiadeiros</h4>
                  <p className="text-gray-500 text-sm mb-3">
                    <i className="bi-clock mr-1"></i> Domingo, 16:00 - 20:00
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Roupa Branca</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Toque de Atabaque</span>
                  </div>
                </div>
              </div>

              {/* Evento 3 */}
              <div className="p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-6 items-start">
                <div className="bg-blue-50 text-blue-700 w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold uppercase">NOV</span>
                  <span className="text-2xl font-black">02</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-1">Festa de Obaluaê</h4>
                  <p className="text-gray-500 text-sm mb-3">
                    <i className="bi-clock mr-1"></i> Sábado, 19:30 - 00:00
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Obrigação</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Pipoca</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Divisão por Usuários e Resumos */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Divisão de Usuários</h3>

              <div className="space-y-4">
                {/* Entidade 1 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700">Mãe/Pai de Santo</span>
                    <span className="text-gray-500">2</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>

                {/* Entidade 2 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700">Mãe/Pai Pequeno</span>
                    <span className="text-gray-500">4</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>

                {/* Entidade 3 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700">Ogan / Ekedi</span>
                    <span className="text-gray-500">8</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>

                {/* Entidade 4 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700">Filhos de Santo</span>
                    <span className="text-gray-500">28</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100 text-center">
                  <Link to="/usuarios" className="btn btn-primary w-full shadow-md hover:shadow-lg transition-all text-sm py-2">
                    Gerenciar Hierarquia
                  </Link>
                </div>
              </div>
            </div>

            {/* Micro-aviso card */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
              <div className="flex gap-3">
                <i className="bi-megaphone text-amber-700 text-xl mt-1"></i>
                <div>
                  <h4 className="font-bold text-amber-900">Aviso da Direção</h4>
                  <p className="text-amber-800 text-sm mt-1">
                    A próxima reunião geral para organizar a festa de Exu ocorrerá no dia 10 de Outubro às 19:00h. Não faltem!
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
}