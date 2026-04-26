import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FormularioAgendamento } from './components/formularioAgendamento';
import { ListagemAgendamentos } from './components/listagemAgendamentos';
import { Auth } from './components/Auth';
import { AuthGuard } from './components/AuthGuard';

function App() {
  return (
    <BrowserRouter>
      <main className="w-full min-h-screen bg-[#f1f5f9]">
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex items-center justify-center p-4 min-h-screen">
                <Auth />
              </div>
            }
          />

          <Route element={<AuthGuard />}>
            <Route
              path="/agendamento"
              element={
                <div className="flex items-center justify-center p-4 min-h-screen">
                  <FormularioAgendamento />
                </div>
              }
            />

            <Route
              path="/listagem"
              element={
                <div className="w-full flex flex-col items-center min-h-screen relative p-4">
                  <ListagemAgendamentos />
                </div>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;