'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

import AdminMetricCard from '@/components/dashboardAdmin/AdminMetricCard';
import AdminUsersTable from '@/components/dashboardAdmin/AdminUsersTable';

import { AdminUserRow } from '@/interfaces/shipment';

import { getProfileByUserId, getUsers } from '@/services/adminUsers.service';

export default function UsersAdminView() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);

        const allUsers = await getUsers();

        const filteredUsers = allUsers.filter((user) => user.role?.name === 'operator' || user.role?.name === 'user');

        const usersData: AdminUserRow[] = await Promise.all(
          filteredUsers.map(async (user) => {
            const profile = user.profile ?? (await getProfileByUserId(user.id));

            return {
              user,
              profile,
            };
          }),
        );

        setUsers(usersData);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-border bg-surface p-6 md:p-8">
        <div className="mb-6">
          <p className="text-primary font-semibold mb-2">Gestión principal</p>

          <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>

          <p className="mt-2 text-muted">Listado de usuarios registrados con rol operador o usuario.</p>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <AdminMetricCard title="Total de usuarios" value={users.length} description="Usuarios registrados con rol operator o user." icon={User} />
        </div>

        {loading ? <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando usuarios...</div> : <AdminUsersTable users={users} />}
      </section>
    </main>
  );
}
