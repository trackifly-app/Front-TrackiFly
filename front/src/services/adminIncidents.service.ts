import { AdminIncident } from '@/interfaces/shipment';

export async function getAdminIncidents(): Promise<AdminIncident[]> {
  /*
    Cuando tengas endpoint real, este service debería quedar parecido a:

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incidents`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener incidencias');
    }

    return response.json();
  */

  return [];
}
