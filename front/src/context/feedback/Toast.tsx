"use client";

import { useEffect, useState } from "react";
import type { ToastItem } from "./types";

interface ToastProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

const toastStyles = {
  success: "border-green-500 bg-green-950/90 text-green-100",
  error: "border-red-500 bg-red-950/90 text-red-100",
  warning: "border-yellow-500 bg-yellow-950/90 text-yellow-100",
  info: "border-sky-500 bg-sky-950/90 text-sky-100",
};

export default function Toast({ toast, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 10);

    const exitTimer = setTimeout(() => {
      setVisible(false);

      setTimeout(() => {
        onClose(toast.id);
      }, 250);
    }, toast.duration ?? 3000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [toast, onClose]);

  return (
    <div
      className={`
        w-full max-w-sm rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm
        transition-all duration-300
        ${toastStyles[toast.type]}
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-2 opacity-0"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{toast.message}</p>

        <button
          onClick={() => onClose(toast.id)}
          className="text-lg leading-none opacity-80 transition hover:opacity-100"
          aria-label="Cerrar notificación"
        >
          ×
        </button>
      </div>
    </div>
  );
}