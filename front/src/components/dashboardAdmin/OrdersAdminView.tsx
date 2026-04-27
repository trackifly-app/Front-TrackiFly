'use client';

import { useEffect, useState } from 'react';
import { PackageSearch } from 'lucide-react';

import AdminMetricCard from '@/components/dashboardAdmin/AdminMetricCard';
import BackToAdminDashboard from '@/components/dashboardAdmin/BackToAdminDashboard';
import AdminOrdersTable from '@/components/dashboardAdmin/AdminOrdersTable';

import { AdminApiOrder } from '@/interfaces/shipment';
import { getOrdersByUserId } from '@/services/adminOrders.service';
import { getUsers } from '@/services/adminUsers.service';

export default function OrdersAdminView() {
  const [orders, setOrders] = useState<AdminApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);

        const users = await getUsers();

        const ordersByUser = await Promise.all(
          users.map(async (user) => {
            return await getOrdersByUserId(user.id);
          }),
        );

        const allOrders = ordersByUser.flat();

        setOrders(allOrders);
      } catch (error) {
        console.error('Error al cargar órdenes:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-0">
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="mb-8">
          <BackToAdminDashboard />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="mb-2 font-semibold text-primary">Gestión principal</p>

            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Órdenes</h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">Consulta el listado completo de órdenes registradas en el sistema.</p>
          </div>

          <div className="lg:justify-self-end">
            <AdminMetricCard title="Total de órdenes" value={orders.length} icon={PackageSearch} compact />
          </div>
        </div>

        <div className="my-8 h-px w-full bg-border" />

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Listado de órdenes</h2>

              <p className="mt-1 text-sm text-muted">Información general de los envíos registrados.</p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
              {orders.length} registro{orders.length !== 1 ? 's' : ''}
            </div>
          </div>

          {loading ? <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando órdenes...</div> : <AdminOrdersTable orders={orders} />}
        </div>
      </section>
    </main>
  );
}
