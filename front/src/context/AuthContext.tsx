"use client";
import { IAuthContextProps, IUserSession } from "@/interfaces/shipment";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { logout as logoutService } from "@/services/authService";
import { signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthContext = createContext<
  IAuthContextProps & { loading: boolean; checkSession: () => Promise<void> }
>({
  userData: null,
  loading: true,
  setUserData: () => {},
  handleLogout: () => {},
  checkSession: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<IUserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        setUserData(null);
        return;
      }

      const basicData = await res.json();

      if (basicData?.id) {
        const userRes = await fetch(`${API_URL}/users/${basicData.id}`, {
          credentials: "include",
          cache: "no-store",
        });

        const fullData = userRes.ok ? await userRes.json() : basicData;

        const userSession = {
          user: {
            id: fullData.id,
            email: fullData.email,
            role: {
              id: fullData.role?.id || "",
              name: fullData.role?.name || "user",
            },
            profile: {
              id: fullData.profile?.id || "",
              first_name: fullData.profile?.first_name || "",
              last_name: fullData.profile?.last_name || "",
              birthdate: fullData.profile?.birthdate || "",
              gender: fullData.profile?.gender || "",
              phone: fullData.profile?.phone || "",
              address: fullData.profile?.address || "",
              country: fullData.profile?.country || "",
              profile_image: fullData.profile?.profile_image || "",
            },
            // Mapeo limpio de company
            company: fullData.company
              ? {
                  id: fullData.company.id,
                  company_name: fullData.company.company_name,
                  industry: fullData.company.industry,
                  contact_name: fullData.company.contact_name,
                  plan: fullData.company.plan,
                  phone: fullData.company.phone,
                  address: fullData.company.address,
                  country: fullData.company.country,
                  profile_image: fullData.company.profile_image,
                }
              : undefined,
          },
        } as IUserSession;

        setUserData(userSession);

        // salva el rol para uso inmediato
        if (userSession.user.role.name) {
          localStorage.setItem("userRole", userSession.user.role.name);
          localStorage.setItem("userId", userSession.user.id);
        }
      }
    } catch (error) {
      console.error("Error al recuperar la sesión:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSession();
  }, [fetchSession]);

  const handleLogout = async () => {
    try {
      localStorage.setItem("manualLogout", "true");
      await logoutService();
      setUserData(null);
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      // ← limpiar todas las claves de google_synced
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("google_synced_")) {
          localStorage.removeItem(key);
        }
      });
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error en Logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        handleLogout,
        loading,
        checkSession: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
