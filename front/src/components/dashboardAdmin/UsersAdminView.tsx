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
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-6 lg:px-0">
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-2 font-semibold text-primary">Gestión principal</p>

            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Usuarios</h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted md:text-base">Consulta el listado de usuarios registrados con rol operador o usuario.</p>
          </div>

          <AdminMetricCard title="Total de usuarios" value={users.length} icon={User} compact />
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Listado de usuarios</h2>

            <p className="mt-1 text-sm text-muted">Información general de usuarios y operadores registrados.</p>
          </div>

          {loading ? <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando usuarios...</div> : <AdminUsersTable users={users} />}
        </div>
      </section>
    </main>
  );
}
