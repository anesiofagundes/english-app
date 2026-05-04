'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const MESSAGES = [
  { emoji: '🏆', title: 'Incrível!', body: 'Você completou mais uma lição. Seu inglês está crescendo a cada escuta.' },
  { emoji: '🔥', title: 'Você arrasou!', body: 'A consistência é o segredo da fluência. Continue aparecendo assim.' },
  { emoji: '⭐', title: 'Excelente!', body: 'Cada repetição fortalece sua conexão com o idioma. Isso é aprender de verdade.' },
  { emoji: '💪', title: 'Muito bem!', body: 'Você está construindo algo que ninguém pode tirar: o inglês natural.' },
  { emoji: '🎯', title: 'Objetivo atingido!', body: 'Seu cérebro absorveu esse texto. Isso é o método funcionando para você.' },
  { emoji: '🚀', title: 'Impressionante!', body: 'Você não está decorando — está aprendendo. E isso faz toda a diferença.' },
  { emoji: '🌟', title: 'Que dedicação!', body: 'Quem ouve aprende. Você escolheu o caminho certo e está no ritmo certo.' },
  { emoji: '✨', title: 'Parabéns!', body: 'Um texto a mais no seu repertório. A fluência vem de quem não desiste.' },
];

export default function CelebrationOverlay() {
  const [msg] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  const [show, setShow] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 50);
    const t2 = setTimeout(() => setShowButton(true), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-6 bg-slate-900/90 backdrop-blur-sm transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`w-full max-w-sm bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl transition-all duration-500 ${show ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>

        <div className={`text-6xl mb-5 transition-transform duration-700 ${show ? 'scale-100' : 'scale-50'}`}>
          {msg.emoji}
        </div>

        <h2 className="text-2xl font-extrabold text-white mb-3">
          {msg.title}
        </h2>

        <p className="text-slate-300 text-base leading-relaxed mb-8">
          {msg.body}
        </p>

        <div className={`transition-all duration-500 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <Link
            href="/lessons"
            className="block w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-base font-bold transition-colors"
          >
            Continuar →
          </Link>
        </div>
      </div>
    </div>
  );
}
