'use client';

import { useEffect, useState } from 'react';
import { Eye, X, UserRound } from 'lucide-react';

import AdminMetricCard from '@/components/dashboardAdmin/AdminMetricCard';
import BackToAdminDashboard from '@/components/dashboardAdmin/BackToAdminDashboard';

import { getUsers } from '@/services/adminUsers.service';
import { AdminApiUser } from '@/interfaces/shipment';

export default function UsersAdminView() {
  const [users, setUsers] = useState<AdminApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminApiUser | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);

        const usersData = await getUsers();

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
    <>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-0">
        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <div className="mb-8">
            <BackToAdminDashboard />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <p className="mb-2 font-semibold text-primary">Gestión principal</p>

              <h1 className="text-3xl font-bold text-foreground md:text-4xl">Usuarios</h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">Consulta los usuarios registrados en el sistema y revisa sus detalles completos.</p>
            </div>

            <div className="lg:justify-self-end">
              <AdminMetricCard title="Total de usuarios" value={users.length} icon={UserRound} compact />
            </div>
          </div>

          <div className="my-8 h-px w-full bg-border" />

          <div>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Listado de usuarios</h2>

                <p className="mt-1 text-sm text-muted">Información básica de los usuarios registrados.</p>
              </div>

              <div className="inline-flex w-fit items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
                {users.length} registro{users.length !== 1 ? 's' : ''}
              </div>
            </div>

            {loading ? <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando usuarios...</div> : users.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-surface-muted p-10 text-center text-sm text-muted">No hay usuarios registrados.</div> : <AdminUsersTable users={users} onViewDetails={setSelectedUser} />}
          </div>
        </section>
      </main>

      {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </>
  );
}

function AdminUsersTable({ users, onViewDetails }: { users: AdminApiUser[]; onViewDetails: (user: AdminApiUser) => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted">
      <div className="grid grid-cols-[1.4fr_1.5fr_0.7fr_0.7fr_0.7fr] border-b border-border px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">
        <div>Usuario</div>
        <div>Email</div>
        <div>Rol</div>
        <div>Estado</div>
        <div className="text-right">Acción</div>
      </div>

      <div>
        {users.map((user) => {
          const firstName = user.profile?.first_name || '';
          const lastName = user.profile?.last_name || '';
          const fullName = `${firstName} ${lastName}`.trim() || 'Sin nombre';

          const roleName = user.role?.name || 'user';

          const isActive = user.isActive !== false && user.status?.toLowerCase() !== 'inactive';

          return (
            <div key={user.id} className="grid grid-cols-[1.4fr_1.5fr_0.7fr_0.7fr_0.7fr] items-center border-b border-border px-5 py-4 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface">
                  <img src={user.profile?.profile_image || '/default-avatar.png'} alt={fullName} className="h-full w-full object-cover object-center" />
                </div>

                <div>
                  <p className="font-bold text-foreground">{fullName}</p>

                  <p className="mt-0.5 text-xs text-muted">ID: {user.id.slice(0, 8)}...</p>
                </div>
              </div>

              <div className="text-sm text-muted">{user.email || 'Sin email'}</div>

              <div>
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">{roleName}</span>
              </div>

              <div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{isActive ? 'Activo' : 'Inactivo'}</span>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => onViewDetails(user)} className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary">
                  <Eye size={16} />
                  Ver detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UserDetailsModal({ user, onClose }: { user: AdminApiUser; onClose: () => void }) {
  const firstName = user.profile?.first_name || '';
  const lastName = user.profile?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Sin nombre';

  const roleName = user.role?.name || 'user';

  const isActive = user.isActive !== false && user.status?.toLowerCase() !== 'inactive';

  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Sin fecha';

  const updatedAt = user.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Sin fecha';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-border bg-surface p-6 shadow-2xl md:p-8">
        <button type="button" onClick={onClose} className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-muted text-muted transition hover:border-primary/40 hover:text-primary" aria-label="Cerrar detalles">
          <X size={20} />
        </button>

        <button type="button" onClick={onClose} className="mb-6 flex items-center gap-2 font-semibold text-primary transition-transform hover:-translate-x-1">
          ← Volver al listado
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:items-center">
          <div className="space-y-5 self-center">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-border bg-surface-muted p-3">
              <img src={user.profile?.profile_image || '/default-avatar.png'} alt={fullName} className="max-h-full max-w-full object-contain" />
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted">Estado actual</p>

              <p className="mt-1 text-lg font-bold uppercase tracking-widest text-primary">{isActive ? 'Activo' : 'Inactivo'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="pr-10">
              <p className="mb-2 font-semibold text-primary">Detalles del usuario</p>

              <h2 className="text-3xl font-black uppercase italic tracking-tight text-foreground">{fullName}</h2>

              <p className="mt-2 break-all font-mono text-sm text-muted">ID: {user.id}</p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <DetailCard title="Cuenta">
                <DetailItem label="Email" value={user.email || 'Sin email'} />
                <DetailItem label="Rol" value={roleName} />
                <DetailItem label="Estado" value={user.status || (isActive ? 'Activo' : 'Inactivo')} />
                <DetailItem label="Creado" value={createdAt} />
                <DetailItem label="Actualizado" value={updatedAt} />
              </DetailCard>

              <DetailCard title="Perfil">
                <DetailItem label="Nombre" value={firstName || 'Sin nombre'} />
                <DetailItem label="Apellido" value={lastName || 'Sin apellido'} />
                <DetailItem label="Teléfono" value={user.profile?.phone || 'Sin teléfono'} />
                <DetailItem label="País" value={user.profile?.country || 'Sin país'} />
                <DetailItem label="Dirección" value={user.profile?.address || 'Sin dirección'} />
              </DetailCard>

              <DetailCard title="Datos personales">
                <DetailItem label="Fecha de nacimiento" value={user.profile?.birthdate || 'Sin fecha'} />
                <DetailItem label="Género" value={user.profile?.gender || 'Sin género'} />
              </DetailCard>

              <DetailCard title="Empresa asociada">
                <DetailItem label="Empresa" value={user.company?.company_name || user.parentCompany?.email || 'No asociada'} />

                <DetailItem label="ID empresa" value={user.company?.id || user.parentCompany?.id || 'No asociado'} />
              </DetailCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-muted p-5">
      <h3 className="mb-4 font-bold text-primary">{title}</h3>

      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>

      <p className="wrap-break-words font-medium text-foreground">{value}</p>
    </div>
  );
}
