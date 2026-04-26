import { useEffect, useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Pencil, XCircle } from 'lucide-react';
import { getAgendamentos, cancelarAgendamento } from '../services/listagemAgendamentoService';
import type { AgendamentoResponse } from '../types/agendamento';

export const ListagemAgendamentos = () => {
  const [appointments, setAppointments] = useState<AgendamentoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

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

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const statusPriority: Record<string, number> = {
        '1': 1, 'Agendado': 1,
        '2': 2, 'Realizado': 2,
        '3': 3, 'Cancelado': 3
      };

      const pA = statusPriority[String(a.status)] || 99;
      const pB = statusPriority[String(b.status)] || 99;

      if (pA !== pB) return pA - pB;

      const dAPart = a.dataAgendamento.split('T')[0];
      const dBPart = b.dataAgendamento.split('T')[0];

      const dateA = new Date(`${dAPart}T${a.horaAgendamento}`);
      const dateB = new Date(`${dBPart}T${b.horaAgendamento}`);

      if (pA === 1) {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
  }, [appointments]);

  const handleEditar = (id: number) => {
    navigate(`/agendamento/editar/${id}`);
  };

  const handleCancelar = async (id: number) => {
    const confirmou = window.confirm('Tem certeza que deseja cancelar este agendamento?');
    if (!confirmou) return;

    try {
      await cancelarAgendamento(id);

      setAppointments(prev => prev.map(app =>
        app.id === id ? { ...app, status: 3 } : app
      ));

      alert('Agendamento cancelado com sucesso!');
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      alert("Não foi possível cancelar o agendamento. Tente novamente.");
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

  const getStatusStyle = (status: number | string) => {
    const textStatus = getStatusText(status);
    switch (textStatus) {
      case 'Realizado': return 'bg-green-100 text-green-700';
      case 'Cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
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
          to="/agendamento"
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
          {sortedAppointments.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                Nenhum agendamento encontrado.
              </td>
            </tr>
          ) : (
            sortedAppointments.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-700">{app.nomePaciente}</td>
                <td className="px-6 py-4 text-slate-600">
                  {app.dataAgendamento ? format(parseISO(app.dataAgendamento.split('T')[0]), 'dd/MM/yyyy') : '-'}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {app.horaAgendamento?.split(':').slice(0, 2).join(':')}
                </td>

                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusStyle(app.status)}`}>
                    {getStatusText(app.status)}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-4">
                    {getStatusText(app.status) === 'Agendado' ? (
                      <button
                        onClick={() => handleEditar(app.id)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar Agendamento"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="w-8 h-8" aria-hidden="true" />
                    )}

                    {getStatusText(app.status) === 'Agendado' ? (
                      <button
                        onClick={() => handleCancelar(app.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancelar Agendamento"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="w-8 h-8" aria-hidden="true" />
                    )}
                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};