import { AdminRoleName, AdminUserRole, DetailItem, ModuleItem } from '@/types/types';
import { LucideIcon } from 'lucide-react';

// --- ENVÍOS Y CALCULADORA ---

export interface ShipmentValues {
  // Agregué campos que estaban en Errors pero faltaban aquí
  name: string; // M cambio aqui
  category_id: string; // M cambio aqui
  description: string; // M cambio aqui
  image: string; // M cambio aqui
  // ---
  pickup_direction: string;
  delivery_direction: string;
  height: number|'';
  width: number|'';
  depth: number|'';
  weight: number|'';
  fragile: boolean;
  cooled: boolean;
  dangerous: boolean;
  urgent: boolean;
  unit: string;
  distance: number;
}

export interface ShipmentErrors {
  name?: string;
  category_id?: string;
  pickup_direction?: string;
  delivery_direction?: string;
  height?: string;
  width?: string;
  depth?: string;
  image?: string;
  weight?: string;
  description?: string;
  fragile?: string;
  cooled?: string;
  dangerous?: string;
  urgent?: string;
  unit?: string;
  distance?: string;
}

export interface CalculatorValues {
  height: number;
  width: number;
  depth: number;
  distance: number;
}

// --- AUTENTICACIÓN Y SESIÓN ---

export interface IUserSession {
  user: {
    id: string;
    email: string;
    role: {
      id: string;
      name: string;
    };
    profile?: {
      id: string;
      first_name?: string;
      last_name?: string;
      birthdate?: string;
      gender?: string;
      phone?: string;
      address?: string;
      country?: string;
      profile_image?: string;
    };
    company?: {
      id: string;
      company_name: string;
      industry: string;
      contact_name: string;
      plan: string;
      phone: string;
      address: string;
      country: string;
      profile_image: string;
    };
  };
}

export interface IAuthContextProps {
  userData: IUserSession | null;
  setUserData: (values: IUserSession | null) => void;
  companyData?: ILoginCompany | null;
  setCompanyData?: (values: ILoginCompany | null) => void;
  handleLogout: () => void;
}

export interface ILoginProps {
  email: string;
  password: string;
}

export interface ILoginErrors {
  email?: string;
  password?: string;
}

export interface IRegisterProps {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  gender?: string; // M cambio aqui
  birthdate?: string; // M cambio aqui
  country: string; // M cambio aqui
}

export interface IRegisterErrors {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  phone?: string;
  gender?: string; // M cambio aqui
  birthdate?: string; // M cambio aqui
  country?: string; // M cambio aqui
}

// --- EMPRESAS ---

export interface IRegisterCompanyProps {
  email: string;
  password: string;
  company_name: string;
  industry: string;
  contact_name: string;
  phone: string;
  address: string;
  country: string;
  plan?: string;
}

export interface IRegisterCompanyErrors {
  email?: string;
  password?: string;
  company_name?: string;
  industry?: string;
  contact_name?: string;
  phone?: string;
  address?: string;
  country?: string;
  plan?: string;
}

// --- UI Y COMPONENTES ---

export interface AccountDetailItem {
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
}

export interface CompanyAccountDetailsProps {
  accountDetails: AccountDetailItem[];
}

export interface AdminModulesProps {
  modules: AdminModule[];
}

export interface CompanyProfileCardProps {
  company: {
    email: string;
    company_name: string;
    industry: string;
    contact_name: string;
    phone: string;
    address: string;
    country: string;
  };
}

export interface CompanyQuickAccessProps {
  modules: ModuleItem[];
}

export interface CompanyWelcomeCardProps {
  company: {
    company_name: string;
    country: string;
    plan: string;
    image: string;
  };
  moduleCount: number;
}

export interface EmployeeWelcomeCardProps {
  employeeCount?: number;
}

export interface ICountryProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

// Interfaz para el catálogo de roles
export interface RoleCatalogEntry {
  seedOnBootstrap: boolean; // M cambio aqui
  allowSelfSignUp: boolean; // M cambio aqui
  requiresApproval: boolean; // M cambio aqui
}

export interface ILoginCompany {
  token: string;
  role?: {
    id: string;
    email: string;
    name: string;
  };
  company?: {
    company_name: string;
    industry: string;
    contact_name: string;
    plan: 'free' | 'pro' | 'enterprise';
    phone: string;
    address: string;
    country: string;
  };
}
export interface IUpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  birthdate?: string;
  gender?: string;
  phone?: string;
  address?: string;
  country?: string;
  profile_image?: string;
}

export interface ICompanyInputProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export interface AdminModule {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface AdminApiRole {
  id: string;
  name: AdminRoleName;
}

export interface AdminApiProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  birthdate?: string;
  gender?: string;
  phone?: string;
  address?: string;
  country?: string;
  profile_image?: string;
}

export interface AdminApiCompany {
  id: string;
  company_name: string;
  industry?: string;
  contact_name?: string;
  plan?: string;
  phone?: string;
  address?: string;
  country?: string;
  profile_image?: string;
}

export interface AdminApiUser {
  id: string;
  email: string;
  role: AdminApiRole;
  profile?: AdminApiProfile | null;
  company?: AdminApiCompany | null;
  isActive?: boolean;
  createdAt?: string;
}

export interface AdminCompanyRow {
  user: AdminApiUser;
  company: AdminApiCompany | null;
}

export interface AdminUserRow {
  user: AdminApiUser;
  profile: AdminApiProfile | null;
}

export interface AdminOrderPackageDimensions {
  height: string;
  width: string;
  depth: string;
  unit: string;
}

export interface AdminOrderPackage {
  id: string;
  name: string;
  description: string;
  weight: string;
  dimensions: AdminOrderPackageDimensions;
  fragile: boolean;
  urgent: boolean;
  category: string;
}

export interface AdminApiOrder {
  id: string;
  status: string;
  pickup_direction: string;
  delivery_direction: string;
  distance: string;
  created_at: string;
  userId: string;
  package: AdminOrderPackage;
}

export interface OrderDetailAdminViewProps {
  orderId: string;
  userId: string;
}

export interface AdminOrdersTableProps {
  orders: AdminApiOrder[];
}

export interface OrderDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
  searchParams: Promise<{
    userId?: string;
  }>;
}

export interface AdminMetricCardProps {
  title: string;
  value: number;
  description?: string;
  icon: LucideIcon;
  compact?: boolean;
}

export interface AdminUsersTableProps {
  users: AdminUserRow[];
}

export interface AdminSystemDetailsProps {
  details: DetailItem[];
}

export interface AdminCompaniesTableProps {
  companies: AdminCompanyRow[];
}

export interface AdminDashboardStats {
  totalCompanies: number;
  activeCompanies: number;
  openIncidents: number;
  activePlans: number;
}

export interface AdminWelcomeCardProps {
  adminName: string;
}

export interface AdminManagersTableProps {
  admins: AdminApiUser[];
}

export interface AdminIncident {
  id: string;
  title: string;
  description: string;
  type: 'system' | 'order' | 'user' | 'company' | 'security';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export interface AdminIncidentsTableProps {
  incidents: AdminIncident[];
}

export interface AdminStatItemProps {
  title: string;
  value: number;
  loading: boolean;
}

export interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

export interface ServiceBadgeProps {
  active?: boolean;
  label: string;
}

export interface AdminManagersTableProps {
  admins: AdminApiUser[];
}
