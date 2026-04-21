const API_URL = process.env.NEXT_PUBLIC_API_URL; // Guarda la URL base del backend desde las variables de entorno

export const getUserOrders = async () => { // Función que pide al backend las órdenes del usuario autenticado
  const session = localStorage.getItem("userSession"); // Busca la sesión guardada en el navegador

  if (!session) throw new Error("No hay sesiÃ³n"); // Si no existe sesión, detiene el flujo con error

  const parsed = JSON.parse(session); // Convierte la sesión de texto a objeto
  const token = parsed.token; // Extrae el token necesario para autenticarse con el backend

  const res = await fetch(`${API_URL}/orders`, { // Hace la petición al endpoint de órdenes
    headers: { // Define los headers de la petición
      Authorization: `Bearer ${token}`, // Envía el token como credencial Bearer
    },
    cache: "no-store", // Evita que Next o el navegador reutilicen una respuesta en caché
  });

  if (!res.ok) { // Verifica si la respuesta del backend falló
    throw new Error(`Error al obtener Ã³rdenes: ${res.status}`); // Lanza error con el código HTTP
  }

  return res.json(); // Devuelve las órdenes convertidas desde JSON
};
