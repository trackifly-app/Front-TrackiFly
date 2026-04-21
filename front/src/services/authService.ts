import Swal from 'sweetalert2';
import { ILoginProps, IRegisterCompanyProps, IRegisterProps, IUserSession } from '@/interfaces/shipment';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

// --- Utilidades Internas ---

// Función para decodificar el token JWT y obtener la información del usuario
function parseJwt(id: string) {
  try {
    const base64Url = id.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Centralizamos los errores con SweetAlert para mostrar alertas visuales
const handleError = (message: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonColor: '#e76f51',
  });
};

// --- Funciones de Autenticación ---

// Envía los datos al backend para crear un nuevo usuario final
export async function registerUser(userData: IRegisterProps) {
  try {
    const response = await fetch(`${APIURL}/auth/signup/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro');
    }

    return data;
  } catch (error: any) {
    throw error;
  }
}

// Envía los datos al backend para registrar una nueva empresa de logística
export async function registerCompany(companyData: IRegisterCompanyProps): Promise<boolean> {
  try {
    const response = await fetch(`${APIURL}/auth/signup/company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyData),
    });
    return response.ok;
  } catch (error: any) {
    handleError(error.message);
    return false;
  }
}

// Registra empleados/operadores (esta acción requiere que el usuario esté autenticado)
export async function registerEmployee(employeeData: any): Promise<boolean> {
  try {
    const stored = localStorage.getItem('userSession');
    const token = stored ? JSON.parse(stored).token : null;
    const response = await fetch(`${APIURL}/auth/register-operator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeeData),
    });
    return response.ok;
  } catch (error: any) {
    handleError(error.message);
    return false;
  }
}
// Borra toda la información de seguridad del almacenamiento local
export const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userSession');
        localStorage.removeItem('userToken');
        localStorage.removeItem('googleToastShown')
        localStorage.clear(); 
    }
};

// Maneja el login: obtiene el token, busca los datos del usuario y guarda la sesión localmente
export async function login(userData: ILoginProps): Promise<IUserSession | null> {
  try {
    // 1. Petición de autenticación
    const response = await fetch(`${APIURL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Credenciales incorrectas');

    // 2. Decodificar el token para obtener el ID
    const decoded = parseJwt(data.token);
    const userId = decoded?.id || decoded?.sub;

    // 3. Obtener el perfil completo del usuario desde la base de datos
    const userResp = await fetch(`${APIURL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${data.token}` },
    });

    if (!userResp.ok) throw new Error('No se pudo obtener el perfil del usuario');
    
    const fullUser = await userResp.json();
    console.log("¿Qué trae el servidor?", fullUser);


    // --- LOG PARA DEPURACIÓN (Míralo en la consola del navegador) ---
    console.log("Respuesta completa del servidor:", fullUser);

    // 4. Construcción del objeto de sesión (Mapeo de datos)
    // Usamos el operador || para caer en cascada: raíz > profile > valor por defecto
    const session: IUserSession = {
      token: data.token,
      user: {
        id: fullUser.id || userId,
        email: fullUser.email || '',
        first_name: fullUser.first_name || fullUser.profile?.first_name || 'Usuario',
        last_name: fullUser.last_name || fullUser.profile?.last_name || '',
        role: fullUser.role?.name || fullUser.role || 'user',
        address: fullUser.address || fullUser.profile?.address || '',
        phone: fullUser.phone || fullUser.profile?.phone || '',
        birthdate: fullUser.birthdate || fullUser.profile?.birthdate || '',
        gender: fullUser.gender || fullUser.profile?.gender || '',
        country: fullUser.country || fullUser.profile?.country || '',
      },
    };

    // 5. Guardado en almacenamiento local
    // Limpiamos antes para asegurar que no quede rastro de sesiones anteriores
    localStorage.removeItem('userSession');
    localStorage.removeItem('userToken');
    
    localStorage.setItem('userSession', JSON.stringify(session));
    localStorage.setItem('userToken', data.token);

    return session;
  } catch (error: any) {
    // Usamos el helper de SweetAlert que ya tienes definido
    handleError(error.message || 'Error inesperado al iniciar sesión');
    return null;
  }
}