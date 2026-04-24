import { AdminCompanyRow } from '@/interfaces/shipment';

interface AdminCompaniesTableProps {
  companies: AdminCompanyRow[];
}

export default function AdminCompaniesTable({ companies }: AdminCompaniesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-205 text-left">
          <thead className="border-b border-border bg-surface-muted">
            <tr>
              <th className="px-5 py-4 text-sm font-semibold text-foreground">Empresa</th>
              <th className="px-5 py-4 text-sm font-semibold text-foreground">Correo</th>
              <th className="px-5 py-4 text-sm font-semibold text-foreground">Industria</th>
              <th className="px-5 py-4 text-sm font-semibold text-foreground">Contacto</th>
              <th className="px-5 py-4 text-sm font-semibold text-foreground">Teléfono</th>
              <th className="px-5 py-4 text-sm font-semibold text-foreground">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {companies.map(({ user, company }) => (
              <tr key={user.id} className="transition-colors hover:bg-surface-muted/60">
                <td className="px-5 py-4">
                  <p className="font-semibold text-foreground">{company?.company_name || 'Empresa sin datos'}</p>
                  <p className="text-xs text-muted">{company?.country || 'País no registrado'}</p>
                </td>

                <td className="px-5 py-4 text-sm text-muted">{user.email}</td>

                <td className="px-5 py-4 text-sm text-muted">{company?.industry || 'No registrado'}</td>

                <td className="px-5 py-4 text-sm text-muted">{company?.contact_name || 'No registrado'}</td>

                <td className="px-5 py-4 text-sm text-muted">{company?.phone || 'No registrado'}</td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{user.isActive === false ? 'Inactivo' : 'Activo'}</span>
                </td>
              </tr>
            ))}

            {companies.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted">
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
