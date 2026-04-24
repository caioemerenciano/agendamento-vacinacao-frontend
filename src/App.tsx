import { useState } from 'react';
import { FormularioAgendamento } from './components/FormularioAgendamento';
import { ListagemAgendamentos } from './components/listagemAgendamentos';
import type { AgendamentoResponse } from './types/agendamento';

const initialMockAppointments: AgendamentoResponse[] = [
  {
    id: 1,
    nomePaciente: 'Alice Smith',
    dataAgendamento: '10/24/2023',
    horaAgendamento: '09:00 AM',
    status: 'Confirmed',
  },
  {
    id: 2,
    nomePaciente: 'John Doe',
    dataAgendamento: '10/24/2023',
    horaAgendamento: '09:30 AM',
    status: 'Confirmed',
  },
];

function App() {
  const [currentScreen, setCurrentScreen] = useState<'form' | 'dashboard'>('form');
  const [appointments, setAppointments] = useState<AgendamentoResponse[]>(initialMockAppointments);

  const handleSuccess = (newAppointment: AgendamentoResponse) => {
    setAppointments(prev => [...prev, newAppointment]);
    setCurrentScreen('dashboard');
  };

  if (currentScreen === 'dashboard') {
    return (
      <div className="w-full flex-col items-center min-h-screen bg-[#f1f5f9]">
        <button 
          onClick={() => setCurrentScreen('form')} 
          className="absolute top-4 right-4 bg-white px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg shadow hover:bg-slate-50 transition-colors border border-slate-200 z-10"
        >
          Novo Agendamento
        </button>
        <ListagemAgendamentos appointments={appointments} />
      </div>
    );
  }

  return (
    <main className="w-full flex items-center justify-center p-4 min-h-screen bg-[#f1f5f9]">
      <FormularioAgendamento onSuccess={handleSuccess} />
    </main>
  );
}

export default App;
