import { ShipmentValues } from "@/interfaces/shipment";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createMercadoPagoPreference = async (data: ShipmentValues & { amount: number }): Promise<void> => {
  const response = await fetch(`${API_URL}/mercadopago/create-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la preferencia de pago');
  }

  const result = await response.json();
  window.location.href = result.checkout_url;
};
