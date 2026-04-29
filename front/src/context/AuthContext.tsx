'use client';
import { IAuthContextProps, IUserSession } from '@/interfaces/shipment';
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { logout as logoutService } from '@/services/authService';
import { signOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthContext = createContext<IAuthContextProps & { loading: boolean; checkSession: () => Promise<void> }>({
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

      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) {
        setUserData(null);
        return;
      }

      const basicData = await res.json();

      if (basicData?.id) {
        const userRes = await fetch(`${API_URL}/users/${basicData.id}`, {
          credentials: 'include',
          cache: 'no-store',
        });

        const fullData = userRes.ok ? await userRes.json() : basicData;

        setUserData({
          user: {
            id: fullData.id,
            email: fullData.email,
            role: {
              id: fullData.role?.id || '',
              name: fullData.role?.name || 'user',
            },
            profile: {
              id: fullData.profile?.id || '',
              first_name: fullData.profile?.first_name || '',
              last_name: fullData.profile?.last_name || '',
              birthdate: fullData.profile?.birthdate || '',
              gender: fullData.profile?.gender || '',
              phone: fullData.profile?.phone || '',
              address: fullData.profile?.address || '',
              country: fullData.profile?.country || '',
              profile_image: fullData.profile?.profile_image || '',
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
        } as IUserSession);
      }
    } catch (error) {
      console.error('Error al recuperar la sesión:', error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const handleLogout = async () => {
    try {
      await logoutService();
      setUserData(null);
      await signOut({ redirect: false });
      window.location.href = '/';
    } catch (error) {
      console.error('Error en Logout:', error);
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
