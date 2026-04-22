import Swal from 'sweetalert2';
import { ILoginProps, IRegisterCompanyProps, IRegisterProps, IUserSession, ILoginCompany } from '@/interfaces/shipment';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

// --- Utilidades Internas ---


const handleError = (message: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonColor: '#e76f51',
  });
};

// --- Funciones de Registro ---

export async function registerUser(userData: IRegisterProps) {
  try {
    const response = await fetch(`${APIURL}/auth/signup/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error en el registro');
    return data;
  } catch (error: any) {
    handleError(error.message);
    throw error;
  }
}

// ESTA ES LA FUNCIÓN QUE FALTABA
export async function registerCompany(companyData: IRegisterCompanyProps): Promise<boolean> {
  try {
    const response = await fetch(`${APIURL}/auth/signup/company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyData),
      credentials: 'include',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar la empresa');
    }

    Swal.fire({
      icon: 'success',
      title: 'Registro exitoso',
      text: 'La empresa ha sido registrada correctamente.',
    });

    return true;
  } catch (error: any) {
    handleError(error.message);
    return false;
  }
}

export async function registerEmployee(employeeData: any): Promise<boolean> {
  try {
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

// --- Funciones de Login ---

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
