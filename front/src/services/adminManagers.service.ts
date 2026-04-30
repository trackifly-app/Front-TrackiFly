import Swal from 'sweetalert2';
import { AdminApiUser } from '@/interfaces/shipment';
import { getUsers } from '@/services/adminUsers.service';

export async function getAdminUsers(): Promise<AdminApiUser[]> {
  const users = await getUsers();

  return users.filter((user) => user.role?.name === 'admin');
}

export async function getPromotableUsers(): Promise<AdminApiUser[]> {
  const users = await getUsers();

  return users.filter((user) => user.role?.name === 'user');
}

export async function promoteUserToAdmin(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/proxy/users/${userId}/role-admin`, {
      method: 'PUT',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
      throw new Error(data?.message || 'Error al convertir usuario en administrador');
    }

    Swal.fire({
      icon: 'success',
      title: 'Usuario actualizado',
      text: 'El usuario ahora tiene permisos de administrador.',
      confirmButtonColor: '#e76f51',
    });

    return true;
  } catch (error: unknown) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error instanceof Error ? error.message : 'No se pudo convertir el usuario en administrador.',
      confirmButtonColor: '#e76f51',
    });

    return false;
  }
}
