export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ACTIVE_ORDER_STATUSES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PAID,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
];

export const FINAL_ORDER_STATUSES = [
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
];

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente de pago",
  paid: "Pagado",
  processing: "En preparación",
  shipped: "En camino",
  completed: "Entregado",
  cancelled: "Cancelado",
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};