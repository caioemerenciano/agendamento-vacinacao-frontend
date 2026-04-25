import { api } from './api';
import type { AgendamentoResponse } from '../types/agendamento';

export const getAgendamentos = async (): Promise<AgendamentoResponse[]> => {
    const response = await api.get<AgendamentoResponse[]>('/agendamento');
    return response.data;
};

export const updateStatusAgendamento = async (id: number | string, novoStatus: number) => {
    return await api.patch(`/agendamento/${id}/status`, { novoStatus });
};

