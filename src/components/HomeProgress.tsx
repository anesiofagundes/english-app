'use client';

import { useEffect, useState } from 'react';
import { texts } from '@/data/texts';

export default function HomeProgress() {
  const [done, setDone] = useState(0);

  useEffect(() => {
    let count = 0;
    for (const text of texts) {
      try {
        const stored = localStorage.getItem(`progress_${text.id}`);
        if (stored) {
          const arr = JSON.parse(stored) as number[];
          if (arr.length >= text.sentences.length) count++;
        }
      } catch {}
    }
    setDone(count);
  }, []);

  const total = texts.length;
  const percent = Math.round((done / total) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          {done === 0
            ? 'Nenhuma lição concluída ainda'
            : done === total
            ? 'Todas as lições concluídas!'
            : `${done} de ${total} lições concluídas`}
        </span>
        <span className="font-bold text-cyan-600 dark:text-cyan-400">{percent}%</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-500 rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
