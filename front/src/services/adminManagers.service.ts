import { AdminApiUser } from '@/interfaces/shipment';
import { getUsers } from '@/services/adminUsers.service';

export async function getAdminUsers(): Promise<AdminApiUser[]> {
  const users = await getUsers();

  return users.filter((user) => user.role?.name === 'admin');
}
