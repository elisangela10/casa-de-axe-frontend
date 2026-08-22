import { Link } from "react-router-dom";
import { Button } from "../components/ui";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-700">Erro 404</p>
        <h1 className="mb-3 text-3xl font-bold text-gray-900">Página não encontrada</h1>
        <p className="mb-6 text-gray-600">
          O endereço acessado não existe ou foi movido.
        </p>
        <Link to="/login"><Button type="button">Voltar para o início</Button></Link>
      </section>
    </main>
  );
}
