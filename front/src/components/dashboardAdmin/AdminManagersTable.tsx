import { AdminManagersTableProps } from '@/interfaces/shipment';

export default function AdminManagersTable({ admins }: AdminManagersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-190 text-left">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Administrador</th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Correo</th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Rol</th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {admins.map((admin) => {
              const fullName = [admin.profile?.first_name, admin.profile?.last_name].filter(Boolean).join(' ');

              return (
                <tr key={admin.id} className="transition-colors hover:bg-surface">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{fullName || 'Administrador sin perfil'}</p>

                    <p className="mt-1 text-xs text-muted">ID: {admin.id}</p>
                  </td>

                  <td className="px-5 py-4 text-sm text-muted">{admin.email}</td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Administrador</span>
                  </td>

                  <td className="px-5 py-4">
                    <span className={admin.isActive === false ? 'rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400' : 'rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'}>{admin.isActive === false ? 'Inactivo' : 'Activo'}</span>
                  </td>
                </tr>
              );
            })}

            {admins.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-sm text-muted">
                  No hay administradores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
