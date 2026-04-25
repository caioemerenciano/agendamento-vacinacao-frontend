export interface AgendamentoFormData {
  fullName: string;
  dateOfBirth: Date | null;
  appointmentDate: Date | null;
  time: string;
}

export interface AgendamentoPayload {
  fullName: string;
  dateOfBirth: string;
  appointmentDate: string;
  time: string;
}

export interface AgendamentoResponse {
  id: number;
  nomePaciente: string;
  dataAgendamento: string;
  horaAgendamento: string;
  status: 1 | 2 | 3 | 'Agendado' | 'Realizado' | 'Cancelado' | string | number;
}
