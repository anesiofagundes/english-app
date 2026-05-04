import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Landing() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8">
          <div className="mb-6">
            <Image
              src="/logo.png"
              alt="Listenglish"
              width={200}
              height={200}
              className="mx-auto"
              priority
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight mb-4 max-w-sm mx-auto">
            o método que ninguém<br />te ensinou na escola
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            aprenda inglês ouvindo, não decorando
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/lessons"
            className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-base font-bold text-center transition-colors shadow-md shadow-blue-200 dark:shadow-none"
          >
            Aprender
          </Link>

          <Link
            href="/config"
            className="w-full py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-base font-medium text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
          >
            Configurações
          </Link>
        </div>
      </div>

      <div className="pb-8 text-center">
        <span className="text-xs text-slate-300 dark:text-slate-600">
          listenglish © 2026
        </span>
      </div>
    </main>
  );
}
