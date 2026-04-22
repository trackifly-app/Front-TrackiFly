"use client";
import { IAuthContextProps, IUserSession } from "@/interfaces/shipment";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { logout as logoutService } from "@/services/authService";
import { signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthContext = createContext<IAuthContextProps & { loading: boolean }>({
  userData: null,
  loading: true, 
  setUserData: () => {},
  handleLogout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<IUserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // 1. Validamos sesión básica
        // Agregamos no-store para que no te traiga data vieja al recargar
        const res = await fetch(`${API_URL}/auth/me`, { 
          credentials: "include",
          cache: "no-store" 
        });
        
        if (!res.ok) {
          setUserData(null);
          return;
        }

        const basicData = await res.json();

        // 2. Si tenemos ID, buscamos el perfil completo
        if (basicData?.id) {
          const userRes = await fetch(`${API_URL}/users/${basicData.id}`, { 
            credentials: "include",
            cache: "no-store"
          });
          
          if (userRes.ok) {
            const fullData = await userRes.json();
            
            // ESTE ES EL LOG QUE NECESITÁS:
            console.log("INFORMACIÓN DEL USUARIO RECUPERADA:", fullData);
            
            setUserData({
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
              },
            });
          } else {
            console.warn("No se pudo obtener el perfil completo, usando data básica.");
            setUserData({
              user: {
                id: basicData.id,
                email: basicData.email,
                role: basicData.role || { id: "", name: "user" },
                profile: { id: "", first_name: "", last_name: "" }
              }
            } as IUserSession);
          }
        }
      } catch (error) {
        console.error("Error en el proceso de carga de sesión:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutService();
      setUserData(null);
      await signOut({ redirect: false });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ userData, setUserData, handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
