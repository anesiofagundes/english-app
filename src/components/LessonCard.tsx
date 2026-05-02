'use client';

import Link from 'next/link';
import { Text } from '@/types';
import { useEffect, useState } from 'react';

interface Props {
  text: Text;
}

export default function LessonCard({ text }: Props) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`progress_${text.id}`);
      if (stored) setCompleted(JSON.parse(stored).length);
    } catch {}
  }, [text.id]);

  const total = text.sentences.length;
  const percent = Math.round((completed / total) * 100);
  const done = completed === total;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-9 h-9 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-sm">
            {text.id}
          </span>
          <div>
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">{text.title}</h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 block">{text.category}</span>
          </div>
        </div>
        {done && (
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{text.description}</p>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>{completed}/{total} frases</span>
          <span>{percent}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <Link
        href={`/lesson/${text.id}`}
        className="w-full py-2.5 rounded-xl text-center text-sm font-semibold transition-colors bg-cyan-500 text-white hover:bg-cyan-600"
      >
        {done ? 'Revisar' : completed > 0 ? 'Continuar' : 'Estudar'}
      </Link>
    </div>
  );
}
