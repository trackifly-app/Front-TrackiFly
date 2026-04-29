'use client';

import { useAuth } from '@/context/AuthContext';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

type AppRole = 'admin' | 'superadmin' | 'company' | 'operator' | 'user';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: AppRole[];
}

function getDashboardByRole(role: AppRole, locale: string) {
  if (role === 'admin' || role === 'superadmin') return `/${locale}/dashboard/admin`;
  if (role === 'company' || role === 'operator') return `/${locale}/dashboard/company`;
  if (role === 'user') return `/${locale}/dashboard/user`;

  return `/${locale}/login`;
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { userData, loading } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (loading) return;

    if (!userData?.user) {
      router.replace(`/${locale}/login`);
      return;
    }

    const role = userData.user.role.name as AppRole;

    if (!allowedRoles.includes(role)) {
      router.replace(getDashboardByRole(role, locale));
    }
  }, [userData, loading, allowedRoles, router, locale]);

  if (loading || !userData?.user) return null;

  const role = userData.user.role.name as AppRole;

  if (!allowedRoles.includes(role)) return null;

  return <>{children}</>;
}
