import React from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);

interface DatePickerProps {
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  selected,
  onChange,
  placeholderText = 'DD/MM/YYYY',
  className = '',
  minDate,
  maxDate,
  required,
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full text-left ${className}`}>
      <label className="text-sm font-semibold text-slate-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative mt-1">
        <ReactDatePicker
          selected={selected}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          locale="pt-BR"
          placeholderText={placeholderText}
          minDate={minDate}
          maxDate={maxDate}
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm bg-white"
        />
      </div>
    </div>
  );
};
