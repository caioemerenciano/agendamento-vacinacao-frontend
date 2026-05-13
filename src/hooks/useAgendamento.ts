import { useState, useCallback, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { postAgendamento, getAgendamentoPorId, putAgendamento } from '../services/formularioAgendamentoService';
import type { AgendamentoFormData, AgendamentoResponse } from '../types/agendamento';
import { isAxiosError } from 'axios';
import { modalService } from '../services/modalService';
import { servicoAutenticacao } from '../services/authService';

interface UseAgendamentoOptions {
  idAgendamento?: number;
  onSuccess?: (data: AgendamentoResponse) => void;
  agendamentoId?: string | number;
}

export const useAgendamento = ({ onSuccess, agendamentoId }: UseAgendamentoOptions = {}) => {
  const [formData, setFormData] = useState<AgendamentoFormData>({
    nomeCompleto: '',
    dataNascimento: '',
    dataAgendamento: '',
    horaAgendamento: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    if (!agendamentoId) {
      const isAuth = servicoAutenticacao.estaAutenticado();
      const perfil = servicoAutenticacao.getUsuarioPerfil();

      if (isAuth && perfil === 'Paciente') {
        const { nome, dataNascimento } = servicoAutenticacao.getUsuarioDados();
        if (nome && dataNascimento) {
          setFormData(prev => ({
            ...prev,
            nomeCompleto: nome,
            dataNascimento: format(parseISO(dataNascimento), 'dd/MM/yyyy')
          }));
          setIsReadOnly(true);
        }
      }
    }
  }, [agendamentoId]);

  const carregarDadosAgendamento = useCallback(async (id: string | number) => {
    try {
      setIsLoading(true);
      const response = await getAgendamentoPorId(id);
      const data = response.data;

      setFormData({
        nomeCompleto: data.nomePaciente,
        dataNascimento: data.dataNascimento ? format(parseISO(data.dataNascimento), 'dd/MM/yyyy') : '',
        dataAgendamento: data.dataAgendamento ? format(parseISO(data.dataAgendamento), 'dd/MM/yyyy') : '',
        horaAgendamento: data.horaAgendamento.split(':').slice(0, 2).join(':'),
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      modalService.showError('Não foi possível carregar os dados do agendamento.');
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
    const dateString = date ? format(date, 'dd/MM/yyyy') : '';
    setFormData((prev) => ({ ...prev, [name]: dateString }));
  };

  const handleTimeChange = (date: Date | null) => {
    if (date) {
      const snappedDate = new Date(date);
      snappedDate.setMinutes(0);
      snappedDate.setSeconds(0);
      setFormData((prev) => ({ ...prev, horaAgendamento: format(snappedDate, 'HH:mm') }));
    } else {
      setFormData((prev) => ({ ...prev, horaAgendamento: '' }));
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const nomeTrimmed = formData.nomeCompleto.trim();
    const partesDoNome = nomeTrimmed.split(/\s+/);

    if (!nomeTrimmed || !formData.dataNascimento || !formData.dataAgendamento || !formData.horaAgendamento) {
      modalService.showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (partesDoNome.length < 2) {
      modalService.showError('Por favor, digite seu nome completo (nome e sobrenome).');
      return;
    }

    try {
      setIsLoading(true);

      const parseDate = (dStr: string) => {
        const [d, m, y] = dStr.split('/');
        return `${y}-${m}-${d}`;
      };

      const payloadParaAPI = {
        nome: formData.nomeCompleto,
        dataNascimento: parseDate(formData.dataNascimento),
        dataAgendamento: parseDate(formData.dataAgendamento),
        horaAgendamento: `${formData.horaAgendamento}:00`,
      };

      console.log('Enviando payload para a API:', payloadParaAPI);

      let response;
      if (agendamentoId) {
        response = await putAgendamento(agendamentoId, {
          dataAgendamento: payloadParaAPI.dataAgendamento,
          horaAgendamento: payloadParaAPI.horaAgendamento
        });
        modalService.showSuccess('Agendamento atualizado com sucesso!');
      } else {
        response = await postAgendamento(payloadParaAPI);

        // [Desenvolvedor Sênior]: Atualização Reativa e Otimista
        setIsReadOnly(true);
        setFormData(prev => ({
          ...prev,
          dataAgendamento: '',
          horaAgendamento: '',
        }));

        // Persistência Local: Garante que o perfil continue bloqueado após refresh
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          localStorage.setItem('user', JSON.stringify({
            ...user,
            Nome: payloadParaAPI.nome,
            DataNascimento: payloadParaAPI.dataNascimento
          }));
        }

        modalService.showSuccess('Agendamento realizado com sucesso!');
      }

      if (onSuccess) {
        onSuccess(response.data);
      }

    } catch (error) {
      console.error('Erro ao conectar com a API:', error);

      if (isAxiosError(error) && error.response?.data) {
        const respostaDaApi = error.response.data;

        if (typeof respostaDaApi === 'string' && respostaDaApi.includes('Exception:')) {
          const primeiraLinha = respostaDaApi.split('\n')[0];
          const mensagemLimpa = primeiraLinha.split('Exception:')[1]?.trim() || 'Erro de regra de negócio no servidor.';
          modalService.showError(`Atenção: ${mensagemLimpa}`);
        }
        else if (Array.isArray(respostaDaApi) && respostaDaApi.length > 0) {
          const errosTexto = respostaDaApi.map((e: any) => e.errorMessage || e.ErrorMessage || 'Dado inválido.').join('\n');
          modalService.showError(`Atenção:\n${errosTexto}`);
        }
        else if (respostaDaApi.mensagem) {
          modalService.showError(`Atenção: ${respostaDaApi.mensagem}`);
        }
        else if (respostaDaApi.errors) {
          const listaDeErros = Object.values(respostaDaApi.errors).flat();
          if (listaDeErros.length > 0) {
            modalService.showError(String(listaDeErros[0]));
          } else {
            modalService.showError('Verifique se todos os campos foram preenchidos corretamente.');
          }
        }
        else if (respostaDaApi.title) {
          modalService.showError(`Atenção: ${respostaDaApi.title}`);
        }
        else if (error.response.status === 403) {
          modalService.showError('Você não tem permissão para realizar esta ação.');
        }
        else {
          modalService.showError('Dados inválidos. Não foi possível realizar a operação.');
        }
      } else {
        modalService.showError('Ocorreu um erro de conexão com o servidor. Tente novamente mais tarde.');
      }

    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    carregarDadosAgendamento,
    isReadOnly
  };
};