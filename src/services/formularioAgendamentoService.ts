import { api } from './api';

export interface AgendamentoData {
    id?: number;
    nome: string;
    dataNascimento: string;
    dataAgendamento: string;
    horaAgendamento: string;
}

export const postAgendamento = async (dados: AgendamentoData) => {
    return await api.post('/agendamento', dados);
};

export const getAgendamentoPorId = async (id: string | number) => {
    return await api.get(`/agendamento/${id}`);
};

export const getAgendamento = getAgendamentoPorId;

export const putAgendamento = async (id: string | number, dados: { dataAgendamento: string; horaAgendamento: string } | AgendamentoData) => {
    return await api.put(`/agendamento/${id}`, dados);
};

export const patchCancelarAgendamento = async (id: string | number) => {
    return await api.patch(`/agendamento/${id}/cancelar`);
};

export const patchRealizarAgendamento = async (id: string | number) => {
    return await api.patch(`/agendamento/${id}/realizar`);
};
