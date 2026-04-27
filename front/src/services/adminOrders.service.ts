import Swal from 'sweetalert2';
import { AdminApiOrder } from '@/interfaces/shipment';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

const handleError = (message: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonColor: '#e76f51',
  });
};

async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${APIURL}${endpoint}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const contentType = response.headers.get('content-type');

  const data = contentType?.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || 'Error en la solicitud');
  }

  return data;
}

export async function getOrdersByUserId(userId: string): Promise<AdminApiOrder[]> {
  try {
    return await request<AdminApiOrder[]>(`/orders?userId=${userId}`);
  } catch (error) {
    console.error(`Error al obtener órdenes del usuario ${userId}:`, error);
    return [];
  }
}

export async function getOrderById(orderId: string, userId: string): Promise<AdminApiOrder | null> {
  try {
    return await request<AdminApiOrder>(`/orders/${orderId}?userId=${userId}`);
  } catch (error: any) {
    handleError(error.message || 'Error al obtener la orden');
    return null;
  }
}
