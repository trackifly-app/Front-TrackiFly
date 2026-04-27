import { AdminApiOrder } from '@/interfaces/shipment';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getOrdersByCompanyUserId(userId: string): Promise<AdminApiOrder[]> {
  const response = await fetch(`${API_URL}/orders?userId=${userId}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener las órdenes');
  }

  return data;
}
