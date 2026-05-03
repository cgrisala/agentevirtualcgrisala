// Agregamos la prop 'alEntrar'
import { useNavigate } from 'react-router-dom';

export const Login = ({ alEntrar }: { alEntrar: () => void }) => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    alEntrar(); // Activa la función para mostrar el Dashboard
    navigate('/dashboard');
  };

  return (
    // ... resto del código del diseño ...
    <form onSubmit={handleSubmit}> 
      {/* ... tus inputs de usuario y contraseña ... */}
      <button type="submit" className="w-full bg-blue-600 ...">
        Entrar
      </button>
    </form>
    // ...
  );
};