"use client";

import { useEffect, useState } from "react";
import UserProfileCard from "@/components/dashboardUser/UserProfileCard";
import ActiveOrders from "@/components/dashboardUser/ActiveOrders";
import OrderHistory from "@/components/dashboardUser/OrderHistory";
import { getUserOrders } from "@/services/orders.service";
import type { ActiveOrder, HistoryOrder, UserProfileCardProps } from "@/types/types";
import type { BackendOrder } from "@/types/backend";

//  helper
const isDelivered = (status: string) =>
  status.toLowerCase() === "delivered";

//  type VA AQUÍ (afuera)
type User = UserProfileCardProps["user"];

export default function DashboardUserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [orderHistory, setOrderHistory] = useState<HistoryOrder[]>([]);

  useEffect(() => {
    const init = async () => {
      const session = localStorage.getItem("userSession");
      if (!session) return;

      const parsed = JSON.parse(session);

      setUser({
        email: parsed.user.email,
        name: parsed.user.first_name + " " + parsed.user.last_name,
        address: parsed.user.address,
        phone: parsed.user.phone,
        birthDate: "No disponible",
        gender: "No disponible",
        country: "No disponible",
      });

      try {
        const orders: BackendOrder[] = await getUserOrders();

        const active: ActiveOrder[] = orders
          .filter((o) => !isDelivered(o.status))
          .map((o) => ({
            id: String(o.id),
            trackingCode: `TRK-${o.id}`,
            status: o.status,
            origin: "No disponible",
            destination: o.user?.address ?? "No disponible",
            estimatedDelivery: "No disponible",
            image: undefined,
          }));

        const history: HistoryOrder[] = orders
          .filter((o) => isDelivered(o.status))
          .map((o) => ({
            id: String(o.id),
            trackingCode: `TRK-${o.id}`,
            deliveredDate: "No disponible",
            destination: o.user?.address ?? "No disponible",
            status: o.status,
          }));

        setActiveOrders(active);
        setOrderHistory(history);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  if (!user) {
    return <p>Sesión no válida</p>;
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