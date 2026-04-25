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
  trackingCode: string;
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
  action: string;
};
