import LessonCard from '@/components/LessonCard';
import HomeProgress from '@/components/HomeProgress';
import ThemeToggle from '@/components/ThemeToggle';
import { texts } from '@/data/texts';
import Link from 'next/link';
import Image from 'next/image';

export default function Lessons() {
  return (
    <main className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-blue-50 to-slate-50 dark:from-slate-800/80 dark:to-slate-900 px-4 pt-10 pb-7">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <Link href="/" className="inline-block mb-2">
              <Image
                src="/logo.png"
                alt="Listenglish"
                width={110}
                height={110}
                className="rounded-2xl"
              />
            </Link>
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
