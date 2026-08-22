import Link from 'next/link';

export default function ExtrasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <header className="bg-red-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/extras" className="flex items-center gap-3 no-underline text-white">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-red-700 text-xs overflow-hidden">
              <img src="/logo.png" alt="AFEMEC" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-wide">AFEMEC</span>
              <span className="text-xs text-red-200 tracking-wider">Sede Social</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex gap-4">
            <Link href="/extras" className="text-white hover:text-red-200 text-sm font-medium">🏠 Inicio</Link>
            <Link href="/extras/login" className="text-white hover:text-red-200 text-sm font-medium">⚙️ Administración</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 pb-20">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs mt-auto">
        <div className="flex flex-col items-center gap-1">
          <span>DESARROLLADO POR</span>
          <span className="text-white font-semibold">AR Software Engineer</span>
        </div>
      </footer>
    </div>
  );
}
