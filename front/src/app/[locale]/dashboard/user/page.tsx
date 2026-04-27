'use client';

import { useEffect, useState } from 'react';
import UserProfileCard from '@/components/dashboardUser/UserProfileCard';
import ActiveOrders from '@/components/dashboardUser/ActiveOrders';
import OrderHistory from '@/components/dashboardUser/OrderHistory';
import { useAuth } from '@/context/AuthContext';
import type { ActiveOrder, HistoryOrder, UserProfileCardProps } from '@/types/types';
import type { BackendOrder } from '@/types/backend';

type User = UserProfileCardProps['user'];

// Helper para identificar pedidos finalizados
const isDelivered = (status: string) => {
  const s = status.toLowerCase();
  return s === 'completed' || s === 'entregado' || s === 'finalizado';
};

// Mapeos para mantener la compatibilidad con tus componentes actuales
const mapToActiveOrder = (order: any): ActiveOrder => ({
  ...order, // Mantenemos las propiedades originales que usa tu componente de la lista
  id: String(order.id),
  trackingCode: `TRK-${String(order.id).split('-')[0].toUpperCase()}`,
  status: order.status,
  origin: order.pickup_direction || 'No disponible',
  destination: order.delivery_direction || 'No disponible',
  image: order.package?.image || undefined,
});

const mapToHistoryOrder = (order: any): HistoryOrder => ({
  id: String(order.id),
  trackingCode: `TRK-${String(order.id).split('-')[0].toUpperCase()}`,
  deliveredDate: order.updatedAt || 'Reciente',
  destination: order.delivery_direction || 'No disponible',
  status: order.status,
});

const mapSessionUserToCard = (
  userData: NonNullable<ReturnType<typeof useAuth>['userData']>,
): User => ({
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
  const [orderHistory, setOrderHistory] = useState<HistoryOrder[]>([]);
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

        // Usamos la URL que confirmamos que trae los 8 pedidos
        const response = await fetch(
          `https://back-trackifly-production.up.railway.app/orders?userId=${userData.user.id}`
        );

        if (!response.ok) throw new Error("Error al obtener las órdenes");
        
        const orders: any[] = await response.json();

        // Filtramos y mapeamos
        const active = orders
          .filter((order) => !isDelivered(order.status))
          .map(mapToActiveOrder);
          
        const history = orders
          .filter((order) => isDelivered(order.status))
          .map(mapToHistoryOrder);

        setActiveOrders(active);
        setOrderHistory(history);

      } catch (err) {
        console.error("Error en Dashboard:", err);
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
        <div className="max-w-6xl mx-auto"><p className="text-muted">Cargando dashboard...</p></div>
      </main>
    );
  }

  if (sessionError) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="max-w-6xl mx-auto"><p className="text-primary font-medium">{sessionError}</p></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Cabecera del Dashboard */}
        <section className="bg-surface rounded-3xl shadow-sm border border-border p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-primary font-semibold mb-2">Dashboard de usuario</p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Bienvenido, {userData?.user.profile?.first_name || 'Usuario'}
              </h1>
              <p className="text-muted mt-2">
                Aquí puedes revisar tu información, tus pedidos en camino y tu historial.
              </p>
            </div>

            {/* CONTADOR CORREGIDO: Ahora usa 'activeOrders.length' en minúscula */}
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

        {/* Componentes de información */}
        <UserProfileCard user={user!} />
        
        {/* Pasamos los pedidos ya cargados para evitar que el hijo haga otro fetch innecesario */}
        <ActiveOrders orders={activeOrders} />
        
        <OrderHistory orders={orderHistory} />
      </div>
    </main>
  );
}
