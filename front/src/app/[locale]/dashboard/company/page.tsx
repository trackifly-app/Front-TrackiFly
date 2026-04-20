"use client";

import { useEffect, useState } from "react";
import CompanyWelcomeCard from "@/components/dashboardCompany/CompanyWelcomeCard";
import CompanyProfileCard from "@/components/dashboardCompany/CompanyProfileCard";
import CompanyQuickAccess, {
  companyModules,
} from "@/components/dashboardCompany/CompanyQuickAccess";
import CompanyAccountDetails, {
  companyAccountDetails,
} from "@/components/dashboardCompany/CompanyAccountDetails";

type StoredSession = {
  token: string;
  user?: {
    id?: string;
  };
};

type BackendUserResponse = {
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
};

type BackendCompanyResponse = {
  company_name?: string;
  industry?: string;
  contact_name?: string;
  plan?: string;
};

type CompanyDashboardData = {
  email: string;
  company_name: string;
  industry: string;
  contact_name: string;
  phone: string;
  address: string;
  country: string;
  plan: string;
  image: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_COMPANY_IMAGE =
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1200&auto=format&fit=crop";

const mapCompanyDashboardData = (
  user: BackendUserResponse,
  company: BackendCompanyResponse,
): CompanyDashboardData => ({
  email: user.email || "No disponible",
  company_name: company.company_name || "Empresa",
  industry: company.industry || "No disponible",
  contact_name: company.contact_name || "No disponible",
  phone: user.phone || "No disponible",
  address: user.address || "No disponible",
  country: user.country || "No disponible",
  plan: company.plan || "No disponible",
  image: DEFAULT_COMPANY_IMAGE,
});

export default function DashboardCompanyPage() {
  const [company, setCompany] = useState<CompanyDashboardData | null>(null);
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

        const [userResponse, companyResponse] = await Promise.all([
          fetch(`${API_URL}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }),
          fetch(`${API_URL}/companies/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }),
        ]);

        if (!userResponse.ok) {
          throw new Error(`No se pudo obtener el usuario: ${userResponse.status}`);
        }

        if (!companyResponse.ok) {
          throw new Error(
            `No se pudo obtener la empresa: ${companyResponse.status}`,
          );
        }

        const [backendUser, backendCompany]: [
          BackendUserResponse,
          BackendCompanyResponse,
        ] = await Promise.all([userResponse.json(), companyResponse.json()]);

        setCompany(mapCompanyDashboardData(backendUser, backendCompany));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos de la empresa");
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-muted">Cargando dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-primary font-medium">{error}</p>
        </div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-muted">No se encontró información de la empresa</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <CompanyWelcomeCard company={company} moduleCount={companyModules.length} />
        <CompanyProfileCard company={company} />
        <CompanyQuickAccess modules={companyModules} />
        <CompanyAccountDetails accountDetails={companyAccountDetails(company.plan)} />
      </div>
    </main>
  );
}
