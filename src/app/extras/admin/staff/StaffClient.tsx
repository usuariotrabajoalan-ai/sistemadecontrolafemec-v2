'use client';

import { useState } from 'react';
import Link from 'next/link';
import { addStaff, updateStaff, deleteStaff } from '../../actions';

type Staff = { id: number; fullName: string; cedula: string };

export default function StaffClient({ initialStaff }: { initialStaff: Staff[] }) {
  const [staffList, setStaffList] = useState(initialStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [fullName, setFullName] = useState('');
  const [cedula, setCedula] = useState('');

  const openModal = (staff?: Staff) => {
    if (staff) {
      setEditingStaff(staff);
      setFullName(staff.fullName);
      setCedula(staff.cedula);
    } else {
      setEditingStaff(null);
      setFullName('');
      setCedula('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      await updateStaff(editingStaff.id, fullName, cedula);
    } else {
      await addStaff(fullName, cedula);
    }
    window.location.reload(); 
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar este funcionario?')) {
      await deleteStaff(id);
      setStaffList(staffList.filter(s => s.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/extras/admin" className="text-red-700 text-sm font-medium mb-4 inline-block">← Volver al panel</Link>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 m-0">Personal</h1>
        <button onClick={() => openModal()} className="bg-red-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-800">
          + Agregar Personal
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {staffList.length === 0 ? (
          <div className="text-center p-8 text-slate-500">No hay funcionarios registrados</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-700">Nombre Completo</th>
                <th className="p-4 font-semibold text-slate-700">Cédula</th>
                <th className="p-4 font-semibold text-slate-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map(staff => (
                <tr key={staff.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4 text-slate-800">{staff.fullName}</td>
                  <td className="p-4 text-slate-600">{staff.cedula}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openModal(staff)} className="text-blue-600 hover:underline text-sm mr-4">Editar</button>
                    <button onClick={() => handleDelete(staff.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
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
              <h3 className="font-bold text-lg">{editingStaff ? 'Editar' : 'Agregar'} Personal</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-4 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-slate-300 rounded focus:border-red-500 outline-none"
                    placeholder="Ej: Juan Pérez"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Número de Cédula</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-slate-300 rounded focus:border-red-500 outline-none"
                    placeholder="Ej: 1234567"
                    required
                    value={cedula}
                    onChange={e => setCedula(e.target.value)}
                  />
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
