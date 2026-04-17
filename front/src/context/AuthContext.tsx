'use client'
import { IAuthContextProps, IUserSession } from "@/interfaces/shipment";
import { createContext, useContext, useState, ReactNode } from "react";
import { logout as logoutService } from "@/services/authService";

export const AuthContext = createContext<IAuthContextProps>({
    userData: null,
    setUserData: () => { },
    handleLogout: () => { }
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Iniciamos el estado buscando si ya hay una sesión guardada en el navegador
    const [userData, setUserData] = useState<IUserSession | null>(() => {
        if (typeof window !== "undefined") {
            const storedData = localStorage.getItem("userSession");
            
            if (storedData) {
                try {
                    // Si existe la sesión, la transformamos de texto a objeto
                    return JSON.parse(storedData);
                } catch (error) {
                    return null;
                }
            }
        }
        return null;
    });

    // Función para cerrar la sesión por completo
    const handleLogout = () => {
        if (typeof window !== "undefined") {
            try {
                // 1. Limpiamos el localStorage y cookies usando el servicio central de auth
                logoutService(); 
                
                // 2. Reseteamos el estado global de la app a null
                setUserData(null);
                
                // 3. Avisamos al usuario y lo mandamos al inicio
                alert("Su sesión fue cerrada exitosamente.");
                window.location.href = "/";
            } catch (error) {
                // Si algo falla aquí, es un error crítico de la aplicación
                console.error("Error al cerrar sesión:", error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ userData, setUserData, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto de forma más simple en los componentes
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};