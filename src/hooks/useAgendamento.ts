import { useState } from 'react';
import { format } from 'date-fns';
import { postAgendamento } from '../services/formularioAgendamentoService';
import type { AgendamentoFormData, AgendamentoResponse } from '../types/agendamento';
import { isAxiosError } from 'axios';

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

  const handleSubmit = async (e: React.SyntheticEvent) => {
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

      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Resposta do Servidor:', response.data);

      if (onSuccess) {
        onSuccess(response.data);
      }

      setFormData({
        fullName: '',
        dateOfBirth: null,
        appointmentDate: null,
        time: '',
      });

    } catch (error) {
      console.error('Erro ao conectar com a API:', error);

      if (isAxiosError(error) && error.response?.data) {
        const respostaDaApi = error.response.data;

        console.log('debug testando:', respostaDaApi);

        if (typeof respostaDaApi === 'string' && respostaDaApi.includes('Exception:')) {
          const primeiraLinha = respostaDaApi.split('\n')[0];
          const mensagemLimpa = primeiraLinha.split('Exception:')[1]?.trim() || 'Erro de regra de negócio no servidor.';
          alert(`Atenção: ${mensagemLimpa}`);
        }
        else if (Array.isArray(respostaDaApi) && respostaDaApi.length > 0) {
          const errosTexto = respostaDaApi.map((e: any) => e.errorMessage || e.ErrorMessage || 'Dado inválido.').join('\n');
          alert(`Atenção:\n${errosTexto}`);
        }
        else if (respostaDaApi.mensagem) {
          alert(`Atenção: ${respostaDaApi.mensagem}`);
        }
        else if (respostaDaApi.errors) {
          const listaDeErros = Object.values(respostaDaApi.errors).flat();

          if (listaDeErros.length > 0) {
            alert(`Atenção: ${String(listaDeErros[0])}`);
          } else {
            alert('Verifique se todos os campos foram preenchidos corretamente.');
          }
        }
        else if (respostaDaApi.title) {
          alert(`Atenção: ${respostaDaApi.title}`);
        }
        else {
          alert('Dados inválidos. Não foi possível realizar o agendamento.');
        }
      } else {
        alert('Ocorreu um erro de conexão com o servidor. Tente novamente mais tarde.');
      }

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