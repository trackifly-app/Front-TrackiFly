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
 * Obtiene los pedidos de la cuenta empresa y de todos sus empleados.
 */
export async function getOrdersByCompanyEmployees(companyId: string): Promise<CompanyApiOrder[]> {
  try {
    // Traemos también los pedidos creados por la propia cuenta empresa.
    const companyOrdersPromise = getOrdersByCompanyUserId(companyId).catch(() => []);

    // Obtenemos todos los empleados/usuarios disponibles.
    const employees = await getCompanyEmployees();

    if (!employees || employees.length === 0) {
      return await companyOrdersPromise;
    }

    // Filtramos solo los operadores que pertenezcan a la empresa indicada.
    const operators = employees.filter((emp) => {
      const roleName = emp.role?.name?.toLowerCase?.() || '';
      const belongsToCompany = emp.parentCompany?.id === companyId;

      return roleName === 'operator' && belongsToCompany;
    });

    if (operators.length === 0) {
      return await companyOrdersPromise;
    }

    // Consultamos los pedidos de los empleados en paralelo.
    const employeeOrdersPromise = Promise.all(
      operators.map((op) => getOrdersByCompanyUserId(op.id).catch(() => [])),
    );

    const [companyOrders, employeeOrders] = await Promise.all([
      companyOrdersPromise,
      employeeOrdersPromise,
    ]);

    return [...companyOrders, ...employeeOrders.flat()];
  } catch (error) {
    console.error('Error al unificar pedidos:', error);
    return [];
  }
}
