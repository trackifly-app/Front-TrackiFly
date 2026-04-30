"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Modal from "./Modal";
import ToastContainer from "./ToastContainer";
import type {
  FeedbackContextType,
  ModalOptions,
  ToastItem,
  ToastType,
} from "./types";

export const FeedbackContext = createContext<FeedbackContextType | undefined>(
  undefined
);

interface FeedbackProviderProps {
  children: ReactNode;
}

const initialModalState: ModalOptions = {
  isOpen: false,
  title: "",
  message: "",
  confirmText: "Aceptar",
  cancelText: "Cancelar",
};

export default function FeedbackProvider({
  children,
}: FeedbackProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [modal, setModal] = useState<ModalOptions>(initialModalState);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "info",
      duration: number = 3000
    ) => {
      const id = crypto.randomUUID();

      const newToast: ToastItem = {
        id,
        message,
        type,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const openModal = useCallback((options: Omit<ModalOptions, "isOpen">) => {
    setModal({
      isOpen: true,
      title: options.title || "Confirmación",
      message: options.message || "¿Deseas continuar?",
      confirmText: options.confirmText || "Aceptar",
      cancelText: options.cancelText || "Cancelar",
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal(initialModalState);
  }, []);

  const showHttpError = useCallback(
    (error: unknown, fallbackMessage: string = "Ocurrió un error inesperado") => {
      let message = fallbackMessage;

      if (typeof error === "object" && error !== null) {
        const err = error as {
          response?: {
            status?: number;
            data?: {
              message?: string | string[];
            };
          };
          message?: string;
        };

        const backendMessage = err.response?.data?.message;
        const status = err.response?.status;

        if (Array.isArray(backendMessage)) {
          message = backendMessage[0] || fallbackMessage;
        } else if (typeof backendMessage === "string" && backendMessage.trim()) {
          message = backendMessage;
        } else if (status === 401) {
          message = "No autorizado. Inicia sesión nuevamente.";
        } else if (status === 403) {
          message = "No tienes permisos para realizar esta acción.";
        } else if (status === 404) {
          message = "No se encontró el recurso solicitado.";
        } else if (status === 500) {
          message = "Error interno del servidor.";
        } else if (err.message) {
          message = err.message;
        }

        console.error("HTTP error:", {
          status,
          message: backendMessage || err.message || fallbackMessage,
        });
      } else {
        console.error("Unknown error:", error);
      }

      showToast(message, "error");
    },
    [showToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      modal,
      showToast,
      removeToast,
      openModal,
      closeModal,
      showHttpError,
    }),
    [toasts, modal, showToast, removeToast, openModal, closeModal, showHttpError]
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Modal modal={modal} closeModal={closeModal} />
    </FeedbackContext.Provider>
  );
}