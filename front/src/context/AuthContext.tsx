"use client";
import { IAuthContextProps, ILoginCompany, IUserSession } from "@/interfaces/shipment";
import { createContext, useContext, useState, ReactNode } from "react";
import { logout as logoutService } from "@/services/authService";
import { signOut } from "next-auth/react";

export const AuthContext = createContext<IAuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  // Inicialización perezosa para userData
  const [userData, setUserData] = useState<IUserSession | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userSession");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  // Inicialización perezosa para companyData
  const [companyData, setCompanyData] = useState<ILoginCompany | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("companySession");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      logoutService();
      setUserData(null);
      setCompanyData(null);
      signOut({ redirect: false });
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ userData, setUserData, companyData, setCompanyData, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};