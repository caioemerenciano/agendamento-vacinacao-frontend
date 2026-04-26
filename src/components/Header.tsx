import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Shield, LayoutDashboard, PlusCircle } from 'lucide-react';
import { servicoAutenticacao } from '../services/authService';

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const autenticado = servicoAutenticacao.estaAutenticado();

    const handleLogout = () => {
        servicoAutenticacao.logout();
        navigate('/');
    };

    if (!autenticado) return null;

    return (
        <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/listagem" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-800 hidden sm:block">
                        Vacina+
                    </span>
                </Link>

                <div className="flex items-center gap-4 sm:gap-6">
                    <Link
                        to="/listagem"
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="hidden xs:block">Meus Agendamentos</span>
                    </Link>
                    <Link
                        to="/agendamento"
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden xs:block">Novo</span>
                    </Link>

                    <div className="w-px h-6 bg-slate-200 mx-1" />

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all group"
                        title="Sair do sistema"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Sair</span>
                    </button>
                </div>
            </div>
        </header>
    );
};
