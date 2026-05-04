import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

export default function Config() {
  return (
    <main className="max-w-2xl mx-auto min-h-screen">
      <div className="bg-gradient-to-b from-blue-50 to-slate-50 dark:from-slate-800/80 dark:to-slate-900 px-4 pt-10 pb-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-2 group">
              <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">L</span>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                listenglish
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Configurações
            </h1>
          </div>
          <Link
            href="/"
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            ← Início
          </Link>
        </div>
      </div>

      <div className="px-4 py-6 space-y-3">
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl px-5 py-4 border border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tema</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Claro ou escuro</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </main>
  );
}
