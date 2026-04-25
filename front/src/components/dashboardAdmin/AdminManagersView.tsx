'use client';

import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';

import BackToAdminDashboard from '@/components/dashboardAdmin/BackToAdminDashboard';
import AdminMetricCard from '@/components/dashboardAdmin/AdminMetricCard';

import { AdminApiUser } from '@/interfaces/shipment';
import { getUsers } from '@/services/adminUsers.service';
import AdminManagersTable from './AdminManagersTable';

export default function AdminManagersView() {
  const [admins, setAdmins] = useState<AdminApiUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdmins() {
      try {
        setLoading(true);

        const users = await getUsers();

        const adminUsers = users.filter((user) => user.role?.name === 'admin');

        setAdmins(adminUsers);
      } catch (error) {
        console.error('Error al cargar administradores:', error);
        setAdmins([]);
      } finally {
        setLoading(false);
      }
    }

    loadAdmins();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-0">
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="mb-8">
          <BackToAdminDashboard />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="mb-2 font-semibold text-primary">Control y supervisión</p>

            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Gestión de administradores</h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">Consulta los usuarios con permisos administrativos dentro del sistema.</p>
          </div>

          <div className="lg:justify-self-end">
            <AdminMetricCard title="Total de admins" value={admins.length} icon={Settings} compact />
          </div>
        </div>

        <div className="my-8 h-px w-full bg-border" />

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Administradores registrados</h2>

              <p className="mt-1 text-sm text-muted">Usuarios que tienen acceso a funciones administrativas.</p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
              {admins.length} registro{admins.length !== 1 ? 's' : ''}
            </div>
          </div>

          {loading ? <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando administradores...</div> : <AdminManagersTable admins={admins} />}
        </div>
      </section>
    </main>
  );
}
