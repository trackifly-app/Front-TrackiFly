import { AdminUserRow } from '@/interfaces/shipment';

interface AdminUsersTableProps {
  users: AdminUserRow[];
}

const roleLabels: Record<string, string> = {
  operator: 'Operador',
  user: 'Usuario',
  company: 'Empresa',
  admin: 'Administrador',
};

export default function AdminUsersTable({ users }: AdminUsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-205 text-left">
          <thead className="border-b border-border bg-surface-muted">
            <tr>
              <th className="px-5 py-4 text-sm font-semibold text-foreground">Usuario</th>
              <th className="px-5 py-4 text-sm font-semibold text-foreground">Correo</th>
              <th className="px-5 py-4 text-sm font-semibold text-foreground">Rol</th>
              <th className="px-5 py-4 text-sm font-semibold text-foreground">Teléfono</th>
              <th className="px-5 py-4 text-sm font-semibold text-foreground">País</th>
              <th className="px-5 py-4 text-sm font-semibold text-foreground">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {users.map(({ user, profile }) => {
              const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ');

              return (
                <tr key={user.id} className="transition-colors hover:bg-surface-muted/60">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{fullName || 'Usuario sin perfil'}</p>
                    <p className="text-xs text-muted">ID: {user.id}</p>
                  </td>

                  <td className="px-5 py-4 text-sm text-muted">{user.email}</td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{roleLabels[user.role?.name] ?? user.role?.name}</span>
                  </td>

                  <td className="px-5 py-4 text-sm text-muted">{profile?.phone || 'No registrado'}</td>

                  <td className="px-5 py-4 text-sm text-muted">{profile?.country || 'No registrado'}</td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-muted">{user.isActive === false ? 'Inactivo' : 'Activo'}</span>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted">
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
