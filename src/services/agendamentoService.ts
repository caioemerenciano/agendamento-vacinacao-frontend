import { api } from './api';

export interface AgendamentoData {
    nome: string;
    dataNascimento: string;
    dataAgendamento: string;
    horario: string;
}

export const postAgendamento = async (dados: AgendamentoData) => {
    return await api.post('/agendamento', dados);
};