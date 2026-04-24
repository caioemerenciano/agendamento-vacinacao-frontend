import { useState } from 'react';
import { format } from 'date-fns';
import { postAgendamento } from '../services/formularioAgendamentoService';
import type { AgendamentoFormData, AgendamentoResponse } from '../types/agendamento';

interface UseAgendamentoOptions {
  onSuccess?: (data: AgendamentoResponse) => void;
}

export const useAgendamento = ({ onSuccess }: UseAgendamentoOptions = {}) => {
  const [formData, setFormData] = useState<AgendamentoFormData>({
    fullName: '',
    dateOfBirth: null,
    appointmentDate: null,
    time: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: keyof AgendamentoFormData, date: Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleTimeChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({ ...prev, time: format(date, 'HH:mm') }));
    } else {
      setFormData((prev) => ({ ...prev, time: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.dateOfBirth || !formData.appointmentDate || !formData.time) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setIsLoading(true);

      const payloadParaAPI = {
        nome: formData.fullName,
        dataNascimento: format(formData.dateOfBirth, 'yyyy-MM-dd'),
        dataAgendamento: format(formData.appointmentDate, 'yyyy-MM-dd'),
        horario: formData.time,
      };

      console.log('Enviando payload para a API:', payloadParaAPI);

      const response = await postAgendamento(payloadParaAPI);

      console.log('Resposta do Servidor:', response.data);
      alert('Agendamento enviado ao servidor com sucesso!');

      if (onSuccess) {
        onSuccess({
          id: Math.random().toString(),
          nomePaciente: formData.fullName,
          dataAgendamento: format(formData.appointmentDate, 'MM/dd/yyyy'),
          horaAgendamento: formData.time,
          status: 'Confirmed',
        });
      }

      setFormData({
        fullName: '',
        dateOfBirth: null,
        appointmentDate: null,
        time: '',
      });

    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      alert('Ocorreu um erro na comunicação com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
  };
};