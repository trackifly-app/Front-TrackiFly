export interface ILoginProps {
  email: string;
  password: string;
}

export interface IRegisterProps {
  email: string;
  password: string;
  name: string;
  address: string;
  phone: string;
  gender: string;
  birthdate: string;
  country: string;
}

export interface ILoginErrors {
  email?: string;
  password?: string;
}

export interface IRegisterErrors {
  email?: string;
  password?: string;
  name?: string;
  address?: string;
  phone?: string;
  gender?: string;
  birthdate?: string;
  country?: string;
}

export type CountryOption = {
  value: string;
  label: string;
  flag: string;
};

export interface ICountryProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export type OrderFormValues = {
  name: string;
  description: string;
  category_id: string;
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
}