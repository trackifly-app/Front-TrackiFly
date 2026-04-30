'use client';

import { useEffect, useState } from 'react';
import UserProfileCard from '@/components/dashboardUser/UserProfileCard';
import ActiveOrders from '@/components/dashboardUser/ActiveOrders';
import OrderHistory from '@/components/dashboardUser/OrderHistory';
import { useAuth } from '@/context/AuthContext';
import type { ActiveOrder, UserProfileCardProps } from '@/types/types';
import { FINAL_ORDER_STATUSES, ACTIVE_ORDER_STATUSES } from '@/constants/orderStatus';
import RoleGuard from '@/components/auth/RoleGuard';

type User = UserProfileCardProps['user'];

// Mapeo unificado para que ambos componentes tengan toda la info necesaria
const mapToOrder = (order: any): ActiveOrder => ({
  ...order,
  id: String(order.id),
  tracking_code: order.tracking_code || `TRK-${String(order.id).substring(0, 8).toUpperCase()}`,
  status: order.status,
  pickup_direction: order.pickup_direction || 'No disponible',
  delivery_direction: order.delivery_direction || 'No disponible',
});

const mapSessionUserToCard = (userData: NonNullable<ReturnType<typeof useAuth>['userData']>): User => ({
  email: userData.user.email || 'No disponible',
  name: `${userData.user.profile?.first_name || ''} ${userData.user.profile?.last_name || ''}`.trim() || 'Usuario',
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
  const [orderHistory, setOrderHistory] = useState<ActiveOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    const initDashboard = async () => {
      if (sessionLoading) return;

      if (!userData?.user?.id) {
        setSessionError('No hay sesión activa');
        setLoadingOrders(false);
        return;
      }

      try {
        setLoadingOrders(true);
        setSessionError(null);
        setOrdersError(null);
        setUser(mapSessionUserToCard(userData));

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?userId=${userData.user.id}`, {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Error al obtener las órdenes');

        const rawOrders: any[] = await response.json();
        const allMapped = rawOrders.map(mapToOrder);

        // Filtrado corregido
        setActiveOrders(allMapped.filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status?.toLowerCase() || '')));

        setOrderHistory(allMapped.filter((o) => FINAL_ORDER_STATUSES.includes(o.status?.toLowerCase() || '')));
      } catch (err) {
        console.error('Error en Dashboard:', err);
        setOrdersError('No se pudieron cargar los pedidos del usuario');
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

  return (
    <RoleGuard allowedRoles={['user']}>
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Cabecera del Dashboard (ESTILO RESTAURADO) */}
          <section className="bg-surface rounded-3xl shadow-sm border border-border p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-primary font-semibold mb-2">Dashboard de usuario</p>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Bienvenido, {userData?.user.profile?.first_name || 'Usuario'} {userData?.user.profile?.last_name || 'Usuario'}
                </h1>
                <p className="text-muted mt-2">Aquí puedes revisar tu información, tus pedidos en camino y tu historial.</p>
              </div>
            </div>
          </section>

          {ordersError && (
            <section className="rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4">
              <p className="text-sm font-medium text-primary">{ordersError}</p>
            </section>
          )}

          {/* Componentes de información */}
          <UserProfileCard />

          {/* Listados */}
          <ActiveOrders orders={activeOrders} />
          <OrderHistory orders={orderHistory} />
        </div>
      </main>
    </RoleGuard>
  );
}
