'use client';

import { useEffect, useState } from 'react';
import { Settings, UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';

import BackToAdminDashboard from '@/components/dashboardAdmin/BackToAdminDashboard';
import AdminMetricCard from '@/components/dashboardAdmin/AdminMetricCard';
import AdminManagersTable from '@/components/dashboardAdmin/AdminManagersTable';

import { AdminApiUser } from '@/interfaces/shipment';
import { getAdminUsers, getPromotableUsers, promoteUserToAdmin } from '@/services/adminManagers.service';
import AdminPromotableUsersTable from './AdminPromotableUsersTable';

export default function AdminManagersView() {
  const [admins, setAdmins] = useState<AdminApiUser[]>([]);
  const [users, setUsers] = useState<AdminApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);

      const [adminUsers, promotableUsers] = await Promise.all([getAdminUsers(), getPromotableUsers()]);

      setAdmins(adminUsers);
      setUsers(promotableUsers);
    } catch (error) {
      console.error('Error al cargar gestión de administradores:', error);
      setAdmins([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handlePromoteUser(user: AdminApiUser) {
    const fullName = [user.profile?.first_name, user.profile?.last_name].filter(Boolean).join(' ');

    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Convertir en administrador?',
      text: `El usuario ${fullName || user.email} tendrá acceso a funciones administrativas.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, convertir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e76f51',
      cancelButtonColor: '#6b7280',
    });

    if (!result.isConfirmed) return;

    try {
      setPromotingId(user.id);

      const success = await promoteUserToAdmin(user.id);

      if (success) {
        await loadData();
      }
    } finally {
      setPromotingId(null);
    }
  }

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

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">Consulta los administradores actuales y convierte usuarios comunes en administradores.</p>
          </div>

          <div className="lg:justify-self-end">
            <AdminMetricCard title="Total de admins" value={admins.length} icon={Settings} compact />
          </div>
        </div>

        <div className="my-8 h-px w-full bg-border" />

        <div className="space-y-10">
          <section>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Administradores actuales</h2>

                <p className="mt-1 text-sm text-muted">Usuarios que actualmente tienen permisos administrativos.</p>
              </div>

              <div className="inline-flex w-fit items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
                {admins.length} registro{admins.length !== 1 ? 's' : ''}
              </div>
            </div>

            {loading ? <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando administradores...</div> : <AdminManagersTable admins={admins} />}
          </section>

          <section>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                  <UserPlus size={22} className="text-primary" />
                  Usuarios disponibles
                </h2>

                <p className="mt-1 text-sm text-muted">Usuarios con rol usuario que pueden convertirse en administradores.</p>
              </div>

              <div className="inline-flex w-fit items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
                {users.length} usuario{users.length !== 1 ? 's' : ''}
              </div>
            </div>

            {loading ? <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando usuarios...</div> : <AdminPromotableUsersTable users={users} promotingId={promotingId} onPromote={handlePromoteUser} />}
          </section>
        </div>
      </section>
    </main>
  );
}
