import { AdminDashboardStats } from '@/interfaces/shipment';
import { getUsers } from '@/services/adminUsers.service';

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const users = await getUsers();

  const companyUsers = users.filter((user) => user.role?.name === 'company');

  const activeCompanies = companyUsers.filter((user) => user.isActive !== false);

  const activePlans = companyUsers.filter((user) => Boolean(user.company?.plan));

  return {
    totalCompanies: companyUsers.length,
    activeCompanies: activeCompanies.length,
    openIncidents: 0,
    activePlans: activePlans.length,
  };
}
