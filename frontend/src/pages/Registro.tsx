import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3004';

interface Usuario {
  nombre: string;
  email: string;
  password: string;
  rol: 'admin' | 'staff' | 'guest' | 'manager';
}

const Registro = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario>({
    nombre: '',
    email: '',
    password: '',
    rol: 'staff',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const [firstName, ...rest] = usuario.nombre.trim().split(' ');
    const lastName = rest.join(' ') || ' '; // Dejar valor para el backend

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        email: usuario.email,
        password: usuario.password,
        firstName,
        lastName,
        role: usuario.rol,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        navigate('/agente-virtual');
        return;
      }

      setError(response.data.error || 'Error al registrar usuario');
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registro de Usuario
          </h2>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="nombre" className="sr-only">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nombre completo"
                value={usuario.nombre}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={usuario.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={usuario.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="rol" className="sr-only">Rol</label>
              <select
                id="rol"
                name="rol"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={usuario.rol}
                onChange={handleChange}
              >
                <option value="admin">Administrador</option>
                <option value="staff">Recepcionista</option>
                <option value="manager">Gerente</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Registrar Usuario
            </button>
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;