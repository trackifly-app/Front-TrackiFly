"use client";

import { useEffect } from "react";
import type { ModalOptions } from "./types";

interface ModalProps {
  modal: ModalOptions;
  closeModal: () => void;
}

export default function Modal({ modal, closeModal }: ModalProps) {


  const handleConfirm = () => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    closeModal();
  };

  const handleCancel = () => {
    if (modal.onCancel) {
      modal.onCancel();
    }
    closeModal();
  };

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            handleCancel();
        }
        };

        if (modal.isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
        }

        return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "auto";
        };
    }, [modal.isOpen]);

  if (!modal.isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 px-4"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 text-xl font-bold text-white">
          {modal.title || "Confirmación"}
        </h2>

        <p className="mb-6 text-sm text-slate-300">
          {modal.message || "¿Deseas continuar?"}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            {modal.cancelText || "Cancelar"}
          </button>

          <button
            onClick={handleConfirm}
            className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300"
          >
            {modal.confirmText || "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
}