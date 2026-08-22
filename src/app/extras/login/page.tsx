'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '../actions';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await loginAction(username, password);
      sessionStorage.setItem('afemec_user_role', user.role);
      sessionStorage.setItem('afemec_username', user.username);

      if (user.role === 'encargado') {
        router.push('/extras/encargado');
      } else {
        router.push('/extras/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Error de inicio de sesión');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-slate-200">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="AFEMEC" className="w-20 h-20 mx-auto rounded-full object-cover shadow-sm mb-4 bg-white" />
        <h2 className="text-xl font-bold text-slate-800">Acceso Administrativo</h2>
        <p className="text-sm text-slate-500 mt-1">Ingrese sus credenciales de AFEMEC</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
          <input
            type="text"
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            placeholder="Ej: admin"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            placeholder="Ingrese su contraseña"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
        >
          {loading ? 'Cargando...' : (
            <>
              <span>Iniciar Sesión</span>
              <span className="text-lg">→</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
