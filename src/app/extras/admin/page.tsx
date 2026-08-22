import Link from 'next/link';

export default function AdminDashboardPage() {
  const menus = [
    { name: 'Gestión de Tipos de Extras', icon: '📝', link: '/extras/admin/tasks' },
    { name: 'Gestión de Personal', icon: '👥', link: '/extras/admin/staff' },
    { name: 'Administradores/Encargados', icon: '🔑', link: '/extras/admin/encargados' },
    { name: 'Reportes y Registros', icon: '📊', link: '/extras/admin/records' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/extras" className="text-red-700 text-sm font-medium mb-4 inline-block">← Volver al inicio</Link>
        <h1 className="text-3xl font-bold text-slate-800">Panel de Administración</h1>
        <p className="text-slate-500">Configuración general del sistema AFEMEC Extras</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menus.map((menu, idx) => (
          <Link
            key={idx}
            href={menu.link}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all no-underline text-slate-800"
          >
            <span className="text-4xl mb-3">{menu.icon}</span>
            <h2 className="text-lg font-semibold">{menu.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
