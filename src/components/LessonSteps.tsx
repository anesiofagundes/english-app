'use client';

import { Text } from '@/types';
import { useState, useCallback, useEffect } from 'react';
import LineByLine from './LineByLine';
import TextAudio from './TextAudio';

const STEPS = [
  {
    number: 1,
    label: 'Escuta',
    title: 'Primeira escuta',
    instruction: 'Ouça o texto completo sem ler. Apenas absorva o som e o ritmo do inglês.',
  },
  {
    number: 2,
    label: 'Linhas',
    title: 'Linha por linha',
    instruction: 'Leia e ouça cada frase. Entenda o significado antes de continuar.',
  },
  {
    number: 3,
    label: 'Texto',
    title: 'Texto completo',
    instruction: 'Leia enquanto ouve o texto. Repita de 5 a 10 vezes.',
  },
  {
    number: 4,
    label: 'Áudio',
    title: 'Só o áudio',
    instruction: 'Feche os olhos e ouça sem ler. Repita de 5 a 10 vezes.',
  },
];

export default function LessonSteps({ text }: { text: Text }) {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`progress_${text.id}`);
      if (stored) setCompleted(new Set(JSON.parse(stored)));
    } catch {}
  }, [text.id]);

  useEffect(() => {
    window.speechSynthesis.cancel();
  }, [step]);

  const handleToggle = useCallback((index: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      localStorage.setItem(`progress_${text.id}`, JSON.stringify([...next]));
      return next;
    });
  }, [text.id]);

  const current = STEPS[step - 1];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-start justify-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.number} className="flex items-start">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setStep(s.number)}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-colors flex items-center justify-center ${
                    step === s.number
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : s.number < step
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {s.number < step ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.number
                  )}
                </button>
                <span className={`text-xs mt-1 font-medium transition-colors ${
                  step === s.number
                    ? 'text-cyan-600 dark:text-cyan-400'
                    : s.number < step
                    ? 'text-green-500 dark:text-green-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 mt-5 transition-colors ${
                  s.number < step ? 'bg-green-400' : 'bg-slate-200 dark:bg-slate-600'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-1">
            Passo {step} de 4
          </p>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {current.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            {current.instruction}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-700" />

      {step === 1 && <TextAudio key="step1" sentences={text.sentences} hideText />}
      {step === 2 && (
        <LineByLine
          key="step2"
          sentences={text.sentences}
          completed={completed}
          onToggle={handleToggle}
        />
      )}
      {step === 3 && <TextAudio key="step3" sentences={text.sentences} showCounter targetReps={5} />}
      {step === 4 && <TextAudio key="step4" sentences={text.sentences} hideText showCounter targetReps={5} />}

      {step < 4 && (
        <div className="px-4 pb-4 pt-2">
          <button
            onClick={() => setStep(step + 1)}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-cyan-500 text-white hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            Próximo passo
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
