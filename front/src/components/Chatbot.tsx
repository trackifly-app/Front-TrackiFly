'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

type Message = {
  role: 'assistant' | 'user';
  text: string;
};

export default function Chatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: '¡Hola! Soy el asistente de Trackifly 🚚\n\nPuedo ayudarte a rastrear un envío, crear un pedido o responder preguntas frecuentes.',
    },
  ]);

  // 🔹 Ref para detectar click fuera
  const chatRef = useRef<HTMLDivElement>(null);

  // 🔹 Efecto para click outside + ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || isLoading) return;

    const updatedMessages: Message[] = [...messages, { role: 'user', text: messageToSend }];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages([...updatedMessages, { role: 'assistant', text: 'Error del asistente.' }]);
        return;
      }

      setMessages([...updatedMessages, { role: 'assistant', text: data.message }]);
    } catch {
      setMessages([...updatedMessages, { role: 'assistant', text: 'Error de conexión.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={chatRef}
      className={`fixed bottom-28 right-6 z-50 flex h-135 w-95 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-md transition-all duration-300 origin-bottom-right
      ${isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface relative">
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-primary/70" />

        <div>
          <h3 className="text-base font-bold tracking-tight text-foreground">Asistente Trackifly</h3>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs text-muted">En línea</p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 rounded-lg transition-colors hover:bg-surface-muted text-muted hover:text-primary">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-surface-muted p-4">
        {messages.map((message, index) => (
          <div key={index} className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14.5px] ${message.role === 'assistant' ? 'rounded-bl-none border border-border bg-surface text-foreground' : 'ml-auto rounded-br-none bg-primary text-white shadow-md shadow-primary/20'}`}>
            {message.text}
          </div>
        ))}

        {isLoading && <div className="text-xs text-muted italic">Escribiendo...</div>}

        <div className="flex flex-wrap gap-2 pt-2">
          {['Rastrear envío', 'Crear pedido', 'Sucursales', 'FAQ'].map((text, i) => (
            <button key={i} onClick={() => sendMessage(text)} className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary">
              {text}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border bg-surface p-4">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Escribí tu mensaje..."
            className="flex-1 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm outline-none transition 
            focus:border-primary focus:ring-2 focus:ring-primary/20 
            placeholder:text-muted/50"
          />

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-xl 
            bg-orange-500 text-white transition-all 
            hover:bg-orange-600 active:scale-95 
            shadow-md shadow-orange-500/30"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
