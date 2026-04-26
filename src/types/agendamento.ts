export interface AgendamentoFormData {
  nomeCompleto: string;
  dataNascimento: string;
  dataAgendamento: string;
  horaAgendamento: string;
}

export interface AgendamentoPayload {
  nome: string;
  dataNascimento: string;
  dataAgendamento: string;
  horaAgendamento: string;
}

export interface AgendamentoResponse {
  id: number;
  idPaciente: number;
  nomePaciente: string;
  dataAgendamento: string;
  horaAgendamento: string;
  status: 1 | 2 | 3 | 'Agendado' | 'Realizado' | 'Cancelado' | string | number;
}
