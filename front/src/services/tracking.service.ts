import { CompanyApiOrder } from '@/interfaces/shipment';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getOrderByTrackingCode(code: string): Promise<CompanyApiOrder> {
  const response = await fetch(`${API_URL}/orders/track/${encodeURIComponent(code)}`, {
    method: 'GET',
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'No se encontró el envío');
  }

  return data;
}
