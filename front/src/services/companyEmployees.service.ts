import { CompanyEmployeeApiUser } from '@/interfaces/shipment';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCompanyEmployees(): Promise<CompanyEmployeeApiUser[]> {
  const response = await fetch(`${API_URL}/users?page=1&limit=100`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener empleados');
  }

  return data;
}
