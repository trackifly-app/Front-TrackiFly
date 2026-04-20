const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserOrders = async () => {
  const session = localStorage.getItem("userSession");

  if (!session) throw new Error("No hay sesión");

  const parsed = JSON.parse(session);
  const token = parsed.token;

  const res = await fetch(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Error al obtener órdenes: ${res.status}`);
  }

  return res.json();
};