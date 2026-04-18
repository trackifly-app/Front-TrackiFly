import { ModuleItem } from '@/types/types';

// --- ENVÍOS Y CALCULADORA ---

export interface ShipmentValues {
  // Agregué campos que estaban en Errors pero faltaban aquí
  name: string;
  category_id: string;
  description: string;
  image: string;
  // ---
  pickup_direction: string;
  delivery_direction: string;
  height: number;
  width: number;
  depth: number;
  weight: number;
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
  token: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    role: string;
    address: string;
    phone: string;
    email: string;
    name?: string;
  };
}

export interface IAuthContextProps {
  userData: IUserSession | null;
  setUserData: (values: IUserSession | null) => void;
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
  gender?: string;
  birthdate?: string;
  country: string;
}

export interface IRegisterErrors {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  phone?: string;
  gender?: string;
  birthdate?: string;
  country?: string;
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
  plan: string;
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
  modules: ModuleItem[];
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
  seedOnBootstrap: boolean;
  allowSelfSignUp: boolean;
  requiresApproval: boolean;
}
