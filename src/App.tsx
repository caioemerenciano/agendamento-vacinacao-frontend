import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FormularioAgendamento } from './components/FormularioAgendamento';
import { ListagemAgendamentos } from './components/listagemAgendamentos';

function App() {
  return (
    <BrowserRouter>
      <main className="w-full min-h-screen bg-[#f1f5f9]">
        <Routes>
          {/* Rota principal: O Formulário */}
          <Route
            path="/"
            element={
              <div className="flex items-center justify-center p-4 min-h-screen">
                <FormularioAgendamento />
              </div>
            }
          />

          {/* Rota da Listagem */}
          <Route
            path="/listagem"
            element={
              <div className="w-full flex flex-col items-center min-h-screen relative p-4">
                <ListagemAgendamentos />
              </div>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;