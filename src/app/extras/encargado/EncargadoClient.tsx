'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { requestTask, cancelTask, verifyTask } from '../actions';

type TaskType = any;
type Record = any;

export default function EncargadoClient({ taskTypes, myPending, awaitingVerify }: { taskTypes: TaskType[], myPending: Record[], awaitingVerify: Record[] }) {
  const [activeTab, setActiveTab] = useState<'request'|'verify'|'pending'>('request');
  const [encargadoName, setEncargadoName] = useState('Encargado');

  useEffect(() => {
    setEncargadoName(sessionStorage.getItem('afemec_username') || 'Encargado');
  }, []);

  // Request Form State
  const [typeId, setTypeId] = useState('');
  const [sector, setSector] = useState('');
  const [desc, setDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await requestTask(Number(typeId), sector, desc, encargadoName);
      alert('Solicitud creada correctamente');
      setTypeId('');
      setSector('');
      setDesc('');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Error al crear solicitud');
    }
    setIsSubmitting(false);
  };

  const handleCancel = async (id: number) => {
    if(confirm('¿Seguro que deseas cancelar esta solicitud?')) {
      await cancelTask(id);
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/extras" className="text-red-700 text-sm font-medium mb-4 inline-block">← Volver al inicio</Link>
        <h1 className="text-2xl font-bold text-slate-800 m-0">Panel de {encargadoName}</h1>
        <p className="text-slate-500">Gestión de solicitudes y verificaciones</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setActiveTab('request')}
          className={`px-4 py-2 rounded text-sm font-medium ${activeTab === 'request' ? 'bg-red-700 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
        >Crear Solicitud</button>
        <button 
          onClick={() => setActiveTab('verify')}
          className={`px-4 py-2 rounded text-sm font-medium ${activeTab === 'verify' ? 'bg-red-700 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
        >Verificar Trabajos</button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded text-sm font-medium ${activeTab === 'pending' ? 'bg-red-700 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
        >Mis Solicitudes</button>
      </div>

      {activeTab === 'request' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4">Nueva Solicitud de Trabajo</h2>
          <form onSubmit={handleRequest} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Trabajo</label>
              <select required className="w-full p-2 border rounded" value={typeId} onChange={e => setTypeId(e.target.value)}>
                <option value="">Seleccione el tipo...</option>
                {taskTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sector</label>
              <input required type="text" className="w-full p-2 border rounded" placeholder="Ej. Quincho 10" value={sector} onChange={e => setSector(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción (Opcional)</label>
              <textarea className="w-full p-2 border rounded" rows={2} placeholder="Detalles..." value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            <button disabled={isSubmitting} type="submit" className="w-full bg-red-700 text-white py-2 rounded font-medium hover:bg-red-800">
              {isSubmitting ? 'Enviando...' : 'Generar Solicitud'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="flex flex-col gap-3">
          {myPending.filter(t => t.requestedBy === encargadoName).length === 0 ? (
            <div className="text-center p-8 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
              No tenés solicitudes pendientes de ejecución.
            </div>
          ) : myPending.filter(t => t.requestedBy === encargadoName).map(task => (
            <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 m-0">{task.taskTypeName}</h3>
                <p className="text-xs text-slate-500 m-0">📍 {task.sector}</p>
              </div>
              <button onClick={() => handleCancel(task.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200">
                Cancelar
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'verify' && (
        <div className="flex flex-col gap-3">
          {awaitingVerify.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
              No hay trabajos pendientes de verificación.
            </div>
          ) : awaitingVerify.map(task => (
            <VerifyItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

function VerifyItem({ task }: { task: Record }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [photosBefore, setPhotosBefore] = useState<string[]>([]);
  const [photosAfter, setPhotosAfter] = useState<string[]>([]);

  useEffect(() => {
    try {
      setPhotosBefore(JSON.parse(task.photosBefore || '[]'));
      setPhotosAfter(JSON.parse(task.photosAfter || '[]'));
    } catch(e) {}
  }, [task]);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleVerify = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    if(canvas.toDataURL() === blank.toDataURL()) {
      alert('Debe firmar antes de aprobar');
      return;
    }

    setIsVerifying(true);
    try {
      await verifyTask(task.id, canvas.toDataURL('image/png'));
      alert('Trabajo Aprobado');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Error al aprobar');
    }
    setIsVerifying(false);
  };

  // Simple Drawing implementation for React
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set actual size in memory (scaled to account for extra pixel density)
    const rect = canvas.parentElement?.getBoundingClientRect();
    canvas.width = rect?.width || 300;
    canvas.height = 150;

    let drawing = false;

    const getPos = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDraw = (e: any) => { e.preventDefault(); drawing = true; const pos = getPos(e); ctx.beginPath(); ctx.moveTo(pos.x, pos.y); };
    const draw = (e: any) => { if (!drawing) return; e.preventDefault(); const pos = getPos(e); ctx.lineTo(pos.x, pos.y); ctx.stroke(); };
    const stopDraw = () => { drawing = false; };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);
    canvas.addEventListener('touchstart', startDraw, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDraw);

    return () => {
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDraw);
      canvas.removeEventListener('mouseleave', stopDraw);
      canvas.removeEventListener('touchstart', startDraw);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDraw);
    };
  }, [isOpen]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3 className="font-bold text-slate-800 m-0">{task.taskTypeName} en {task.sector}</h3>
          <p className="text-xs text-slate-500 m-0">Ejecutado por: <span className="font-bold text-slate-700">{task.staffName}</span></p>
        </div>
        <span className="text-slate-400">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          {task.workerComments && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded-r">
              <p className="text-xs font-bold text-yellow-800 m-0">Observaciones del Trabajador:</p>
              <p className="text-sm text-yellow-800 mt-1 mb-0">{task.workerComments}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">FOTO ANTES</p>
              {photosBefore[0] && <img src={photosBefore[0]} className="w-full h-32 object-cover rounded border" alt="Antes" />}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">FOTO DESPUÉS</p>
              {photosAfter[0] && <img src={photosAfter[0]} className="w-full h-32 object-cover rounded border" alt="Después" />}
            </div>
          </div>

          <div className="bg-white p-3 rounded border border-dashed border-slate-300 mb-4 text-center">
            <p className="text-xs text-slate-500 font-bold mb-2">FIRMA DEL ENCARGADO</p>
            <div className="w-full bg-slate-50 border border-slate-200 rounded overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-[150px] cursor-crosshair touch-none"></canvas>
            </div>
            <button onClick={clearSignature} className="text-xs text-slate-500 mt-2 hover:text-slate-700">Limpiar Firma</button>
          </div>

          <button 
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full bg-red-700 text-white py-2 rounded font-medium hover:bg-red-800"
          >
            {isVerifying ? 'Aprobando...' : 'Aprobar Trabajo'}
          </button>
        </div>
      )}
    </div>
  );
}
