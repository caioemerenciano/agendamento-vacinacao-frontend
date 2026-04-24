import { useState } from 'react';
import type { AgendamentoFormData, AgendamentoPayload } from '../types/agendamento';
import { format } from 'date-fns';

export const useAgendamento = () => {
  const [formData, setFormData] = useState<AgendamentoFormData>({
    fullName: '',
    dateOfBirth: null,
    appointmentDate: null,
    time: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: keyof AgendamentoFormData, date: Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleTimeChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({ ...prev, time: format(date, 'hh:mm aa') }));
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
      const payload: AgendamentoPayload = {
        fullName: formData.fullName,
        dateOfBirth: format(formData.dateOfBirth, 'yyyy-MM-dd'),
        appointmentDate: format(formData.appointmentDate, 'yyyy-MM-dd'),
        time: formData.time,
      };

      console.log('Submitting payload:', payload);

      alert('Agendamento realizado com sucesso!');

      setFormData({
        fullName: '',
        dateOfBirth: null,
        appointmentDate: null,
        time: '',
      });
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      alert('Ocorreu um erro ao agendar a consulta.');
    }
  };

  return {
    formData,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
  };
};
