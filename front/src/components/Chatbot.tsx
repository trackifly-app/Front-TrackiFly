"use client";

import { useState } from "react";
import { X, MessageCircle, Send } from "lucide-react";

type Message = {
  role: "assistant" | "user";
  text: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text:
        "¡Hola! Soy el asistente de Trackifly 🚚\n\nPuedo ayudarte a rastrear un envío, crear un pedido o responder preguntas frecuentes.",
    },
  ]);

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();

    if (!messageToSend || isLoading) return;

    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        text: messageToSend,
      },
    ];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      if (!response.ok) {
        const rawError =
          typeof data?.error === "string"
            ? data.error
            : "El asistente no está disponible en este momento.";

        const lowerError = rawError.toLowerCase();

        let friendlyMessage = rawError;

        if (
          lowerError.includes("quota") ||
          lowerError.includes("exceeded") ||
          lowerError.includes("rate limit")
        ) {
          friendlyMessage =
            "⚠️ El asistente alcanzó temporalmente el límite de uso gratuito.\n\nProbá nuevamente en unos segundos.";
        }

        if (
          lowerError.includes("api key") ||
          lowerError.includes("authentication")
        ) {
          friendlyMessage =
            "🔑 No se pudo autenticar el asistente.\n\nRevisá la configuración de la API.";
        }

        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            text: friendlyMessage,
          },
        ]);

        return;
      }

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          text:
            data.message ||
            "No pude responder en este momento. Intentá nuevamente.",
        },
      ]);
    } catch (error) {
      console.error("Error en chatbot:", error);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          text:
            "⚠️ Hubo un problema al conectar con el asistente.\n\nIntentá nuevamente en unos segundos.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#D96B4A] text-white shadow-xl transition hover:bg-[#C65A3B]"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 flex h-[540px] w-[380px] flex-col overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#1F2933] px-5 py-4 text-white">
            <div>
              <h3 className="text-base font-semibold">Asistente Trackifly</h3>
              <p className="text-sm text-gray-300">En línea</p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="transition hover:text-[#D96B4A]"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[#F9FAFB] p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm whitespace-pre-wrap break-words ${
                  message.role === "assistant"
                    ? "rounded-bl-md border border-[#E5E7EB] bg-white text-[#1F2933]"
                    : "ml-auto rounded-br-md bg-[#D96B4A] text-white"
                }`}
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  fontWeight: 400,
                }}
              >
                {message.text}
              </div>
            ))}

            {isLoading && (
              <div
                className="max-w-[85%] rounded-2xl rounded-bl-md border border-[#E5E7EB] bg-white px-4 py-3 text-[#6B7280] shadow-sm"
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                }}
              >
                Escribiendo...
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => sendMessage("Quiero rastrear un envío")}
                className="rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F2933] transition hover:border-[#D96B4A] hover:text-[#D96B4A]"
              >
                Rastrear envío
              </button>

              <button
                type="button"
                onClick={() => sendMessage("Quiero crear un pedido")}
                className="rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F2933] transition hover:border-[#D96B4A] hover:text-[#D96B4A]"
              >
                Crear pedido
              </button>

              <button
                type="button"
                onClick={() => sendMessage("¿Dónde puedo ver sucursales?")}
                className="rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F2933] transition hover:border-[#D96B4A] hover:text-[#D96B4A]"
              >
                Sucursales
              </button>

              <button
                type="button"
                onClick={() => sendMessage("Mostrame preguntas frecuentes")}
                className="rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F2933] transition hover:border-[#D96B4A] hover:text-[#D96B4A]"
              >
                FAQ
              </button>
            </div>
          </div>

          <div className="border-t border-[#E5E7EB] bg-white p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Escribí tu mensaje..."
                className="flex-1 rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#1F2933] outline-none transition focus:border-[#D96B4A]"
              />

              <button
                onClick={() => sendMessage()}
                disabled={isLoading}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D96B4A] text-white transition hover:bg-[#C65A3B] disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}