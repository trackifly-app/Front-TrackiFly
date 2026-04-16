'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Moon, Sun } from 'lucide-react';

const FloatingActions = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = (storedTheme as 'light' | 'dark') ?? (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    setTheme(nextTheme);
  };

  return (
    <div className="floating-actions">
      <button type="button" className="floating-action floating-action-secondary" title="Chat provisional" aria-label="Chat provisional">
        <MessageSquare size={20} />
      </button>
      <button type="button" className="floating-action floating-action-primary" onClick={toggleTheme} title="Cambiar modo claro/oscuro" aria-label="Cambiar modo claro o oscuro">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
};

export default FloatingActions;
