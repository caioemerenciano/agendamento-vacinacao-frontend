export interface AgendamentoFormData {
  fullName: string;
  dateOfBirth: Date | null;
  appointmentDate: Date | null;
  time: string;
}

export interface AgendamentoPayload {
  fullName: string;
  dateOfBirth: string; // 'yyyy-MM-dd'
  appointmentDate: string; // 'yyyy-MM-dd'
  time: string;
}

export interface AgendamentoResponse {
  id: string | number;
  nomePaciente: string;
  dataAgendamento: string;
  horaAgendamento: string;
  status: 'Confirmed' | 'Pending' | 'Canceled';
}
