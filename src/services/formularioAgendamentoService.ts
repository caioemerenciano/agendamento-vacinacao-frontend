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

export const getAgendamento = async (id: number) => {
    return await api.get(`/agendamento/${id}`);
};

export const putAgendamento = async (id: number, dados: AgendamentoData) => {
    return await api.put(`/agendamento?id=${id}`, dados);
};