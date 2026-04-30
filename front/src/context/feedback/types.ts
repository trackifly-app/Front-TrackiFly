export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ModalOptions {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface FeedbackContextType {
  toasts: ToastItem[];
  modal: ModalOptions;
  showToast: (
    message: string,
    type?: ToastType,
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
  openModal: (options: Omit<ModalOptions, "isOpen">) => void;
  closeModal: () => void;
  showHttpError: (error: unknown, fallbackMessage?: string) => void;
}