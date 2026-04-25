import { useMemo } from 'react';
import { useAgendamento } from '../hooks/useAgendamento';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/Input';
import { DatePicker } from './ui/DatePicker';
import { TimePicker } from './ui/TimePicker';
import { Button } from './ui/Button';
import { Syringe, ShieldCheck, Loader2 } from 'lucide-react';
import { parse, isToday, startOfDay, endOfDay } from 'date-fns';
import type { AgendamentoResponse } from '../types/agendamento';

interface FormularioProps {
  onSuccess?: (data: AgendamentoResponse) => void;
}

export const FormularioAgendamento: React.FC<FormularioProps> = ({ onSuccess }) => {
  const navigate = useNavigate();

  const { formData, isLoading, handleChange, handleDateChange, handleTimeChange, handleSubmit } = useAgendamento({
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
      navigate('/listagem');
    }
  });

  const selectedTime = useMemo(() => {
    if (!formData.time) return null;
    return parse(formData.time, 'HH:mm', new Date());
  }, [formData.time]);

  const isAppointmentToday = formData.appointmentDate
    ? isToday(formData.appointmentDate)
    : false;

  const minTimeForPicker = isAppointmentToday
    ? new Date()
    : startOfDay(new Date());

  const maxTimeForPicker = endOfDay(new Date());

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 px-8 py-10 w-full max-w-md mx-auto">

      <div className="flex flex-col items-center mb-6">
        <div className="bg-sky-100 p-3 rounded-full mb-4">
          <Syringe className="text-[#0284c7] w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Cronograma de vacinação</h1>
        <p className="text-sm font-medium text-slate-400">Sistema de agendamento de COVID-19</p>
      </div>

      <hr className="border-slate-100 mb-6" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nome Completo"
          name="fullName"
          placeholder="Preencha com o nome completo"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <DatePicker
          label="Data de aniversário"
          selected={formData.dateOfBirth}
          onChange={(date) => handleDateChange('dateOfBirth', date)}
        />

        <div className="flex flex-row gap-4">
          <DatePicker
            label="Data da consulta"
            selected={formData.appointmentDate}
            onChange={(date) => handleDateChange('appointmentDate', date)}
            minDate={new Date()}
            className="flex-1"
          />
          <TimePicker
            label="Horário da consulta"
            selected={selectedTime}
            onChange={(date) => handleTimeChange(date)}
            minTime={minTimeForPicker}
            maxTime={maxTimeForPicker}
            className="flex-1"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Agendando...
              </span>
            ) : (
              'Confirmar agendamento'
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