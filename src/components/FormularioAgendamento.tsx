import { useMemo, useEffect } from 'react';
import { useAgendamento } from '../hooks/useAgendamento';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from './ui/Input';
import { DatePicker } from './ui/DatePicker';
import { TimePicker } from './ui/TimePicker';
import { Button } from './ui/Button';
import { Syringe, ShieldCheck, Loader2 } from 'lucide-react';
import { parse, isToday, setHours, setMinutes } from 'date-fns';
import type { AgendamentoResponse } from '../types/agendamento';

interface FormularioProps {
  onSuccess?: (data: AgendamentoResponse) => void;
}

export const FormularioAgendamento: React.FC<FormularioProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { id: agendamentoId } = useParams<{ id: string }>();
  const isEditing = !!agendamentoId;

  const {
    formData,
    isLoading,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    carregarDadosAgendamento
  } = useAgendamento({
    agendamentoId,
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
      navigate('/listagem');
    }
  });

  useEffect(() => {
    if (agendamentoId) {
      carregarDadosAgendamento(agendamentoId);
    }
  }, [agendamentoId, carregarDadosAgendamento]);

  const horarioSelecionado = useMemo(() => {
    if (!formData.horaAgendamento) return null;
    return parse(formData.horaAgendamento, 'HH:mm', new Date());
  }, [formData.horaAgendamento]);

  const agendamentoDataObj = useMemo(() => {
    if (!formData.dataAgendamento) return null;
    return parse(formData.dataAgendamento, 'dd/MM/yyyy', new Date());
  }, [formData.dataAgendamento]);

  const agendamentoHoje = agendamentoDataObj
    ? isToday(agendamentoDataObj)
    : false;

  const horarioMinimo = useMemo(() => {
    const inicio = setHours(setMinutes(new Date(), 0), 8);
    if (agendamentoHoje) {
      const agora = new Date();
      return agora > inicio ? agora : inicio;
    }
    return inicio;
  }, [agendamentoHoje]);

  const horarioMaximo = useMemo(() => {
    return setHours(setMinutes(new Date(), 0), 17);
  }, []);

  const nomeValido = useMemo(() => {
    const trimmed = formData.nomeCompleto.trim();
    return trimmed.split(/\s+/).length >= 2;
  }, [formData.nomeCompleto]);

  const dataNascimentoValida = !!formData.dataNascimento && formData.dataNascimento.length === 10;
  const dataAgendamentoValida = !!formData.dataAgendamento && formData.dataAgendamento.length === 10;
  const horarioValido = !!formData.horaAgendamento;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 px-8 py-10 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-sky-100 p-3 rounded-full mb-4">
          <Syringe className="text-[#0284c7] w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          {isEditing ? 'Alterar agendamento' : 'Cronograma de vacinação'}
        </h1>
        <p className="text-sm font-medium text-slate-400">
          {isEditing ? 'Atualize os dados da sua consulta' : 'Sistema de agendamento de COVID-19'}
        </p>
      </div>

      <hr className="border-slate-100 mb-6" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nome do paciente"
          name="nomeCompleto"
          placeholder="Preencha com o nome completo"
          value={formData.nomeCompleto}
          onChange={handleChange}
          required={!nomeValido}
          disabled={isEditing}
        />

        <DatePicker
          label="Data de aniversário"
          selected={formData.dataNascimento}
          onChange={(date) => handleDateChange('dataNascimento', date)}
          maxDate={new Date()}
          required={!dataNascimentoValida}
          disabled={isEditing}
        />

        <div className="flex flex-row gap-4">
          <DatePicker
            label="Data da consulta"
            selected={formData.dataAgendamento}
            onChange={(date) => handleDateChange('dataAgendamento', date)}
            minDate={new Date()}
            className="flex-1"
            required={!dataAgendamentoValida}
          />
          <TimePicker
            label="Horário da consulta"
            selected={horarioSelecionado}
            onChange={(date) => handleTimeChange(date)}
            minTime={horarioMinimo}
            maxTime={horarioMaximo}
            className="flex-1"
            required={!horarioValido}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEditing ? 'Salvando...' : 'Agendando...'}
              </span>
            ) : (
              isEditing ? 'Salvar alterações' : 'Confirmar agendamento'
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-4 text-slate-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-medium">Seus dados estão protegidos</span>
        </div>
      </form>
    </div>
  );
};