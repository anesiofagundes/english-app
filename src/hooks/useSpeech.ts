'use client';

import { useState, useEffect, useCallback } from 'react';

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);

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
    };
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
    setPaused(false);
    let index = 0;

    const next = () => {
      if (index >= texts.length) {
        setSpeaking(false);
        setCurrentIndex(-1);
        onComplete?.();
        return;
      }
      const u = new SpeechSynthesisUtterance(texts[index]);
      u.lang = 'en-US';
      if (voice) u.voice = voice;
      u.rate = rate;
      setCurrentIndex(index);
      onIndexChange?.(index);
      setSpeaking(true);
      u.onend = () => { index++; next(); };
      window.speechSynthesis.speak(u);
    };

    next();
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    setCurrentIndex(-1);
  }, []);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setPaused(false);
  }, []);

  return { voices, speaking, paused, currentIndex, speak, stop, pause, resume, speakSequence };
}
