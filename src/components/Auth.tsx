import React, { useEffect, useState } from 'react';
import { Shield, EyeOff, Eye, Loader2 } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
      navigate('/listagem');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        await authService.login(email, senha);
      } else {
        await authService.registrar(email, senha);
      }
      navigate('/agendamento');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
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
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'login'
            ? 'bg-white text-slate-900 shadow-sm border border-slate-100'
            : 'text-slate-500 hover:text-slate-700'
            }`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'register'
            ? 'bg-white text-slate-900 shadow-sm border border-slate-100'
            : 'text-slate-500 hover:text-slate-700'
            }`}
          onClick={() => setActiveTab('register')}
        >
          Register
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
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          icon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none pointer-events-auto"
            >
              {showPassword ? (
                <Eye className="w-[18px] h-[18px] text-slate-400 hover:text-slate-600 transition-colors" />
              ) : (
                <EyeOff className="w-[18px] h-[18px] text-slate-400 hover:text-slate-600 transition-colors" />
              )}
            </button>
          }
        />

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <div className="mt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Carregando...
              </span>
            ) : activeTab === 'login' ? (
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
