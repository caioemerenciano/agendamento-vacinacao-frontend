import React from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import { parse } from 'date-fns';

registerLocale('pt-BR', ptBR);

interface DatePickerProps {
  label: string;
  selected: string | Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
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
  disabled,
  readOnly,
}) => {
  const applyDateMask = (value: string) => {
    if (!value || typeof value !== 'string') return '';
    const digits = value.replace(/\D/g, '').substring(0, 8);
    let masked = digits;
    if (digits.length > 2) masked = `${digits.substring(0, 2)}/${digits.substring(2)}`;
    if (digits.length > 4) masked = `${masked.substring(0, 5)}/${masked.substring(5)}`;
    return masked;
  };

  const parsedSelected = typeof selected === 'string' && selected
    ? parse(selected, 'dd/MM/yyyy', new Date())
    : (selected instanceof Date ? selected : null);

  return (
    <div className={`flex flex-col gap-1 w-full text-left ${className} ${disabled ? 'opacity-60' : ''}`}>
      <label className="text-sm font-semibold text-slate-800">
        {label} {required && !disabled && <span className="text-red-500">*</span>}
      </label>
      <div className="relative mt-1">
        <ReactDatePicker
          selected={parsedSelected}
          onChange={(date) => {
            onChange(date);
          }}
          onChangeRaw={(e) => {
            const el = e.target as HTMLInputElement;
            if (el && el.value) {
              el.value = applyDateMask(el.value);
            }
          }}
          dateFormat="dd/MM/yyyy"
          locale="pt-BR"
          placeholderText={placeholderText}
          minDate={minDate}
          maxDate={maxDate}
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          disabled={disabled}
          readOnly={readOnly}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm bg-white disabled:bg-slate-50 disabled:cursor-not-allowed read-only:bg-slate-50 read-only:cursor-not-allowed read-only:text-slate-500"
        />
      </div>
    </div>
  );
};
