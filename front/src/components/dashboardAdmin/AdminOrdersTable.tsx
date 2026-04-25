import Link from 'next/link';
import { Eye } from 'lucide-react';
import { AdminApiOrder, AdminOrdersTableProps } from '@/interfaces/shipment';

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'En proceso',
  completed: 'Completada',
  cancelled: 'Cancelada',
  delivered: 'Entregada',
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
  if (status === 'pending') {
    return 'bg-yellow-500/10 text-yellow-400';
  }

  if (status === 'completed' || status === 'delivered') {
    return 'bg-emerald-500/10 text-emerald-400';
  }

  if (status === 'cancelled') {
    return 'bg-red-500/10 text-red-400';
  }

  return 'bg-primary/10 text-primary';
}

export default function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 text-left">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Paquete</th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Estado</th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">Fecha</th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-muted">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {orders.map((order) => {
              const status = order.status || 'pending';

              return (
                <tr key={order.id} className="transition-colors hover:bg-surface">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{order.package?.name || 'Paquete sin nombre'}</p>

                    <p className="mt-1 line-clamp-1 text-xs text-muted">ID: {order.id}</p>
                  </td>

                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(status)}`}>{statusLabels[status] ?? status}</span>
                  </td>

                  <td className="px-5 py-4 text-sm text-muted">{formatDate(order.created_at)}</td>

                  <td className="px-5 py-4 text-right">
                    <Link href={`/dashboard/admin/ordenes/${order.id}?userId=${order.userId}`} className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary">
                      <Eye size={16} />
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              );
            })}

            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-sm text-muted">
                  No hay órdenes registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
