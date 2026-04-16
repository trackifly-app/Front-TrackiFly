'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Moon, Sun } from 'lucide-react';

const FloatingActions = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

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

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      {/* Botón de Chatbot */}
      <button type="button" aria-label="Abrir chat" className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-surface border border-border text-primary" title="Abrir Chat">
        <MessageSquare size={24} />
      </button>

      {/* Botón de Tema */}
      <button type="button" onClick={toggleTheme} aria-label="Cambiar tema" className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-surface border border-border text-foreground" title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}>
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    </div>
  );
};

export default FloatingActions;
