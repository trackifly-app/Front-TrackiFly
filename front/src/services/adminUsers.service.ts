import Swal from 'sweetalert2';
import { AdminApiCompany, AdminApiProfile, AdminApiUser } from '@/interfaces/shipment';

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

export async function getUsers(): Promise<AdminApiUser[]> {
  try {
    return await request<AdminApiUser[]>('/users');
  } catch (error: any) {
    handleError(error.message || 'Error al obtener usuarios');
    return [];
  }
}

export async function getUserById(userId: string): Promise<AdminApiUser | null> {
  try {
    return await request<AdminApiUser>(`/users/${userId}`);
  } catch {
    return null;
  }
}

export async function getProfileByUserId(userId: string): Promise<AdminApiProfile | null> {
  try {
    return await request<AdminApiProfile>(`/profiles/user/${userId}`);
  } catch {
    return null;
  }
}

export async function getCompanyByUserId(userId: string): Promise<AdminApiCompany | null> {
  try {
    return await request<AdminApiCompany>(`/companies/user/${userId}`);
  } catch {
    return null;
  }
}
