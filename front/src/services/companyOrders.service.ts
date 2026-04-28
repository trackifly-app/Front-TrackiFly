import { CompanyApiOrder } from '@/interfaces/shipment';
import { getCompanyEmployees } from '@/services/companyEmployees.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtiene los pedidos vinculados a un ID de usuario específico.
 */
export async function getOrdersByCompanyUserId(userId: string): Promise<CompanyApiOrder[]> {
  const response = await fetch(`${API_URL}/orders?userId=${userId}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener las órdenes del usuario');
  }

  return Array.isArray(data) ? data : [];
}

/**
 * Lógica "Fan-out": Obtiene los empleados de la empresa y 
 * luego consulta los pedidos de cada uno en paralelo.
 */
export async function getOrdersByCompanyEmployees(): Promise<CompanyApiOrder[]> {
  try {
    // 1. Llamada sin argumentos (según tu definición del servicio)
    const employees = await getCompanyEmployees();

    if (!employees || employees.length === 0) return [];

    // 2. Opcional: Filtrar solo por el rol 'operator' si el backend devuelve otros roles
    const operators = employees.filter(emp => emp.role?.name === 'operator');

    // 3. Consultar pedidos en paralelo
    const ordersPromises = operators.map((op) => 
      getOrdersByCompanyUserId(op.id).catch(() => [])
    );

    const results = await Promise.all(ordersPromises);
    return results.flat();
    
  } catch (error) {
    console.error('Error al unificar pedidos:', error);
    return [];
  }
}