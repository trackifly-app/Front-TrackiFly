import { AdminIncidentsTableProps } from '@/interfaces/shipment';

const statusLabels: Record<string, string> = {
  open: 'Abierta',
  in_progress: 'En proceso',
  resolved: 'Resuelta',
  closed: 'Cerrada',
};

const priorityLabels: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
};

const typeLabels: Record<string, string> = {
  system: 'Sistema',
  order: 'Orden',
  user: 'Usuario',
  company: 'Empresa',
  security: 'Seguridad',
};

function formatDate(date?: string) {
  if (!date) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function getStatusClass(status: string) {
  if (status === 'open') {
    return 'bg-yellow-500/10 text-yellow-400';
  }

  if (status === 'in_progress') {
    return 'bg-primary/10 text-primary';
  }

  if (status === 'resolved' || status === 'closed') {
    return 'bg-emerald-500/10 text-emerald-400';
  }

  return 'bg-surface text-muted';
}

function getPriorityClass(priority: string) {
  if (priority === 'critical') {
    return 'bg-red-500/10 text-red-400';
  }

  if (priority === 'high') {
    return 'bg-orange-500/10 text-orange-400';
  }

  if (priority === 'medium') {
    return 'bg-yellow-500/10 text-yellow-400';
  }

  return 'bg-surface text-muted';
}

export default function AdminIncidentsTable({ incidents }: AdminIncidentsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-215 text-left">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Incidencia</th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Tipo</th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Prioridad</th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Estado</th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Fecha</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {incidents.map((incident) => (
              <tr key={incident.id} className="transition-colors hover:bg-surface">
                <td className="px-5 py-4">
                  <p className="font-semibold text-foreground">{incident.title}</p>

                  <p className="mt-1 line-clamp-1 text-xs text-muted">{incident.description}</p>

                  <p className="mt-1 text-xs text-muted">ID: {incident.id}</p>
                </td>

                <td className="px-5 py-4 text-sm text-muted">{typeLabels[incident.type] ?? incident.type}</td>

                <td className="px-5 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClass(incident.priority)}`}>{priorityLabels[incident.priority] ?? incident.priority}</span>
                </td>

                <td className="px-5 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(incident.status)}`}>{statusLabels[incident.status] ?? incident.status}</span>
                </td>

                <td className="px-5 py-4 text-sm text-muted">{formatDate(incident.created_at)}</td>
              </tr>
            ))}

            {incidents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-muted">
                  No hay incidencias registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
