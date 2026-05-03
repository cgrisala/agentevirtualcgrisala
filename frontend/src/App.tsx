import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AgenteVirtual from './pages/AgenteVirtual';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';
import Reservations from './pages/Reservations';
import Rooms from './pages/Rooms';

function App() {
  const [estaAutenticado, setEstaAutenticado] = useState(() => !!localStorage.getItem('token'));

  const manejarLogin = () => {
    setEstaAutenticado(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login alEntrar={manejarLogin} />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/agente-virtual" element={estaAutenticado ? <AgenteVirtual /> : <Login alEntrar={manejarLogin} />} />
        <Route path="/dashboard" element={estaAutenticado ? <Dashboard /> : <Login alEntrar={manejarLogin} />} />
        <Route path="/reservations" element={estaAutenticado ? <Reservations /> : <Login alEntrar={manejarLogin} />} />
        <Route path="/guests" element={estaAutenticado ? <Guests /> : <Login alEntrar={manejarLogin} />} />
        <Route path="/rooms" element={estaAutenticado ? <Rooms /> : <Login alEntrar={manejarLogin} />} />
        <Route path="/" element={estaAutenticado ? <AgenteVirtual /> : <Login alEntrar={manejarLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;