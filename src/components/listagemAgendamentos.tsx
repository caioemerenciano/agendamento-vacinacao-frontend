import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
// Lembre-se de garantir que o updateStatusAgendamento esteja exportado no seu service!
import { getAgendamentos, updateStatusAgendamento } from '../services/listagemAgendamentoService';
import type { AgendamentoResponse } from '../types/agendamento';

export const ListagemAgendamentos = () => {
  const [appointments, setAppointments] = useState<AgendamentoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const dados = await getAgendamentos();
        setAppointments(dados);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Função central que lida com a mudança no banco e na tela
  const handleStatusChange = async (id: number, novoStatusTexto: string) => {
    const statusMap: Record<string, number> = {
      'Agendado': 1,
      'Realizado': 2,
      'Cancelado': 3
    };

    try {
      // 1. Envia para a API C#
      await updateStatusAgendamento(id, statusMap[novoStatusTexto]);

      // 2. Atualiza a tela (Estado do React) instantaneamente se a API der sucesso
      setAppointments(prev => prev.map(app =>
        app.id === id ? { ...app, status: statusMap[novoStatusTexto] } : app
      ));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Não foi possível atualizar o status no banco de dados.");
    }
  };

  const getStatusText = (status: number | string) => {
    switch (String(status)) {
      case '1': return 'Agendado';
      case '2': return 'Realizado';
      case '3': return 'Cancelado';
      default: return String(status);
    }
  };

  // Função extra de UI/UX para colorir as pílulas de status
  const getStatusStyle = (status: number | string) => {
    const textStatus = getStatusText(status);
    switch (textStatus) {
      case 'Realizado': return 'bg-green-100 text-green-700';
      case 'Cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700'; // Agendado
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-600">Carregando agendamentos do banco...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Erro ao conectar com a API. Verifique se o backend está rodando.</div>;

  return (
    <div className="w-full max-w-5xl mt-12 bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">Agendamentos Realizados</h2>
          <div className="relative flex items-center justify-center p-2 rounded-full hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            {appointments.length > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white">
                {appointments.length}
              </span>
            )}
          </div>
        </div>
        <Link
          to="/"
          className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Novo Agendamento
        </Link>
      </div>

      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
          <tr>
            <th className="px-6 py-4 font-semibold">Paciente</th>
            <th className="px-6 py-4 font-semibold">Data</th>
            <th className="px-6 py-4 font-semibold">Horário</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {appointments.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Nenhum agendamento encontrado no banco de dados.</td>
            </tr>
          ) : (
            appointments.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-700">{app.nomePaciente}</td>
                <td className="px-6 py-4 text-slate-600">{app.dataAgendamento?.split('T')[0]}</td>
                <td className="px-6 py-4 text-slate-600">{app.horaAgendamento}</td>

                {/* Coluna de Status com cor dinâmica */}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusStyle(app.status)}`}>
                    {getStatusText(app.status)}
                  </span>
                </td>

                {/* Coluna de Ações com o Select */}
                <td className="px-6 py-4 text-center">
                  <select
                    value={getStatusText(app.status)}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="text-sm font-medium border border-slate-300 rounded-md p-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
                  >
                    <option value="Agendado">Agendado</option>
                    <option value="Realizado">Realizado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};