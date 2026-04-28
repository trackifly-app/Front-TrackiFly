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

//chakout-_url/nombre del backend paymentUrl/nombre front
export type CreateOrderResponse = {
  checkout_url: string;      // lo que devuelve el back
  preference_id: string;
  order_id: string;
  original_amount: number;
  final_amount: number;
  discount_applied: string | null;
  paymentUrl?: string;       // alias para compatibilidad con orderView
  paymentError?: string;
};