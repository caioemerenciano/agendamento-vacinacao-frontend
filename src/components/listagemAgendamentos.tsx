import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Pencil, XCircle, CheckCircle } from 'lucide-react';
import { modalService } from '../services/modalService';
import { format, parseISO } from 'date-fns';
import { getAgendamentos } from '../services/listagemAgendamentoService';
import { patchCancelarAgendamento, patchRealizarAgendamento } from '../services/formularioAgendamentoService';
import { servicoAutenticacao } from '../services/authService';
import type { AgendamentoResponse } from '../types/agendamento';

export const ListagemAgendamentos = () => {
  const [appointments, setAppointments] = useState<AgendamentoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const currentUserId = servicoAutenticacao.getUsuarioId();
  const currentRole = servicoAutenticacao.getUsuarioPerfil();
  const eEnfermeiro = currentRole === 'Enfermeiro';

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);
      const dados = await getAgendamentos();
      setAppointments(dados);
      setError(false);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const handleCancelar = (id: number) => {
    modalService.showConfirm(
      "Deseja realmente cancelar este agendamento?",
      async () => {
        try {
          await patchCancelarAgendamento(id);
          modalService.showSuccess("Agendamento cancelado com sucesso!");
          fetchAgendamentos();
        } catch (error: any) {
          console.error("Erro ao cancelar:", error);
          modalService.showError(error.response?.data?.mensagem || "Erro ao cancelar agendamento.");
        }
      },
      "Cancelar Agendamento"
    );
  };

  const handleMarcarRealizado = (id: number) => {
    modalService.showConfirm(
      "Confirmar a realização deste agendamento?",
      async () => {
        try {
          await patchRealizarAgendamento(id);
          modalService.showSuccess("Agendamento marcado como realizado!");
          fetchAgendamentos();
        } catch (error: any) {
          console.error("Erro ao realizar:", error);
          modalService.showError("Erro ao registrar realização do agendamento.");
        }
      },
      "Confirmar Realização"
    );
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

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const statusA = getStatusText(a.status);
      const statusB = getStatusText(b.status);

      const priority: Record<string, number> = { 'Agendado': 1, 'Realizado': 2, 'Cancelado': 3 };
      if (priority[statusA] !== priority[statusB]) {
        return priority[statusA] - priority[statusB];
      }

      const dateA = new Date(`${a.dataAgendamento.split('T')[0]}T${a.horaAgendamento}`).getTime();
      const dateB = new Date(`${b.dataAgendamento.split('T')[0]}T${b.horaAgendamento}`).getTime();

      if (statusA === 'Agendado') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }, [appointments]);

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
              <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Você ainda não possui agendamentos marcados.</td>
            </tr>
          ) : (
            sortedAppointments.map((app) => {
              const statusTexto = getStatusText(app.status);
              const podeEditar = statusTexto === 'Agendado';
              const eDono = app.idPaciente === currentUserId;
              const mostrarAcoesBasicas = podeEditar && (eDono || eEnfermeiro);
              const mostrarAcaoRealizado = eEnfermeiro && podeEditar;

              return (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{app.nomePaciente}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {format(parseISO(app.dataAgendamento), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {app.horaAgendamento?.split(':').slice(0, 2).join(':')}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusStyle(app.status)}`}>
                      {statusTexto}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-4 min-w-[100px]">
                      {mostrarAcoesBasicas && (
                        <>
                          <Pencil
                            className="w-5 h-5 text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
                            onClick={() => navigate(`/agendamento/editar/${app.id}`)}
                          />
                          <button
                            onClick={() => handleCancelar(app.id)}
                            className="hover:scale-110 transition-transform"
                            title="Cancelar Agendamento"
                          >
                            <XCircle className="w-5 h-5 text-red-500 hover:text-red-700" />
                          </button>
                        </>
                      )}

                      {mostrarAcaoRealizado && (
                        <CheckCircle
                          className="w-5 h-5 text-green-500 hover:text-green-700 cursor-pointer transition-colors"
                          onClick={() => handleMarcarRealizado(app.id)}
                        />
                      )}

                      {!mostrarAcoesBasicas && !mostrarAcaoRealizado && (
                        <div className="w-14 h-5" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
