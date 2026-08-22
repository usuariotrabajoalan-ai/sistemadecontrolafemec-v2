'use client';

import { useState } from 'react';
import Link from 'next/link';
import { addTaskType, updateTaskType, deleteTaskType } from '../../actions';

type TaskType = { id: number; name: string };

export default function TasksClient({ initialTasks }: { initialTasks: TaskType[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [name, setName] = useState('');

  const openModal = (task?: TaskType) => {
    if (task) {
      setEditingTask(task);
      setName(task.name);
    } else {
      setEditingTask(null);
      setName('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      await updateTaskType(editingTask.id, name);
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, name } : t));
    } else {
      // Refreshing whole page is simpler, or optimistically update. 
      // For Next.js Server Actions, doing router.refresh() inside the action works better 
      // if we just re-fetch, but here we can just reload for simplicity.
      window.location.reload(); 
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar este tipo de extra?')) {
      await deleteTaskType(id);
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/extras/admin" className="text-red-700 text-sm font-medium mb-4 inline-block">← Volver al panel</Link>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 m-0">Tipos de Extras</h1>
        <button onClick={() => openModal()} className="bg-red-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-800">
          + Agregar Extra
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {tasks.length === 0 ? (
          <div className="text-center p-8 text-slate-500">No hay tipos de extras registrados</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-700">Nombre del Extra</th>
                <th className="p-4 font-semibold text-slate-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4 text-slate-800">{task.name}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openModal(task)} className="text-blue-600 hover:underline text-sm mr-4">Editar</button>
                    <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
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
              <h3 className="font-bold text-lg">{editingTask ? 'Editar' : 'Agregar'} Tipo de Extra</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Extra</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-slate-300 rounded focus:border-red-500 outline-none"
                  placeholder="Ej: Pintura, Poda..."
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
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
