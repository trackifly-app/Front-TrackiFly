'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Moon, Sun, X } from 'lucide-react';
import Chatbot from './Chatbot';

const FloatingActions = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      {/* Componente Chatbot importado con toda tu lógica */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Botón de Chatbot original tuyo */}
      <button type="button" onClick={() => setIsChatOpen(!isChatOpen)} aria-label="Abrir chat" className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-surface border border-border text-primary" title="Abrir Chat">
        {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Botón de Tema original tuyo */}
      <button type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Cambiar tema" className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-surface border border-border text-foreground" title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}>
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    </div>
  );
};

export default FloatingActions;
