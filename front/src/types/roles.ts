import { ShieldCheck, Building2, UserCircle, LayoutDashboard } from 'lucide-react';
import { RoleCatalogEntry } from '@/interfaces/shipment';

// Enum de Roles para evitar errores de string literal
export enum Role {
  User = 'user',
  Company = 'company',
  Operator = 'operator',
  Admin = 'admin',
  SuperAdmin = 'superadmin',
}

// Catálogo de configuración de roles (Backend Logic)
export const ROLE_CATALOG: Record<Role, RoleCatalogEntry> = {
  [Role.User]: { seedOnBootstrap: true, allowSelfSignUp: true, requiresApproval: false },
  [Role.Company]: { seedOnBootstrap: true, allowSelfSignUp: true, requiresApproval: true },
  [Role.Operator]: { seedOnBootstrap: true, allowSelfSignUp: false, requiresApproval: false },
  [Role.Admin]: { seedOnBootstrap: true, allowSelfSignUp: false, requiresApproval: false },
  [Role.SuperAdmin]: { seedOnBootstrap: true, allowSelfSignUp: false, requiresApproval: false },
};

// Mapeo de navegación para Navbar y Dashboards
export const ROLE_NAVIGATION: Record<Role, { href: string; label: string; icon: any }[]> = {
  [Role.SuperAdmin]: [
    { href: '/dashboard/admin', label: 'Sistema', icon: ShieldCheck },
    { href: '/dashboard/user', label: 'Perfil', icon: UserCircle },
  ],
  [Role.Admin]: [
    { href: '/dashboard/admin', label: 'Admin', icon: ShieldCheck },
    { href: '/dashboard/user', label: 'Perfil', icon: UserCircle },
  ],
  [Role.Operator]: [
    { href: '/dashboard/company', label: 'Operaciones', icon: LayoutDashboard },
    { href: '/dashboard/user', label: 'Perfil', icon: UserCircle },
  ],
  [Role.Company]: [
    { href: '/dashboard/company', label: 'Empresa', icon: Building2 },
    { href: '/dashboard/user', label: 'Perfil', icon: UserCircle },
  ],
  [Role.User]: [{ href: '/dashboard/user', label: 'Mi Perfil', icon: UserCircle }],
};
