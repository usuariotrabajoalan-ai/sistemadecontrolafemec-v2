import Link from 'next/link';
import { getAllRecords } from '../../actions';

export default async function AdminRecordsPage() {
  const records = await getAllRecords();

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <Link href="/extras/admin" className="text-red-700 text-sm font-medium mb-4 inline-block">← Volver al panel</Link>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 m-0">Reportes y Registros</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        {records.length === 0 ? (
          <div className="text-center p-8 text-slate-500">No hay registros disponibles</div>
        ) : (
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-700">ID</th>
                <th className="p-4 font-semibold text-slate-700">Tarea</th>
                <th className="p-4 font-semibold text-slate-700">Sector</th>
                <th className="p-4 font-semibold text-slate-700">Solicitante</th>
                <th className="p-4 font-semibold text-slate-700">Funcionario</th>
                <th className="p-4 font-semibold text-slate-700">Estado</th>
                <th className="p-4 font-semibold text-slate-700">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 text-sm">
                  <td className="p-4 text-slate-500">#{record.id}</td>
                  <td className="p-4 text-slate-800 font-medium">{record.taskTypeName}</td>
                  <td className="p-4 text-slate-600">{record.sector}</td>
                  <td className="p-4 text-slate-600">{record.requestedBy}</td>
                  <td className="p-4 text-slate-600">{record.staffName || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      record.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      record.status === 'VERIFYING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{new Date(record.createdAt).toLocaleDateString('es-PY')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
