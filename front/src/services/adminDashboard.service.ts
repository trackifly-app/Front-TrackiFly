import { AdminDashboardStats, AdminApiUser } from '@/interfaces/shipment';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }

  return data;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const users = await fetchJson<AdminApiUser[]>('/users?page=1&limit=100');

  const companies = users.filter((user) => {
    return user.role?.name?.toLowerCase() === 'company';
  });

  return {
    totalCompanies: companies.length,
    totalUsers: users.length,
    openIncidents: 0,
  };
}
