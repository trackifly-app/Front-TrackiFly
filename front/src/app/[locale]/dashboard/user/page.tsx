"use client";

import { useEffect, useState } from "react";
import UserProfileCard from "@/components/dashboardUser/UserProfileCard";
import ActiveOrders from "@/components/dashboardUser/ActiveOrders";
import OrderHistory from "@/components/dashboardUser/OrderHistory";
import { getUserOrders } from "@/services/orders.service";
import type {
  ActiveOrder,
  HistoryOrder,
  UserProfileCardProps,
} from "@/types/types";
import type { BackendOrder } from "@/types/backend";

type User = UserProfileCardProps["user"];
type StoredSession = {
  token: string;
  user?: {
    id?: string;
  };
};
type BackendProfileResponse = {
  id: string;
  email?: string;
  name?: string;
  address?: string;
  phone?: string;
  country?: string;
  image?: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    birthdate?: string;
    gender?: string;
  };
};
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const isDelivered = (status: string) =>
  status.toLowerCase() === "delivered";

const mapToActiveOrder = (order: BackendOrder): ActiveOrder => ({
  id: String(order.id),
  trackingCode: `TRK-${order.id}`,
  status: order.status,
  origin: order.product || "No disponible",
  destination: order.user?.address || "No disponible",
  estimatedDelivery: "No disponible",
  image: undefined,
});

const mapToHistoryOrder = (order: BackendOrder): HistoryOrder => ({
  id: String(order.id),
  trackingCode: `TRK-${order.id}`,
  deliveredDate: "No disponible",
  destination: order.user?.address || "No disponible",
  status: order.status,
});

const mapBackendUserToCard = (backendUser: BackendProfileResponse): User => ({
  email: backendUser.email || "No disponible",
  name:
    `${backendUser.profile?.first_name || ""} ${backendUser.profile?.last_name || ""}`.trim() ||
    backendUser.name ||
    "Usuario",
  address: backendUser.address || "No disponible",
  phone: backendUser.phone || "No disponible",
  birthDate: backendUser.profile?.birthdate || "No disponible",
  gender: backendUser.profile?.gender || "No disponible",
  country: backendUser.country || "No disponible",
  image: backendUser.image || undefined,
});

export default function DashboardUserPage() {

  const [user, setUser] = useState<User | null>(null);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [orderHistory, setOrderHistory] = useState<HistoryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  useEffect(() => {

    const initDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const session = localStorage.getItem("userSession");
        if (!session) {
          setError("No hay sesión activa");
          setLoading(false);
          return;
        }

        const parsed: StoredSession = JSON.parse(session);
        const token = parsed.token;
        const userId = parsed.user?.id;

        if (!API_URL) {
          throw new Error("NEXT_PUBLIC_API_URL no estÃ¡ configurado");
        }

        if (!token || !userId) {
          setError("La sesiÃ³n no contiene credenciales vÃ¡lidas");
          setLoading(false);
          return;
        }

        const userResponse = await fetch(`${API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!userResponse.ok) {
          throw new Error(`No se pudo obtener el perfil: ${userResponse.status}`);
        }

        const backendUser: BackendProfileResponse = await userResponse.json();
        setUser(mapBackendUserToCard(backendUser));

        const orders: BackendOrder[] = await getUserOrders();

        setActiveOrders(
          orders
            .filter((order) => !isDelivered(order.status))
            .map(mapToActiveOrder)
        );

        setOrderHistory(
          orders
            .filter((order) => isDelivered(order.status))
            .map(mapToHistoryOrder)
        );
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, []);


  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-muted">Cargando dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-primary font-medium">{error}</p>
        </div>
      </main>
    );
  }

  if (!user) {
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
        <UserProfileCard user={user} />
        <ActiveOrders orders={activeOrders} />
        <OrderHistory orders={orderHistory} />
      </div>
    </main>
  );
}
