'use client';

import { Sentence } from '@/types';
import { useSpeech } from '@/hooks/useSpeech';
import { useState } from 'react';

interface Props {
  sentences: Sentence[];
  completed: Set<number>;
  onToggle: (index: number) => void;
}

function highlight(text: string, keyPhrases: string[]) {
  if (!keyPhrases.length) return [{ text, isKey: false }];
  const sorted = [...keyPhrases].sort((a, b) => b.length - a.length);
  let segments: { text: string; isKey: boolean }[] = [{ text, isKey: false }];

  for (const phrase of sorted) {
    const next: typeof segments = [];
    for (const seg of segments) {
      if (seg.isKey) { next.push(seg); continue; }
      const parts = seg.text.split(new RegExp(`(${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
      for (const part of parts) {
        if (part.toLowerCase() === phrase.toLowerCase()) {
          next.push({ text: part, isKey: true });
        } else if (part) {
          next.push({ text: part, isKey: false });
        }
      }
    }
    segments = next;
  }
  return segments;
}

export default function LineByLine({ sentences, completed, onToggle }: Props) {
  const { speak, voices } = useSpeech();
  const [playingIndex, setPlayingIndex] = useState(-1);
  const [openNote, setOpenNote] = useState<number | null>(null);

  const handlePlay = (sentence: Sentence, index: number) => {
    const voice = voices.find((v) => v.lang === 'en-US') ?? voices[0];
    setPlayingIndex(index);
    speak(sentence.english, voice, 1, () => setPlayingIndex(-1));
  };

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-700">
      <div className="flex justify-end px-4 py-2">
        <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">
          Frases {completed.size}/{sentences.length}
        </span>
      </div>

      {sentences.map((sentence, i) => (
        <div
          key={i}
          className={`px-4 py-4 transition-colors ${
            completed.has(i)
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-white dark:bg-slate-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {highlight(sentence.english, sentence.keyPhrases).map((seg, j) =>
                  seg.isKey ? (
                    <span key={j} className="text-cyan-600 dark:text-cyan-400 font-semibold">{seg.text}</span>
                  ) : (
                    <span key={j}>{seg.text}</span>
                  )
                )}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {sentence.portuguese}
              </p>
              {sentence.note && (
                <button
                  onClick={() => setOpenNote(openNote === i ? null : i)}
                  className="flex items-center gap-1 mt-1 text-xs font-medium text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  {openNote === i ? 'Fechar' : 'Curiosidade'}
                </button>
              )}
              {sentence.note && openNote === i && (
                <div className="mt-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                  {sentence.note}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 flex items-center gap-2">
              <button
                onClick={() => handlePlay(sentence, i)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                  playingIndex === i
                    ? 'bg-cyan-600 text-white'
                    : 'bg-cyan-500 text-white hover:bg-cyan-600'
                }`}
                title="Ouvir frase"
              >
                {playingIndex === i ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => onToggle(i)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors border-2 ${
                  completed.has(i)
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-200 dark:border-slate-600 text-slate-300 dark:text-slate-600 hover:border-green-400 hover:text-green-400'
                }`}
                title="Marcar como feita"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
