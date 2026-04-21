"use client";

import { useEffect, useState } from "react"; // Hooks para ciclo de vida y estado local
import UserProfileCard from "@/components/dashboardUser/UserProfileCard"; // Card del perfil del usuario
import ActiveOrders from "@/components/dashboardUser/ActiveOrders"; // Lista de órdenes activas
import OrderHistory from "@/components/dashboardUser/OrderHistory"; // Historial de órdenes
import { getUserOrders } from "@/services/orders.service"; // Service que trae órdenes del backend
import type { ActiveOrder, HistoryOrder, UserProfileCardProps } from "@/types/types"; // Tipos visuales del frontend
import type { BackendOrder } from "@/types/backend"; // Tipo de orden tal como llega desde backend

type User = UserProfileCardProps["user"]; // Reutiliza el tipo exacto que espera UserProfileCard

type StoredSession = { // Estructura mínima de la sesión guardada en localStorage
  token: string;
  user?: {
    id?: string;
  };
};

type BackendProfileResponse = { // Forma esperada de la respuesta del endpoint /users/:id
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

const API_URL = process.env.NEXT_PUBLIC_API_URL; // URL base del backend

const isDelivered = (status: string) => status.toLowerCase() === "completed"; // Detecta si la orden ya fue entregada

const mapToActiveOrder = (order: BackendOrder): ActiveOrder => ({ // Adapta una orden del backend al formato de órdenes activas
  id: String(order.id),
  trackingCode: `TRK-${order.id}`,
  status: order.status,
  origin: order.product || "No disponible",
  destination: order.user?.address || "No disponible",
  estimatedDelivery: "No disponible",
  image: undefined,
});

const mapToHistoryOrder = (order: BackendOrder): HistoryOrder => ({ // Adapta una orden del backend al formato del historial
  id: String(order.id),
  trackingCode: `TRK-${order.id}`,
  deliveredDate: "No disponible",
  destination: order.user?.address || "No disponible",
  status: order.status,
});

const mapBackendUserToCard = (backendUser: BackendProfileResponse): User => ({ // Convierte el usuario del backend al formato que usa la card
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

export default function DashboardUserPage() { // Componente principal del dashboard del usuario
  const [user, setUser] = useState<User | null>(null); // Guarda el perfil mostrado arriba
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]); // Guarda las órdenes activas
  const [orderHistory, setOrderHistory] = useState<HistoryOrder[]>([]); // Guarda las órdenes entregadas
  const [loading, setLoading] = useState(true); // Controla la pantalla de carga
  const [error, setError] = useState<string | null>(null); // Guarda un posible mensaje de error

  useEffect(() => { // Se ejecuta una vez cuando la página se monta
    const initDashboard = async () => { // Carga perfil y órdenes del usuario
      try {
        setLoading(true); // Activa el estado de carga
        setError(null); // Limpia errores anteriores

        const session = localStorage.getItem("userSession"); // Recupera la sesión del navegador

        if (!session) { // Si no hay sesión, no se puede continuar
          setError("No hay sesiÃ³n activa");
          setLoading(false);
          return;
        }

        const parsed: StoredSession = JSON.parse(session); // Convierte la sesión a objeto
        const token = parsed.token; // Extrae el token de autenticación
        const userId = parsed.user?.id; // Extrae el id del usuario autenticado

        if (!API_URL) { // Verifica que exista la URL del backend
          throw new Error("NEXT_PUBLIC_API_URL no estÃƒÂ¡ configurado");
        }

        if (!token || !userId) { // Verifica que la sesión tenga credenciales válidas
          setError("La sesiÃƒÂ³n no contiene credenciales vÃƒÂ¡lidas");
          setLoading(false);
          return;
        }

        const userResponse = await fetch(`${API_URL}/users/${userId}`, { // Pide al backend el perfil del usuario por su id
          headers: {
            Authorization: `Bearer ${token}`, // Envía el token como credencial
          },
          cache: "no-store", // Evita respuestas cacheadas
        });

        if (!userResponse.ok) { // Si el backend responde con error, se detiene el flujo
          throw new Error(`No se pudo obtener el perfil: ${userResponse.status}`);
        }

        const backendUser: BackendProfileResponse = await userResponse.json(); // Convierte la respuesta del perfil a JSON
        setUser(mapBackendUserToCard(backendUser)); // Adapta el usuario y lo guarda en estado

        const orders: BackendOrder[] = await getUserOrders(); // Pide las órdenes usando el service del frontend

        setActiveOrders( // Guarda las órdenes que aún no fueron entregadas
          orders.filter((order) => !isDelivered(order.status)).map(mapToActiveOrder)
        );

        setOrderHistory( // Guarda las órdenes entregadas dentro del historial
          orders.filter((order) => isDelivered(order.status)).map(mapToHistoryOrder)
        );
      } catch (err) {
        console.error(err); // Muestra el error técnico en consola
        setError("No se pudieron cargar los datos del dashboard"); // Muestra error amigable en pantalla
      } finally {
        setLoading(false); // Apaga la carga al final, salga bien o mal
      }
    };

    initDashboard(); // Ejecuta la carga inicial del dashboard
  }, []);

  if (loading) { // Mientras carga, muestra mensaje de espera
    return (
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-muted">Cargando dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) { // Si ocurrió error, muestra el mensaje y corta el render normal
    return (
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-primary font-medium">{error}</p>
        </div>
      </main>
    );
  }

  if (!user) { // Si no hay usuario cargado, la sesión fue inválida o insuficiente
    return (
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-muted">SesiÃ³n no vÃ¡lida</p>
        </div>
      </main>
    );
  }

  return ( // Si todo salió bien, renderiza el dashboard completo
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <UserProfileCard user={user} /> {/* Muestra los datos personales */}
        <ActiveOrders orders={activeOrders} /> {/* Muestra órdenes activas */}
        <OrderHistory orders={orderHistory} /> {/* Muestra historial de órdenes */}
      </div>
    </main>
  );
}
