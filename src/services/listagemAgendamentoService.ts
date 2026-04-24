import { api } from './api';
import type { AgendamentoResponse } from '../types/agendamento';

export const getAgendamentos = async (): Promise<AgendamentoResponse[]> => {
    const response = await api.get<AgendamentoResponse[]>('/agendamento');
    return response.data;
};
