import { ShieldPlus } from 'lucide-react';
import { AdminApiUser } from '@/interfaces/shipment';

interface AdminPromotableUsersTableProps {
  users: AdminApiUser[];
  promotingId: string | null;
  onPromote: (user: AdminApiUser) => void;
}

export default function AdminPromotableUsersTable({ users, promotingId, onPromote }: AdminPromotableUsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-205 text-left">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Usuario</th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Correo</th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Rol actual</th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Estado</th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-muted">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {users.map((user) => {
              const fullName = [user.profile?.first_name, user.profile?.last_name].filter(Boolean).join(' ');

              const isPromoting = promotingId === user.id;

              return (
                <tr key={user.id} className="transition-colors hover:bg-surface">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{fullName || 'Usuario sin perfil'}</p>

                    <p className="mt-1 text-xs text-muted">ID: {user.id}</p>
                  </td>

                  <td className="px-5 py-4 text-sm text-muted">{user.email}</td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Usuario</span>
                  </td>

                  <td className="px-5 py-4">
                    <span className={user.isActive === false ? 'rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400' : 'rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'}>{user.isActive === false ? 'Inactivo' : 'Activo'}</span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button type="button" disabled={isPromoting} onClick={() => onPromote(user)} className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60">
                      <ShieldPlus size={16} />
                      {isPromoting ? 'Actualizando...' : 'Convertir en admin'}
                    </button>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-muted">
                  No hay usuarios disponibles para convertir en administrador.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
