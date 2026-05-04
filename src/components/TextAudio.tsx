'use client';

import { Sentence } from '@/types';
import { useSpeech } from '@/hooks/useSpeech';
import { useState } from 'react';

interface Props {
  sentences: Sentence[];
  hideText?: boolean;
  showCounter?: boolean;
  targetReps?: number;
}

const SPEEDS = [0.75, 1, 1.25] as const;

export default function TextAudio({ sentences, hideText = false, showCounter = false, targetReps = 5 }: Props) {
  const { voices, speaking, paused, speakSequence, stop, pause, resume } = useSpeech();
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | undefined>();
  const [rate, setRate] = useState<number>(1);
  const [activeSentence, setActiveSentence] = useState(-1);
  const [reps, setReps] = useState(0);

  const handlePlay = () => {
    const voice = selectedVoice ?? voices.find((v) => v.lang === 'en-US') ?? voices[0];
    speakSequence(
      sentences.map((s) => s.english),
      voice,
      rate,
      (i) => setActiveSentence(i),
      () => {
        setActiveSentence(-1);
        if (showCounter) setReps((r) => r + 1);
      }
    );
  };

  const handleRestart = () => {
    stop();
    setActiveSentence(-1);
    handlePlay();
  };

  return (
    <div className="p-4 space-y-5">
      <div className="space-y-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Narrador</label>
          <select
            className="w-full max-w-xs text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={selectedVoice?.name ?? ''}
            onChange={(e) => {
              const v = voices.find((v) => v.name === e.target.value);
              setSelectedVoice(v);
            }}
          >
            <option value="">Voz padrão (en-US)</option>
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Velocidade</label>
          <div className="flex gap-2">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setRate(s)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  rate === s
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-cyan-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          {!speaking ? (
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-semibold hover:bg-cyan-600 transition-colors"
            >
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {reps > 0 ? 'Ouvir novamente' : 'Ouvir texto'}
            </button>
          ) : !paused ? (
            <button
              onClick={pause}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700 dark:bg-slate-600 text-white text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              Pausar
            </button>
          ) : (
            <button
              onClick={resume}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-semibold hover:bg-cyan-600 transition-colors"
            >
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Continuar
            </button>
          )}
          {speaking && (
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-700 dark:bg-slate-600 text-white text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-500 transition-colors"
              title="Recomeçar do início"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6" />
                <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
              </svg>
              Recomeçar
            </button>
          )}
          {voices.length === 0 && (
            <span className="text-xs text-slate-400">Voz padrão do sistema</span>
          )}
        </div>

        {showCounter && (
          <div className="flex items-center gap-3 pt-1 border-t border-slate-200 dark:border-slate-600 mt-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Repetições:</span>
            <div className="flex gap-1.5">
              {Array.from({ length: targetReps }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i < reps ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{reps}/{targetReps}</span>
            {reps >= targetReps && (
              <span className="text-xs font-bold text-green-500 dark:text-green-400 ml-1">Ótimo!</span>
            )}
          </div>
        )}
      </div>

      {!hideText && (
        <div className="space-y-2">
          {sentences.map((s, i) => (
            <p
              key={i}
              className={`text-sm leading-relaxed px-3 py-2 rounded-lg transition-colors ${
                activeSentence === i
                  ? 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 font-medium'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {s.english}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
