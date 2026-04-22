import Swal from 'sweetalert2';
import {
  ILoginProps,
  IRegisterCompanyProps,
  IRegisterProps,
  IUserSession,
} from '@/interfaces/shipment';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

// Centralizamos los errores con SweetAlert para mostrar alertas visuales.
const handleError = (message: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonColor: '#e76f51',
  });
};

// Envia los datos al backend para crear un nuevo usuario final.
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
  } catch (error: unknown) {
    throw error;
  }
}

// Envia los datos al backend para registrar una nueva empresa de logistica.
export async function registerCompany(
  companyData: IRegisterCompanyProps,
): Promise<boolean> {
  try {
    const response = await fetch(`${APIURL}/auth/signup/company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyData),
      credentials: 'include',
    });
    return response.ok;
  } catch (error: unknown) {
    handleError(error instanceof Error ? error.message : 'Error en el registro');
    return false;
  }
}

// Registra empleados/operadores. Requiere una sesion activa por cookies.
export async function registerEmployee(employeeData: unknown): Promise<boolean> {
  try {
    const response = await fetch(`${APIURL}/auth/register-operator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(employeeData),
    });
    return response.ok;
  } catch (error: unknown) {
    handleError(error instanceof Error ? error.message : 'Error en el registro');
    return false;
  }
}

// Maneja el login con cookies HTTP-only.
export async function login(
  userData: ILoginProps,
): Promise<IUserSession | null> {
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
  } catch (error: unknown) {
    handleError(
      error instanceof Error ? error.message : 'Error al iniciar sesion',
    );
    return null;
  }
}

// Cierra la sesion actual en el backend usando cookies.
export const logout = async () => {
  await fetch(`${APIURL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
};
