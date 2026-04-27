'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

import AdminMetricCard from '@/components/dashboardAdmin/AdminMetricCard';
import AdminUsersTable from '@/components/dashboardAdmin/AdminUsersTable';
import BackToAdminDashboard from '@/components/dashboardAdmin/BackToAdminDashboard';

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
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-0">
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="mb-8">
          <BackToAdminDashboard />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="mb-2 font-semibold text-primary">Gestión principal</p>

            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Usuarios</h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">Consulta el listado de usuarios registrados con rol operador o usuario.</p>
          </div>

          <div className="lg:justify-self-end">
            <AdminMetricCard title="Total de usuarios" value={users.length} icon={User} compact />
          </div>
        </div>

        <div className="my-8 h-px w-full bg-border" />

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Listado de usuarios</h2>

              <p className="mt-1 text-sm text-muted">Información general de usuarios y operadores registrados.</p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
              {users.length} registro{users.length !== 1 ? 's' : ''}
            </div>
          </div>

          {loading ? <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando usuarios...</div> : <AdminUsersTable users={users} />}
        </div>
      </section>
    </main>
  );
}
