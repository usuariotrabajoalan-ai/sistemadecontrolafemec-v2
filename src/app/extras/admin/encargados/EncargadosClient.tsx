'use client';

import { useState } from 'react';
import Link from 'next/link';
import { addAdminUser, deleteAdminUser } from '../../actions';

type AdminUser = { id: number; username: string; role: string };

export default function EncargadosClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('encargado');

  const openModal = () => {
    setUsername('');
    setRole('encargado');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAdminUser(username, role);
    window.location.reload(); 
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      await deleteAdminUser(id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/extras/admin" className="text-red-700 text-sm font-medium mb-4 inline-block">← Volver al panel</Link>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 m-0">Administradores</h1>
        <button onClick={() => openModal()} className="bg-red-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-800">
          + Agregar Usuario
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center p-8 text-slate-500">No hay usuarios registrados</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-700">Usuario</th>
                <th className="p-4 font-semibold text-slate-700">Rol</th>
                <th className="p-4 font-semibold text-slate-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4 text-slate-800">{user.username}</td>
                  <td className="p-4 text-slate-600">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role === 'admin' ? 'Administrador' : 'Encargado'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg">Agregar Usuario</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-4 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-slate-300 rounded focus:border-red-500 outline-none"
                    placeholder="Ej: mateo"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                  <select 
                    className="w-full p-2 border border-slate-300 rounded focus:border-red-500 outline-none"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  >
                    <option value="encargado">Encargado</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                  Nota: La contraseña por defecto será "123".
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded text-sm hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-700 text-white rounded text-sm hover:bg-red-800">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
