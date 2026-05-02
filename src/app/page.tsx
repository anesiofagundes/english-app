import LessonCard from '@/components/LessonCard';
import HomeProgress from '@/components/HomeProgress';
import ThemeToggle from '@/components/ThemeToggle';
import { texts } from '@/data/texts';

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-cyan-50 to-slate-50 dark:from-slate-800/80 dark:to-slate-900 px-4 pt-10 pb-7">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                English App
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white leading-snug">
              Aprenda inglês<br />do seu jeito
            </h1>
          </div>
          <ThemeToggle />
        </div>
        <HomeProgress />
      </div>

      <div className="px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Lições
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            Iniciante
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {texts.map((text) => (
            <LessonCard key={text.id} text={text} />
          ))}
        </div>
      </div>
    </main>
  );
}
