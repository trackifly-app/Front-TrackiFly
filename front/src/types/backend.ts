export type BackendUser = {
  id: string;
  email: string;
  phone: string;
  address: string;
  country: string;
};

export type BackendOrder = {
  id: number;
  product: string;
  quantity: number;
  status: string; //en string por ahora
  user: BackendUser;
};