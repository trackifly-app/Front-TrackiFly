'use client';

import { useEffect, useState } from 'react';
import { X, Mail, Phone, MapPin, User, Shield, Building2, CalendarDays } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Employee } from '@/types/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EmployeeListCard() {
  const { userData, loading: authLoading } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    async function loadEmployees() {
      if (authLoading) return;

      try {
        setLoadingEmployees(true);

        const companyId = userData?.user?.id;

        if (!companyId) {
          setEmployees([]);
          return;
        }

        const response = await fetch(`${API_URL}/users?page=1&limit=50`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al obtener empleados');
        }

        const users: Employee[] = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : Array.isArray(data.users) ? data.users : [];

        const companyEmployees = users.filter((user: Employee) => {
          const roleName = user.role?.name?.toLowerCase?.() || '';
          const isOperator = roleName === 'operator';
          const belongsToCompany = user.parentCompany?.id === companyId;

          return isOperator && belongsToCompany;
        });

        setEmployees(companyEmployees);
      } catch (error) {
        console.error('Error al cargar empleados:', error);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    }

    loadEmployees();
  }, [userData, authLoading]);

  const loading = authLoading || loadingEmployees;

  return (
    <>
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Lista de Empleados</h2>

          <p className="text-sm text-muted">
            Total:{' '}
            <span className="font-semibold text-foreground">
              {employees.length} empleado{employees.length !== 1 ? 's' : ''}
            </span>
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando empleados...</div>
        ) : employees.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface-muted p-10 text-center text-sm text-muted">No hay empleados registrados para esta empresa.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-4 text-left font-medium text-muted">Nombre</th>
                  <th className="px-4 py-4 text-left font-medium text-muted">Email</th>
                  <th className="px-4 py-4 text-left font-medium text-muted">Teléfono</th>
                  <th className="px-4 py-4 text-left font-medium text-muted">País</th>
                  <th className="px-4 py-4 text-left font-medium text-muted">Estado</th>
                  <th className="w-24" />
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {employees.map((employee) => {
                  const firstName = employee.profile?.first_name || '';
                  const lastName = employee.profile?.last_name || '';
                  const fullName = `${firstName} ${lastName}`.trim() || 'Sin nombre';

                  const isActive = employee.is_active === true;
                  const statusLabel = isActive ? 'Activo' : 'Inactivo';

                  return (
                    <tr key={employee.id} className="transition-colors hover:bg-surface-muted/60">
                      <td className="px-4 py-5 font-medium text-foreground">{fullName}</td>

                      <td className="px-4 py-5 text-muted">{employee.email || 'Sin email'}</td>

                      <td className="px-4 py-5 text-muted">{employee.profile?.phone || 'Sin teléfono'}</td>

                      <td className="px-4 py-5 text-muted">{employee.profile?.country || 'Sin país'}</td>

                      <td className="px-4 py-5">
                        <span className={`inline-block rounded-full px-4 py-1 text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{statusLabel}</span>
                      </td>

                      <td className="px-4 py-5 text-right">
                        <button type="button" onClick={() => setSelectedEmployee(employee)} className="text-sm font-medium text-primary transition-colors hover:text-primary-hover">
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedEmployee && (
        <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm">
          <div className="flex h-full items-end justify-center md:items-center p-0 md:p-4">
            <div className="flex h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-border bg-surface shadow-2xl md:h-auto md:max-h-[90vh] md:max-w-5xl md:rounded-[28px]">
              {/* Header */}
              <div className="relative border-b border-border bg-surface px-4 pb-4 pt-4 sm:px-6 md:px-8">
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border md:hidden" />

                <button type="button" onClick={() => setSelectedEmployee(null)} className="absolute right-4 top-4 rounded-full border border-border bg-surface-muted p-2 text-muted transition-colors hover:text-foreground md:right-6 md:top-6" aria-label="Cerrar modal">
                  <X size={18} />
                </button>

                <div className="mt-2 flex min-w-0 flex-col gap-4 pr-12 md:mt-0 md:flex-row md:items-center md:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white shadow-md md:h-20 md:w-20 md:text-2xl">{`${selectedEmployee.profile?.first_name?.[0] || ''}${selectedEmployee.profile?.last_name?.[0] || ''}`.toUpperCase() || 'E'}</div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary md:text-sm">Detalle del empleado</p>

                      <h3 className="mt-1 wrap-break-words text-xl font-bold text-foreground [overflow-wrap:anywhere] md:text-3xl">{`${selectedEmployee.profile?.first_name || ''} ${selectedEmployee.profile?.last_name || ''}`.trim() || 'Empleado sin nombre'}</h3>

                      <p className="mt-1 wrap-break-words text-sm text-muted [overflow-wrap:anywhere]">{selectedEmployee.email || 'Sin email'}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge soft>{selectedEmployee.role?.name || 'Sin rol'}</Badge>
                        <Badge success={selectedEmployee.is_active}>{selectedEmployee.is_active ? 'Activo' : 'Inactivo'}</Badge>
                        <Badge>{selectedEmployee.profile?.country || 'Sin país'}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 md:px-8 md:py-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <QuickInfoCard icon={<Mail size={18} />} label="Email" value={selectedEmployee.email || 'Sin email'} />
                  <QuickInfoCard icon={<Phone size={18} />} label="Teléfono" value={selectedEmployee.profile?.phone || 'Sin teléfono'} />
                  <QuickInfoCard icon={<MapPin size={18} />} label="País" value={selectedEmployee.profile?.country || 'Sin país'} />
                  <QuickInfoCard icon={<Shield size={18} />} label="Status" value={selectedEmployee.status || 'Sin estado'} />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <SectionCard title="Información personal" icon={<User size={18} />}>
                    <DetailRow label="Nombre" value={selectedEmployee.profile?.first_name || 'Sin nombre'} />
                    <DetailRow label="Apellido" value={selectedEmployee.profile?.last_name || 'Sin apellido'} />
                    <DetailRow label="Fecha de nacimiento" value={selectedEmployee.profile?.birthdate || 'Sin fecha'} />
                    <DetailRow label="Género" value={selectedEmployee.profile?.gender || 'Sin género'} />
                    <DetailRow label="Teléfono" value={selectedEmployee.profile?.phone || 'Sin teléfono'} />
                    <DetailRow label="Dirección" value={selectedEmployee.profile?.address || 'Sin dirección'} />
                    <DetailRow label="Imagen de perfil" value={selectedEmployee.profile?.profile_image || 'Sin imagen'} />
                  </SectionCard>

                  <SectionCard title="Información de cuenta" icon={<CalendarDays size={18} />}>
                    <DetailRow label="ID usuario" value={selectedEmployee.id} />
                    <DetailRow label="Email" value={selectedEmployee.email} />
                    <DetailRow label="ID del rol" value={selectedEmployee.role?.id || 'Sin ID de rol'} />
                    <DetailRow label="Rol" value={selectedEmployee.role?.name || 'Sin rol'} />
                    <DetailRow label="Creado el" value={formatDate(selectedEmployee.created_at)} />
                    <DetailRow label="Actualizado el" value={formatDate(selectedEmployee.updated_at)} />
                  </SectionCard>
                </div>

                {selectedEmployee.parentCompany && (
                  <div className="mt-6">
                    <SectionCard title="Empresa asociada" icon={<Building2 size={18} />}>
                      <DetailRow label="ID usuario empresa" value={selectedEmployee.parentCompany.id} />
                      <DetailRow label="Email empresa" value={selectedEmployee.parentCompany.email} />
                      <DetailRow label="Rol empresa" value={selectedEmployee.parentCompany.role?.name || 'Sin rol'} />
                      <DetailRow label="Status empresa" value={selectedEmployee.parentCompany.status || 'Sin estado'} />
                      <DetailRow label="Estado empresa" value={selectedEmployee.parentCompany.is_active ? 'Activa' : 'Inactiva'} />
                    </SectionCard>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border bg-surface px-4 py-4 sm:px-6 md:px-8">
                <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => setSelectedEmployee(null)} className="w-full rounded-2xl border border-border bg-surface-muted px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover sm:w-auto">
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-3xl border border-border bg-surface-muted/50 p-4 md:p-5">
      <div className="mb-4 flex min-w-0 items-center gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-primary">{icon}</div>
        <h4 className="min-w-0 wrap-break-words text-base font-bold text-foreground [overflow-wrap:anywhere]">{title}</h4>
      </div>

      <div className="space-y-3">{children}</div>
    </section>
  );
}

function QuickInfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | number | null }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface-muted p-4">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-primary">{icon}</div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 wrap-break-words text-sm font-semibold text-foreground [overflow-wrap:anywhere]">{value || 'No disponible'}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl bg-surface px-4 py-3">
      <p className="wrap-break-words text-xs font-semibold uppercase tracking-wide text-muted wrap:anywhere">{label}</p>
      <p className="mt-1 wrap-break-words text-sm font-medium text-foreground [overflow-wrap:anywhere]">{value || 'No disponible'}</p>
    </div>
  );
}

function Badge({ children, success = false, soft = false }: { children: React.ReactNode; success?: boolean; soft?: boolean }) {
  const classes = success ? 'bg-green-100 text-green-700' : soft ? 'bg-primary/10 text-primary' : 'bg-surface-muted text-foreground';

  return <span className={`min-w-0 wrap-break-words rounded-full px-3 py-1 text-xs font-semibold [overflow-wrap:anywhere] ${classes}`}>{children}</span>;
}

function formatDate(date?: string | null) {
  if (!date) return 'No disponible';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
