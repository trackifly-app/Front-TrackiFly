const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserOrders = async () => {
  const res = await fetch(`${API_URL}/orders`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Error al obtener órdenes: ${res.status}`);
  }

  return res.json();
};
