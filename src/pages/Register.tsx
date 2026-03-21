import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: 0,
    nomeCompleto: "",
    email: "",
    telefone: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
    status: "ativo",
    dataCriacao: new Date().toISOString(),
    ultimoLogin: new Date().toISOString(),
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const { confirmPassword, ...data } = formData;


      await api.post("/User/register", data);
      navigate("/login");
    } catch (err) {
      setError("Erro ao registrar. Verifique os campos ou se o usuário já existe.");
    }
  };

  return (
    <div className="auth-main relative">
      <div className="auth-wrapper v1 flex items-center w-full h-full min-h-screen">
        <div className="auth-form flex items-center justify-center grow flex-col min-h-screen relative p-6">
          <div className="w-full max-w-[350px] relative">
            {/* fundo animado */}
            <div className="auth-bg">
              <span className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] block rounded-full bg-red-700 animate-[floating_7s_infinite]" />
              <span className="absolute top-[150px] right-[-150px] w-5 h-5 block rounded-full bg-amber-900 animate-[floating_9s_infinite]" />
              <span className="absolute left-[-150px] bottom-[150px] w-5 h-5 block rounded-full bg-red-800 animate-[floating_7s_infinite]" />
              <span className="absolute left-[-100px] bottom-[-100px] w-[300px] h-[300px] block rounded-full bg-amber-800 animate-[floating_9s_infinite]" />
            </div>

            {/* formulário */}
            <div className="card sm:my-12 w-full shadow-none">
              <form onSubmit={handleRegister} className="card-body !p-10">
                <div className="text-center mb-8">
                  <img src="../public/images/logo.jpg" alt="Logo" className="mx-auto auth-logo w-28 h-auto" />
                </div>
                {error && (
                  <div className="text-red-600 text-sm text-center mb-3">{error}</div>
                )}

                <input
                  type="text"
                  name="nomeCompleto"
                  placeholder="Nome completo"
                  className="form-control mb-3"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control mb-3"
                  value={formData.email}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="telefone"
                  placeholder="Telefone"
                  className="form-control mb-3"
                  value={formData.telefone}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Usuário"
                  className="form-control mb-3"
                  value={formData.username}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  className="form-control mb-3"
                  value={formData.password}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar senha"
                  className="form-control mb-3"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <select
                  name="role"
                  className="form-control mb-3"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">Usuário</option>
                  <option value="ADMIN">Administrador</option>
                </select>

                <div className="form-check mb-4">
                  <input
                    className="form-check-input input-primary"
                    type="checkbox"
                    id="terms"
                    required
                  />
                  <label className="form-check-label text-muted" htmlFor="terms">
                    &nbsp; Concordo com os termos
                  </label>
                </div>

                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-primary shadow-2xl w-full">
                    Cadastrar
                  </button>
                </div>

                <div className="flex justify-between items-end flex-wrap mt-4">
                  <h6 className="font-medium mb-0">Já tem uma conta?</h6>
                  <a href="/login" className="text-primary-500">
                    Login
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
