export interface AgendamentoFormData {
  nomeCompleto: string;
  dataNascimento: Date | null;
  dataAgendamento: Date | null;
  horario: string;
}

export interface AgendamentoPayload {
  nome: string;
  dataNascimento: string;
  dataAgendamento: string;
  horario: string;
}

export interface AgendamentoResponse {
  id: number;
  nomePaciente: string;
  dataAgendamento: string;
  horaAgendamento: string;
  status: 1 | 2 | 3 | 'Agendado' | 'Realizado' | 'Cancelado' | string | number;
}
