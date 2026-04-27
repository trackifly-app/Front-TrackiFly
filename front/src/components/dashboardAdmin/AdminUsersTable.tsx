import { AdminUsersTableProps } from '@/interfaces/shipment';

const roleLabels: Record<string, string> = {
  operator: 'Operador',
  user: 'Usuario',
  company: 'Empresa',
  admin: 'Administrador',
};

export default function AdminUsersTable({ users }: AdminUsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-215 text-left">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Usuario</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Correo</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Rol</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Teléfono</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">País</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {users.map(({ user, profile }) => {
              const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ');

              return (
                <tr key={user.id} className="transition-colors hover:bg-surface">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{fullName || 'Usuario sin perfil'}</p>
                    <p className="mt-1 text-xs text-muted">ID: {user.id}</p>
                  </td>

                  <td className="px-5 py-4 text-sm text-muted">{user.email}</td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{roleLabels[user.role?.name] ?? user.role?.name}</span>
                  </td>

                  <td className="px-5 py-4 text-sm text-muted">{profile?.phone || 'No registrado'}</td>

                  <td className="px-5 py-4 text-sm text-muted">{profile?.country || 'No registrado'}</td>

                  <td className="px-5 py-4">
                    <span className={user.isActive === false ? 'rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400' : 'rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'}>{user.isActive === false ? 'Inactivo' : 'Activo'}</span>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
