'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [charIndex, setCharIndex] = useState(-1);

  const wordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerWordsRef = useRef<{ start: number }[]>([]);
  const timerRateRef = useRef(1);
  const timerWiRef = useRef(-1);

  useEffect(() => {
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      if (all.length > 0) setVoices(all.filter((v) => v.lang.startsWith('en')));
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load);
      window.speechSynthesis.cancel();
      if (wordTimerRef.current !== null) clearInterval(wordTimerRef.current);
    };
  }, []);

  const startTimerFrom = useCallback((fromWi: number) => {
    if (wordTimerRef.current !== null) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
    const words = timerWordsRef.current;
    const rate = timerRateRef.current;
    if (words.length === 0 || fromWi >= words.length) return;

    const charsPerMs = (14 * rate) / 1000;
    const charOffset = words[fromWi].start;
    const startTime = Date.now();
    timerWiRef.current = fromWi;
    setCharIndex(words[fromWi].start);

    wordTimerRef.current = setInterval(() => {
      const w = timerWordsRef.current;
      const estimated = charOffset + (Date.now() - startTime) * charsPerMs;
      let wi = timerWiRef.current;
      for (let i = timerWiRef.current + 1; i < w.length; i++) {
        if (w[i].start <= estimated) wi = i; else break;
      }
      if (wi !== timerWiRef.current) { timerWiRef.current = wi; setCharIndex(w[wi].start); }
      if (wi >= w.length - 1) { clearInterval(wordTimerRef.current!); wordTimerRef.current = null; }
    }, 50);
  }, []);

  const speak = useCallback((
    text: string,
    voice?: SpeechSynthesisVoice,
    rate = 1,
    onEnd?: () => void
  ) => {
    window.speechSynthesis.cancel();
    setPaused(false);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    if (voice) u.voice = voice;
    u.rate = rate;
    u.onstart = () => setSpeaking(true);
    u.onend = () => { setSpeaking(false); onEnd?.(); };
    window.speechSynthesis.speak(u);
  }, []);

  const speakSequence = useCallback((
    texts: string[],
    voice?: SpeechSynthesisVoice,
    rate = 1,
    onIndexChange?: (i: number) => void,
    onComplete?: () => void
  ) => {
    window.speechSynthesis.cancel();
    if (wordTimerRef.current !== null) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
    setPaused(false);
    let index = 0;

    const next = () => {
      if (index >= texts.length) {
        setSpeaking(false);
        setCurrentIndex(-1);
        setCharIndex(-1);
        timerWiRef.current = -1;
        if (wordTimerRef.current !== null) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
        onComplete?.();
        return;
      }

      const text = texts[index];
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      if (voice) u.voice = voice;
      u.rate = rate;
      setCurrentIndex(index);
      setCharIndex(-1);
      onIndexChange?.(index);
      setSpeaking(true);

      timerWordsRef.current = [...text.matchAll(/\S+/g)].map((m) => ({ start: m.index! }));
      timerRateRef.current = rate;
      timerWiRef.current = -1;

      // timer starts when audio actually begins — elimina o delay de inicialização do TTS
      u.onstart = () => { startTimerFrom(0); };

      // onboundary sobrescreve o timer quando disponível (vozes Google)
      u.onboundary = (e) => {
        setCharIndex(e.charIndex);
        const words = timerWordsRef.current;
        let wi = 0;
        for (let i = 1; i < words.length; i++) {
          if (words[i].start <= e.charIndex) wi = i; else break;
        }
        timerWiRef.current = wi;
      };

      u.onend = () => {
        if (wordTimerRef.current !== null) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
        index++;
        next();
      };
      window.speechSynthesis.speak(u);
    };

    next();
  }, [startTimerFrom]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    setCurrentIndex(-1);
    setCharIndex(-1);
    timerWiRef.current = -1;
    if (wordTimerRef.current !== null) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
  }, []);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setPaused(true);
    if (wordTimerRef.current !== null) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setPaused(false);
    startTimerFrom(Math.max(0, timerWiRef.current));
  }, [startTimerFrom]);

  return { voices, speaking, paused, currentIndex, charIndex, speak, stop, pause, resume, speakSequence };
}
