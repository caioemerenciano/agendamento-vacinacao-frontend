import { useState } from 'react';
import { format } from 'date-fns';
import { postAgendamento } from '../services/agendamentoService';
import type { AgendamentoFormData } from '../types/agendamento';

export const useAgendamento = () => {
  const [formData, setFormData] = useState<AgendamentoFormData>({
    fullName: '',
    dateOfBirth: null,
    appointmentDate: null,
    time: '',
  });

  // Estado de loading exigido pelas regras de execução do desafio
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
      // Ajustado para HH:mm (formato 24h, ex: 15:00) 
      // Isso evita que o TimeSpan.Parse do C# quebre ao tentar ler "PM/AM"
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
      // 1. Ativa o estado de carregamento
      setIsLoading(true);

      // 2. O "Tradutor": Mapeia o estado do React (inglês) para o DTO do C# (português)
      const payloadParaAPI = {
        nome: formData.fullName,
        dataNascimento: format(formData.dateOfBirth, 'yyyy-MM-dd'),
        dataAgendamento: format(formData.appointmentDate, 'yyyy-MM-dd'),
        horario: formData.time,
      };

      console.log('Enviando payload para a API:', payloadParaAPI);

      // 3. A Chamada Real usando o serviço do Axios
      const response = await postAgendamento(payloadParaAPI);

      console.log('Resposta do Servidor:', response.data);
      alert('Agendamento enviado ao servidor com sucesso!');

      // 4. Limpa o formulário após o sucesso
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
      // 5. Independente de dar sucesso ou erro, desliga o loading
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading, // Exportando para você usar no botão "Confirmar"
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
  };
};