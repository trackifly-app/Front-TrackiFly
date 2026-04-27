"use client";

import Toast from "./Toast";
import type { ToastItem } from "./types";

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export default function ToastContainer({
  toasts,
  removeToast,
}: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
}