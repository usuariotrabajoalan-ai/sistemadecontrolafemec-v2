import Link from 'next/link';
import { getPendingTasks } from './actions';

export default async function ExtrasHomePage() {
  const pendingTasks = await getPendingTasks();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <img 
            src="/logo.png" 
            alt="AFEMEC - Sede Social" 
            className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white bg-white"
          />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Trabajos Extras</h1>
        <p className="text-sm text-slate-500 font-medium">Seleccioná una solicitud para ejecutarla</p>
      </div>

      <div className="flex flex-col gap-3 max-w-lg mx-auto">
        {pendingTasks.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="text-4xl mb-2">🙌</div>
            <p className="text-slate-500 m-0">No hay solicitudes de trabajos extras pendientes.</p>
          </div>
        ) : (
          pendingTasks.map(task => (
            <Link 
              key={task.id} 
              href={`/extras/worker/${task.id}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all no-underline"
            >
              <div className="text-2xl w-10 h-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                📋
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-bold text-slate-800 m-0">{task.taskTypeName}</h2>
                <p className="text-xs text-slate-500 m-0">
                  📍 {task.sector} | 👤 Solicitado por: {task.requestedBy}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
