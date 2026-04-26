import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FormularioAgendamento } from './components/formularioAgendamento';
import { ListagemAgendamentos } from './components/listagemAgendamentos';
import { Auth } from './components/Auth';
import { AuthGuard } from './components/AuthGuard';
import { Header } from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
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
              path="/agendamento/editar/:id"
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;