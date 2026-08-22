import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">AFEMEC Sede Social</h1>
            <p className="text-slate-500">Portal Central de Administración</p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow">
            Cerrar Sesión
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Extras */}
          <Link href="/admin/extras" className="block group">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-yellow-500">
              <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-yellow-600">Mantenimiento y Extras</h2>
              <p className="text-sm text-slate-500 mb-4">
                Gestión de reparaciones, pintura, limpieza profunda y órdenes de trabajo.
              </p>
              <span className="text-yellow-600 font-medium text-sm">Entrar al panel →</span>
            </div>
          </Link>

          {/* Card 2: Asistencias */}
          <Link href="/admin/asistencias" className="block group">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-blue-500">
              <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600">Asistencias Móvil</h2>
              <p className="text-sm text-slate-500 mb-4">
                Control de llegadas y salidas del personal, reportes de ubicación y selfies.
              </p>
              <span className="text-blue-600 font-medium text-sm">Entrar al panel →</span>
            </div>
          </Link>

          {/* Card 3: Coberturas */}
          <Link href="/admin/coberturas" className="block group">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-green-500">
              <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-600">Proyecto Coberturas</h2>
              <p className="text-sm text-slate-500 mb-4">
                Asignación de limpieza para eventos en quinchos y salones. Firmas de conformidad.
              </p>
              <span className="text-green-600 font-medium text-sm">Entrar al panel →</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
