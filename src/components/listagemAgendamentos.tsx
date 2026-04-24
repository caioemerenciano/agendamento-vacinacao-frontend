import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, MoreVertical, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Badge } from './ui/Badge';
import type { AgendamentoResponse } from '../types/agendamento';
import { getAgendamentos } from '../services/listagemAgendamentoService';
import { useNavigate } from 'react-router-dom';

interface ListagemProps {
  appointments?: AgendamentoResponse[];
}

export const ListagemAgendamentos: React.FC<ListagemProps> = ({ appointments: propsAppointments }) => {
  const [appointments, setAppointments] = useState<AgendamentoResponse[]>(propsAppointments || []);
  const [isLoading, setIsLoading] = useState(!propsAppointments);
  const navigate = useNavigate();

  useEffect(() => {
    if (propsAppointments) return;

    const fetchAgendamentos = async () => {
      try {
        setIsLoading(true);
        const data = await getAgendamentos();
        setAppointments(data);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgendamentos();
  }, [propsAppointments]);

  return (
    <div className="w-full min-h-screen bg-[#f1f5f9] font-sans flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">WebApi Admin</h1>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-sky-600 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow hover:bg-sky-700 transition-colors"
        >
          Novo Agendamento
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl mt-10 px-6">
        {/* Page Title & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Consultas agendadas</h2>
            <p className="text-slate-500 mt-1">Gerenciar e revisar todos os agendamentos de vacinação contra COVID-19.</p>
          </div>
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400 text-slate-900 bg-white"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="w-full h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="w-full h-[400px] flex flex-col items-center justify-center text-slate-400">
              <p className="text-lg font-medium">Nenhum agendamento encontrado.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 text-sky-600 hover:underline text-sm"
              >
                Criar primeiro agendamento
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold tracking-wider">
                    <th className="px-6 py-4 uppercase">Patient Name</th>
                    <th className="px-6 py-4 uppercase">Scheduled Date</th>
                    <th className="px-6 py-4 uppercase">Time</th>
                    <th className="px-6 py-4 uppercase">Status</th>
                    <th className="px-6 py-4 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
                            <User size={16} />
                          </div>
                          <span className="font-semibold text-slate-800">{apt.nomePaciente}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-slate-400" />
                          <span>{apt.dataAgendamento}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-slate-400" />
                          <span>{apt.horaAgendamento}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge status={apt.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && appointments.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white text-sm">
              <span className="text-slate-500">Showing {appointments.length} results</span>
              <div className="flex items-center gap-1">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                  <ChevronLeft size={16} /> Previous
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-sky-600 text-white font-medium shadow-sm">
                  1
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
