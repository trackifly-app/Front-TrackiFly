import { AdminCompanyRow } from '@/interfaces/shipment';

interface AdminCompaniesTableProps {
  companies: AdminCompanyRow[];
}

export default function AdminCompaniesTable({ companies }: AdminCompaniesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-215 text-left">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Empresa</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Correo</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Industria</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Contacto</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Teléfono</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {companies.map(({ user, company }) => (
              <tr key={user.id} className="transition-colors hover:bg-surface">
                <td className="px-5 py-4">
                  <p className="font-semibold text-foreground">{company?.company_name || 'Empresa sin datos'}</p>
                  <p className="mt-1 text-xs text-muted">{company?.country || 'País no registrado'}</p>
                </td>

                <td className="px-5 py-4 text-sm text-muted">{user.email}</td>

                <td className="px-5 py-4 text-sm text-muted">{company?.industry || 'No registrado'}</td>

                <td className="px-5 py-4 text-sm text-muted">{company?.contact_name || 'No registrado'}</td>

                <td className="px-5 py-4 text-sm text-muted">{company?.phone || 'No registrado'}</td>

                <td className="px-5 py-4">
                  <span className={user.isActive === false ? 'rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400' : 'rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'}>{user.isActive === false ? 'Inactivo' : 'Activo'}</span>
                </td>
              </tr>
            ))}

            {companies.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted">
                  No hay empresas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
