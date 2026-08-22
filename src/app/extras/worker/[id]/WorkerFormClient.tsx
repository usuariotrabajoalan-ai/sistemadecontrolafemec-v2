'use client';

import { useState } from 'react';
import Link from 'next/link';
import { executeTask } from '../../actions';

type Task = any;
type Staff = any;

export default function WorkerFormClient({ task, staffList }: { task: Task, staffList: Staff[] }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ staffId: '', staffName: '', workerComments: '' });
  const [photosBefore, setPhotosBefore] = useState<string[]>([]);
  const [photosAfter, setPhotosAfter] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!task || task.status !== 'PENDING') {
    return (
      <div className="text-center py-12">
        <p className="mb-4">Esta tarea no existe o ya fue ejecutada.</p>
        <Link href="/extras" className="px-4 py-2 bg-red-700 text-white rounded font-medium">Volver al inicio</Link>
      </div>
    );
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (type === 'before') {
          setPhotosBefore(prev => [...prev, ev.target?.result as string]);
        } else {
          setPhotosAfter(prev => [...prev, ev.target?.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number, type: 'before' | 'after') => {
    if (type === 'before') {
      setPhotosBefore(prev => prev.filter((_, i) => i !== index));
    } else {
      setPhotosAfter(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!formData.staffId) return alert('Debe seleccionar su nombre');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (photosBefore.length === 0) return alert('Debe agregar al menos una foto ANTES');
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (photosAfter.length === 0) return alert('Debe agregar al menos una foto DESPUÉS');
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setIsSubmitting(true);
      try {
        await executeTask(task.id, Number(formData.staffId), photosBefore, photosAfter, formData.workerComments);
        setIsSuccess(true);
      } catch (err) {
        console.error(err);
        alert('Error al enviar la ejecución');
      }
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-2">¡Enviado a Verificación!</h2>
        <p className="text-slate-500 mb-6">El encargado revisará su trabajo en breve.</p>
        <Link href="/extras" className="px-4 py-2 bg-red-700 text-white rounded font-medium">Ir al Inicio</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Link href="/extras" className="text-red-700 text-sm font-medium mb-4 inline-block">← Volver al inicio</Link>
      <h2 className="text-2xl font-bold mb-1">Ejecutar Trabajo</h2>
      <div className="text-slate-500 text-sm mb-6">{new Date().toLocaleDateString('es-PY', { dateStyle: 'full' })}</div>

      {/* Steps indicator */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3, 4].map(step => (
          <div key={step} className="flex flex-col items-center gap-2 bg-slate-50 relative z-10 px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === currentStep ? 'bg-red-700 text-white' : step < currentStep ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {step < currentStep ? '✓' : step}
            </div>
            <span className="text-xs text-slate-500">{['Funcionario', 'Antes', 'Después', 'Revisión'][step - 1]}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            <div className="bg-slate-100 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-1">Tarea Solicitada: {task.taskTypeName}</h3>
              <p className="text-sm text-slate-600">📍 Sector: {task.sector}</p>
              {task.description && <p className="text-sm text-slate-500 mt-2">📝 {task.description}</p>}
              <p className="text-xs text-slate-400 mt-2">👤 Solicitado por: {task.requestedBy}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">¿Quién realiza el trabajo?</label>
              <select 
                className="w-full p-2 border rounded"
                value={formData.staffId}
                onChange={e => {
                  const sel = e.target;
                  setFormData({ ...formData, staffId: sel.value, staffName: sel.options[sel.selectedIndex].text });
                }}
              >
                <option value="">Seleccione su nombre...</option>
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>{s.fullName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Observaciones (Opcional)</label>
              <textarea 
                className="w-full p-2 border rounded" rows={3}
                placeholder="Faltaron materiales, etc..."
                value={formData.workerComments}
                onChange={e => setFormData({ ...formData, workerComments: e.target.value })}
              />
            </div>
          </div>
        )}

        {(currentStep === 2 || currentStep === 3) && (() => {
          const isBefore = currentStep === 2;
          const photos = isBefore ? photosBefore : photosAfter;
          const title = isBefore ? 'Fotos Antes del Trabajo' : 'Fotos Después del Trabajo';
          
          return (
            <div>
              <h3 className="font-bold mb-2">{title}</h3>
              <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors mb-4">
                <span className="text-3xl mb-2">📷</span>
                <span className="font-medium">Toque para agregar fotos</span>
                <input type="file" className="hidden" accept="image/*" multiple onChange={e => handlePhotoUpload(e, isBefore ? 'before' : 'after')} />
              </label>

              <div className="grid grid-cols-3 gap-2">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative aspect-square">
                    <img src={p} alt="Foto" className="w-full h-full object-cover rounded" />
                    <button 
                      onClick={() => removePhoto(idx, isBefore ? 'before' : 'after')}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
                    >✕</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {currentStep === 4 && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500 font-medium">Funcionario</span>
              <span className="font-bold">{formData.staffName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500 font-medium">Tarea</span>
              <span className="font-bold">{task.taskTypeName} en {task.sector}</span>
            </div>
            {formData.workerComments && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500 font-medium">Observaciones</span>
                <span className="text-right">{formData.workerComments}</span>
              </div>
            )}
            <div>
              <span className="text-slate-500 font-medium block mb-2">Fotos Antes ({photosBefore.length})</span>
              <div className="flex gap-2 overflow-x-auto">
                {photosBefore.map((p, idx) => <img key={idx} src={p} className="h-20 w-20 object-cover rounded" alt="antes"/>)}
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-medium block mb-2">Fotos Después ({photosAfter.length})</span>
              <div className="flex gap-2 overflow-x-auto">
                {photosAfter.map((p, idx) => <img key={idx} src={p} className="h-20 w-20 object-cover rounded" alt="despues"/>)}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4">
        {currentStep > 1 ? (
          <button onClick={() => setCurrentStep(c => c - 1)} className="px-4 py-2 border rounded font-medium flex-1 bg-white">Anterior</button>
        ) : <div className="flex-1" />}
        <button 
          onClick={handleNext} 
          disabled={isSubmitting}
          className={`px-4 py-2 rounded font-medium flex-1 text-white ${currentStep === 4 ? 'bg-green-600' : 'bg-red-700'}`}
        >
          {isSubmitting ? 'Enviando...' : currentStep === 4 ? 'Enviar Ejecución' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
}
