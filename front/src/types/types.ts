export type CountryOption = {
  value: string;
  label: string;
  flag: string;
};

export type OrderFormValues = {
  name: string;
  description: string;
  category_id: string;
  distance: number;
  image: string;
  pickup_direction: string;
  delivery_direction: string;
  weight: string;
  height: string;
  width: string;
  depth: string;
  unit: string;
  fragile: boolean;
  dangerous: boolean;
  cooled: boolean;
  urgent: boolean;
};

export type ModuleItem = {
  title: string;
  description: string;
  icon: React.ElementType;
  href?: string;
};

export type ActiveOrder = {
  id: string;
  trackingCode: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  image?: string;
};

export type ActiveOrdersProps = {
  orders: ActiveOrder[];
};

export type HistoryOrder = {
  id: string;
  tracking_code: string;
  deliveredDate: string;
  destination: string;
  status: string;
};

export type OrderHistoryProps = {
  orders: HistoryOrder[];
};

export type UserProfileCardProps = {
  user: {
    email: string;
    name: string;
    address: string;
    phone: string;
    birthDate: string;
    gender: string;
    country: string;
    image?: string;
  };
};

export type AdminUserRole = 'company' | 'operator' | 'user';

export type AdminRoleName = 'admin' | 'company' | 'operator' | 'user';

export type DetailItem = {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
};

export type Employee = {
  id: string;
  email: string;
  is_active: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
  role?: {
    id: string;
    name: string;
  };
  profile?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    birthdate?: string;
    gender?: string;
    phone?: string;
    address?: string;
    country?: string;
    profile_image?: string;
  };
  company?: null;
  parentCompany?: {
    id: string;
    email?: string;
    is_active?: boolean;
    role?: {
      id: string;
      name: string;
    };
    status?: string;
  };
};
