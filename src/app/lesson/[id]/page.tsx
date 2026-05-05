import { texts } from '@/data/texts';
import LessonView from '@/components/LessonView';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return texts.map((t) => ({ id: String(t.id) }));
}

export default async function LessonPage({ params }: Props) {
  const { id } = await params;
  const text = texts.find((t) => t.id === Number(id));
  if (!text) notFound();

  return (
    <main className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-blue-50 to-slate-50 dark:from-slate-800/80 dark:to-slate-900 px-4 pt-8 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/lessons"
            className="w-11 h-11 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex-shrink-0 shadow-sm"
          >
            <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                {text.id}
              </span>
              <h1 className="text-base font-bold text-slate-800 dark:text-white truncate">{text.title}</h1>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{text.description}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 pt-4">
        <LessonView text={text} />
      </div>
    </main>
  );
}
