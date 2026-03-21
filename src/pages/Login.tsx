import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/User/login", { username, password });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Usuário ou senha inválidos.");
    }
  };

  return (<div className="auth-main relative">
    <div className="auth-wrapper v1 flex items-center w-full h-full min-h-screen">
      <div className="auth-form flex items-center justify-center grow flex-col min-h-screen relative p-6">
        <div className="w-full max-w-[350px] relative">
          <div className="auth-bg">
            <span className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] block rounded-full bg-red-700 animate-[floating_7s_infinite]" />
            <span className="absolute top-[150px] right-[-150px] w-5 h-5 block rounded-full bg-amber-900 animate-[floating_9s_infinite]" />
            <span className="absolute left-[-150px] bottom-[150px] w-5 h-5 block rounded-full bg-red-800 animate-[floating_7s_infinite]" />
            <span className="absolute left-[-100px] bottom-[-100px] w-[300px] h-[300px] block rounded-full bg-amber-800 animate-[floating_9s_infinite]" />
          </div>

          <div className="card sm:my-12 w-full shadow-none">
            <form className="card-body !p-10" onSubmit={handleLogin}>
              <div className="text-center mb-8">
                <img src="../public/images/logo.jpg" alt="Logo" className="mx-auto auth-logo w-28 h-auto" />
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center mb-3">{error}</div>
              )}

              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex mt-1 justify-between items-center flex-wrap">
                <div className="form-check">
                  <input
                    className="form-check-input input-primary"
                    type="checkbox"
                    id="remember"
                  />
                  <label className="form-check-label text-muted" htmlFor="remember">
                    Lembrar de mim?
                  </label>
                </div>
                <h6 className="font-normal text-primary-500 mb-0">
                  <a href="#">Esqueceu a senha?</a>
                </h6>
              </div>

              <div className="mt-4 text-center">
                <button type="submit" className="btn btn-primary mx-auto shadow-2xl">
                  Entrar
                </button>
              </div>

              <div className="flex justify-between items-end flex-wrap mt-4">
                <h6 className="font-medium mb-0">Não tem uma conta?</h6>
                <a href="/cadastro" className="text-primary-500">
                  Criar conta
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
