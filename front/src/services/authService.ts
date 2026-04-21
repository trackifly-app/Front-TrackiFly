import Swal from 'sweetalert2';
import { ILoginProps, IRegisterCompanyProps, IRegisterProps, IUserSession } from '@/interfaces/shipment';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

// --- Utilidades Internas ---


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
      credentials: 'include',
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
      credentials: 'include',
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
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify(employeeData),
    });
    return response.ok;
  } catch (error: any) {
    handleError(error.message);
    return false;
  }
}

// Maneja el login: obtiene el token, busca los datos del usuario y guarda la sesión localmente
export async function login(userData: ILoginProps): Promise<IUserSession | null> {
  try {
    const response = await fetch(`${APIURL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data;
  } catch (error: any) {
    handleError(error.message || 'Error al iniciar sesión');
    return null;
  }
}

// Borra toda la información de seguridad del almacenamiento local
export const logout = async () => {
    await fetch(`${APIURL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
};
