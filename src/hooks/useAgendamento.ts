import { useState, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { postAgendamento, getAgendamentoPorId, putAgendamento } from '../services/formularioAgendamentoService';
import type { AgendamentoFormData, AgendamentoResponse } from '../types/agendamento';
import { isAxiosError } from 'axios';

interface UseAgendamentoOptions {
  onSuccess?: (data: AgendamentoResponse) => void;
  agendamentoId?: string | number;
}

export const useAgendamento = ({ onSuccess, agendamentoId }: UseAgendamentoOptions = {}) => {
  const [formData, setFormData] = useState<AgendamentoFormData>({
    nomeCompleto: '',
    dataNascimento: null,
    dataAgendamento: null,
    horario: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const carregarDadosAgendamento = useCallback(async (id: string | number) => {
    try {
      setIsLoading(true);
      const response = await getAgendamentoPorId(id);
      const data = response.data;
      
      setFormData({
        nomeCompleto: data.nomePaciente,
        dataNascimento: parseISO(data.dataNascimento || new Date().toISOString()),
        dataAgendamento: parseISO(data.dataAgendamento),
        horario: data.horaAgendamento.split(':').slice(0, 2).join(':'),
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Não foi possível carregar os dados do agendamento.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: keyof AgendamentoFormData, date: Date | null) => {
    if (name === 'dataNascimento' && date && date > new Date()) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleTimeChange = (date: Date | null) => {
    if (date) {
      const snappedDate = new Date(date);
      snappedDate.setMinutes(0);
      snappedDate.setSeconds(0);
      setFormData((prev) => ({ ...prev, horario: format(snappedDate, 'HH:mm') }));
    } else {
      setFormData((prev) => ({ ...prev, horario: '' }));
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const nomeTrimmed = formData.nomeCompleto.trim();
    const partesDoNome = nomeTrimmed.split(/\s+/);

    if (!nomeTrimmed || !formData.dataNascimento || !formData.dataAgendamento || !formData.horario) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (partesDoNome.length < 2) {
      alert('Por favor, digite seu nome completo (nome e sobrenome).');
      return;
    }

    try {
      setIsLoading(true);

      const payloadParaAPI = {
        nome: formData.nomeCompleto,
        dataNascimento: format(formData.dataNascimento, 'yyyy-MM-dd'),
        dataAgendamento: format(formData.dataAgendamento, 'yyyy-MM-dd'),
        horaAgendamento: `${formData.horario}:00`,
      };

      console.log('Enviando payload para a API:', payloadParaAPI);

      let response;
      if (agendamentoId) {
        response = await putAgendamento(agendamentoId, {
          dataAgendamento: payloadParaAPI.dataAgendamento,
          horaAgendamento: payloadParaAPI.horaAgendamento
        });
        alert('Agendamento atualizado com sucesso!');
      } else {
        response = await postAgendamento(payloadParaAPI);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (onSuccess) {
        onSuccess(response.data);
      }

      if (!agendamentoId) {
        setFormData({
          nomeCompleto: '',
          dataNascimento: null,
          dataAgendamento: null,
          horario: '',
        });
      }

    } catch (error) {
      console.error('Erro ao conectar com a API:', error);

      if (isAxiosError(error) && error.response?.data) {
        const respostaDaApi = error.response.data;

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
        else if (error.response.status === 403) {
          alert('Você não tem permissão para realizar esta ação.');
        }
        else {
          alert('Dados inválidos. Não foi possível realizar a operação.');
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
    carregarDadosAgendamento
  };
};