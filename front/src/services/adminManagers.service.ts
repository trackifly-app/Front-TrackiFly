import Swal from 'sweetalert2';
import { AdminApiUser } from '@/interfaces/shipment';
import { getUsers } from '@/services/adminUsers.service';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

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
    const response = await fetch(`${APIURL}/users/${userId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roleName: 'admin',
      }),
    });

    const data = await response.json();

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
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudo convertir el usuario en administrador.',
      confirmButtonColor: '#e76f51',
    });

    return false;
  }
}
