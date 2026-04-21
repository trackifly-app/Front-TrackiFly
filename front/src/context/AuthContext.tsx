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

export const AuthContext = createContext<IAuthContextProps>({
  userData: null,
  setUserData: () => {},
  handleLogout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<IUserSession | null>(null);

  // Al montar la app, consultamos /auth/me para saber si el usuario
  // ya tiene una sesión activa (cookie httpOnly válida en el browser).
  // Esto reemplaza el viejo localStorage — ahora la persistencia la maneja la cookie.
  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) {
          setUserData(null);
          return;
        }

        // /auth/me devuelve solo { id, role, status } desde el JWT.
        // Los datos completos del usuario (nombre, email, etc.) se cargan
        // en cada vista de perfil por separado cuando se necesitan.
        setUserData({
          user: {
            id: data.id,
            role: data.role,
            email: "",
            first_name: "",
            last_name: "",
            address: "",
            phone: "",
          },
        });
      })
      .catch(() => setUserData(null));
  }, []);

  const handleLogout = () => {
    if (typeof window === "undefined") return;

    try {
      // Llamamos al back para que borre la cookie httpOnly del servidor.
      // Sin este paso, la cookie quedaría viva aunque limpiemos el estado local.
      logoutService();

      // Limpiamos el estado global para que la UI refleje que no hay sesión
      setUserData(null);

      // Si el usuario había iniciado sesión con Google, cerramos esa sesión también
      signOut({ redirect: false });

      alert("Su sesión fue cerrada exitosamente.");
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ userData, setUserData, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
