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
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(employeeData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error al registrar empleado:', data);
      throw new Error(
        Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Error al registrar empleado'
      );
    }

    Swal.fire({
      icon: 'success',
      title: 'Empleado registrado',
      text: 'El empleado ha sido registrado correctamente.',
      confirmButtonColor: '#2a9d8f',
    });

    return true;
  } catch (error: unknown) {
    handleError(error instanceof Error ? error.message : 'Error en el registro');
    return false;
  }
}

// --- Funciones de Login ---

/**
 * Inicia sesión mediante el Proxy de Next.js.
 * @param userData - Objeto con email y password.
 * @returns - Promesa con el objeto IUserSession o null si falla.
 */
export async function login(userData: ILoginProps): Promise<IUserSession | null> {
  try {
    // Es fundamental usar la URL que apunta a tu Proxy (/api/proxy/...)
    const response = await fetch(`${APIURL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      // credentials: 'include' permite que el navegador capture el Set-Cookie
      // enviado por el Proxy y lo guarde automáticamente.
      credentials: 'include',
    });

    // Verificamos si la respuesta tiene contenido antes de parsear JSON
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Si no es JSON (como el error 405 que vimos), leemos el texto para debuguear
      const errorText = await response.text();
      console.error('Error del servidor (no JSON):', errorText);
      throw new Error('El servidor no respondió en el formato esperado.');
    }

    if (!response.ok) {
      // Capturamos el mensaje de error del backend (ej: "Usuario no encontrado")
      throw new Error(data?.message || 'Error en las credenciales');
    }

    // Log para verificar que el login devolvió los datos correctamente
    console.log('Login exitoso. Datos recibidos:', data);

    // Save user role to localStorage for immediate availability
    if (data?.user?.role?.name) {
      localStorage.setItem('userRole', data.user.role.name);
    }

    return data;
  } catch (error: any) {
    console.error('Error en el servicio de login:', error.message);

    // Si tienes una función para mostrar notificaciones (Toast/SweetAlert)
    if (typeof handleError === 'function') {
      handleError(error.message || 'Error al iniciar sesión');
    }

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
