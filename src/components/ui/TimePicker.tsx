import React from 'react';
import ReactDatePicker from 'react-datepicker';

interface TimePickerProps {
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  minTime?: Date;
  maxTime?: Date;
  required?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  selected,
  onChange,
  className = '',
  minTime,
  maxTime,
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
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60}
          timeCaption="Horário"
          dateFormat="HH:mm"
          placeholderText="09:00"
          minTime={minTime}
          maxTime={maxTime}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm bg-white"
        />
      </div>
    </div>
  );
};
