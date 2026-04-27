"use client";

import { useEffect, useState } from "react";
import AdminWelcomeCard from "@/components/dashboardAdmin/AdminWelcomeCard";
import AdminModules, {
  adminModulesData,
} from "@/components/dashboardAdmin/AdminModules";
import AdminSystemDetails, {
  adminSystemDetailsData,
} from "@/components/dashboardAdmin/AdminSystemDetails";

type StoredSession = {
  token: string;
  user?: {
    id?: string;
  };
};

type BackendRole = {
  name?: string;
};

type BackendCompany = {
  plan?: string;
};

type BackendProfile = {
  first_name?: string;
  last_name?: string;
};

type BackendUser = {
  id: string;
  email?: string;
  status?: string;
  role?: BackendRole;
  profile?: BackendProfile | null;
  company?: BackendCompany | null;
};

type AdminStats = {
  totalCompanies: number;
  activeCompanies: number;
  openIncidents: number;
  activePlans: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getFullName = (user: BackendUser) =>
  `${user.profile?.first_name || ""} ${user.profile?.last_name || ""}`.trim() ||
  user.email ||
  "Admin";

const buildAdminStats = (users: BackendUser[]): AdminStats => {
  const companyUsers = users.filter((user) => user.role?.name === "company");
  const activeCompanies = companyUsers.filter(
    (user) => user.status?.toUpperCase() === "APPROVED",
  );
  const paidPlans = companyUsers.filter((user) => {
    const plan = user.company?.plan?.toUpperCase();
    return plan && plan !== "FREE";
  });
  const pendingCompanies = companyUsers.filter(
    (user) => user.status?.toUpperCase() === "PENDING",
  );

  return {
    totalCompanies: companyUsers.length,
    activeCompanies: activeCompanies.length,
    openIncidents: pendingCompanies.length,
    activePlans: paidPlans.length,
  };
};

export default function DashboardAdminPage() {
  const [adminName, setAdminName] = useState("Admin");
  const [stats, setStats] = useState<AdminStats>({
    totalCompanies: 0,
    activeCompanies: 0,
    openIncidents: 0,
    activePlans: 0,
  });
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
          return;
        }

        const parsed: StoredSession = JSON.parse(session);
        const token = parsed.token;
        const userId = parsed.user?.id;

        if (!API_URL) {
          throw new Error("NEXT_PUBLIC_API_URL no está configurado");
        }

        if (!token || !userId) {
          setError("La sesión no contiene credenciales válidas");
          return;
        }

        const [adminResponse, usersResponse] = await Promise.all([
          fetch(`${API_URL}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }),
          fetch(`${API_URL}/users?page=1&limit=200`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }),
        ]);

        if (!adminResponse.ok) {
          throw new Error(
            `No se pudo obtener el perfil del administrador: ${adminResponse.status}`,
          );
        }

        if (!usersResponse.ok) {
          throw new Error(
            `No se pudo obtener el listado de usuarios: ${usersResponse.status}`,
          );
        }

        const [adminUser, users]: [BackendUser, BackendUser[]] = await Promise.all([
          adminResponse.json(),
          usersResponse.json(),
        ]);

        setAdminName(getFullName(adminUser));
        setStats(buildAdminStats(users));
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

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <AdminWelcomeCard adminName={adminName} stats={stats} />
        <AdminModules modules={adminModulesData} />
        <AdminSystemDetails details={adminSystemDetailsData} />
      </div>
    </main>
  );
}
