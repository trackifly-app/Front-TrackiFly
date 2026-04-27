'use client';

import { useEffect, useState } from 'react';
import UserProfileCard from '@/components/dashboardUser/UserProfileCard';
import ActiveOrders from '@/components/dashboardUser/ActiveOrders';
import OrderHistory from '@/components/dashboardUser/OrderHistory';
import { useAuth } from '@/context/AuthContext';
import { getUserOrders } from '@/services/orders.service';
import type { ActiveOrder, HistoryOrder, UserProfileCardProps } from '@/types/types';
import type { BackendOrder } from '@/types/backend';

type User = UserProfileCardProps['user'];

const isDelivered = (status: string) => status.toLowerCase() === 'completed';

const mapToActiveOrder = (order: BackendOrder): ActiveOrder => ({
  id: String(order.id),
  trackingCode: `TRK-${order.id}`,
  status: order.status,
  origin: order.product || 'No disponible',
  destination: order.user?.address || 'No disponible',
  estimatedDelivery: 'No disponible',
  image: undefined,
});

const mapToHistoryOrder = (order: BackendOrder): HistoryOrder => ({
  id: String(order.id),
  trackingCode: `TRK-${order.id}`,
  deliveredDate: 'No disponible',
  destination: order.user?.address || 'No disponible',
  status: order.status,
});

const mapSessionUserToCard = (
  userData: NonNullable<ReturnType<typeof useAuth>['userData']>,
): User => ({
  email: userData.user.email || 'No disponible',
  name:
    `${userData.user.profile?.first_name || ''} ${userData.user.profile?.last_name || ''}`.trim() ||
    'Usuario',
  address: userData.user.profile?.address || 'No disponible',
  phone: userData.user.profile?.phone || 'No disponible',
  birthDate: userData.user.profile?.birthdate || 'No disponible',
  gender: userData.user.profile?.gender || 'No disponible',
  country: userData.user.profile?.country || 'No disponible',
  image: userData.user.profile?.profile_image || undefined,
});

export default function DashboardUserPage() {
  const { userData, loading: sessionLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [orderHistory, setOrderHistory] = useState<HistoryOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    const initDashboard = async () => {
      if (sessionLoading) return;

      if (!userData?.user?.id) {
        setUser(null);
        setActiveOrders([]);
        setOrderHistory([]);
        setSessionError('No hay sesión activa');
        setLoadingOrders(false);
        return;
      }

      try {
        setLoadingOrders(true);
        setSessionError(null);
        setOrdersError(null);
        setUser(mapSessionUserToCard(userData));

        try {
          const orders: BackendOrder[] = await getUserOrders();

          setActiveOrders(
            orders.filter((order) => !isDelivered(order.status)).map(mapToActiveOrder),
          );

          setOrderHistory(
            orders.filter((order) => isDelivered(order.status)).map(mapToHistoryOrder),
          );
        } catch (err) {
          console.error(err);
          setActiveOrders([]);
          setOrderHistory([]);
          setOrdersError('No se pudieron cargar los pedidos del usuario');
        }
      } catch (err) {
        console.error(err);
        setSessionError('No se pudieron cargar los datos del dashboard');
      } finally {
        setLoadingOrders(false);
      }
    };

    initDashboard();
  }, [sessionLoading, userData]);

  if (sessionLoading || loadingOrders) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-muted">Cargando dashboard...</p>
        </div>
      </main>
    );
  }

  if (sessionError) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-primary font-medium">{sessionError}</p>
        </div>
      </main>
    );
  }

  if (!user || !userData) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-muted">Sesión no válida</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="bg-surface rounded-3xl shadow-sm border border-border p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-primary font-semibold mb-2">Dashboard de usuario</p>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Bienvenido, {userData.user.profile?.first_name || 'Usuario'}{' '}
                {userData.user.profile?.last_name || ''}
              </h1>

              <p className="text-muted mt-2">
                Aquí puedes revisar tu información, tus pedidos en camino y tu historial.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-2xl px-5 py-4">
              <p className="text-sm text-muted">Pedidos activos</p>
              <p className="text-3xl font-bold text-primary">{activeOrders.length}</p>
            </div>
          </div>
        </section>

        {ordersError && (
          <section className="rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4">
            <p className="text-sm font-medium text-primary">{ordersError}</p>
          </section>
        )}

        <UserProfileCard />
        <ActiveOrders orders={activeOrders} />
        <OrderHistory orders={orderHistory} />
      </div>
    </main>
  );
}
