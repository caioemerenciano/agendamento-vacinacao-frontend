import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, EyeOff, Eye, Loader2 } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../services/authService';
import { modalService } from '../services/modalService';

export const Auth: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const autenticado = servicoAutenticacao.estaAutenticado();

    if (autenticado) {
      const perfil = servicoAutenticacao.getUsuarioPerfil();
      if (perfil === 'Enfermeiro') {
        navigate('/listagem');
      } else {
        navigate('/agendamento');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      if (abaAtiva === 'login') {
        await servicoAutenticacao.login(email, senha);
      } else {
        await servicoAutenticacao.registrar(email, senha);
        modalService.showSuccess('Sua conta foi criada com sucesso! Realizando login automático...');
        await servicoAutenticacao.login(email, senha);
      }

      const perfil = servicoAutenticacao.getUsuarioPerfil();
      if (perfil === 'Enfermeiro') {
        navigate('/listagem');
      } else {
        navigate('/agendamento');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        modalService.showError('E-mail e/ou senha incorreta(s).');
      } else {
        const mensagemErro = (axios.isAxiosError(err) && err.response?.data?.message) ||
          (err instanceof Error ? err.message : 'Ocorreu um erro ao tentar conectar. Tente novamente mais tarde.');
        setErro(mensagemErro);
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-10 w-full max-w-md mx-auto flex flex-col items-center">

      {/* Icon */}
      <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center mb-6">
        <Shield className="w-6 h-6 text-[#0ea5e9]" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Agendamento de vacinação</h1>
      <p className="text-sm text-slate-500 mb-8">Faça sua prevenção contra COVID-19.</p>

      {/* Tabs */}
      <div className="w-full bg-slate-50 p-1 rounded-xl flex mb-6">
        <button
          type="button"
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${abaAtiva === 'login'
            ? 'bg-white text-slate-900 shadow-sm border border-slate-100'
            : 'text-slate-500 hover:text-slate-700'
            }`}
          onClick={() => setAbaAtiva('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${abaAtiva === 'register'
            ? 'bg-white text-slate-900 shadow-sm border border-slate-100'
            : 'text-slate-500 hover:text-slate-700'
            }`}
          onClick={() => setAbaAtiva('register')}
        >
          Cadastro
        </button>
      </div>

      <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
        <Input
          label="Endereço de e-mail"
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Senha"
          type={mostrarSenha ? 'text' : 'password'}
          placeholder="••••••••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          icon={
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="focus:outline-none pointer-events-auto"
            >
              {mostrarSenha ? (
                <Eye className="w-[18px] h-[18px] text-slate-400 hover:text-slate-600 transition-colors" />
              ) : (
                <EyeOff className="w-[18px] h-[18px] text-slate-400 hover:text-slate-600 transition-colors" />
              )}
            </button>
          }
        />

        {erro && <p className="text-red-500 text-sm font-medium">{erro}</p>}

        <div className="mt-2">
          <Button type="submit" disabled={carregando}>
            {carregando ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Carregando...
              </span>
            ) : abaAtiva === 'login' ? (
              'Entrar'
            ) : (
              'Cadastrar'
            )}
          </Button>
        </div>
      </form>

    </div>
  );
};
