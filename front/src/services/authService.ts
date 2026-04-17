import Swal from 'sweetalert2';
import { ILoginProps, IRegisterProps } from '@/types/types';
import { IRegisterCompanyProps } from '@/interfaces/shipment';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

/*
  Registro de Usuario (Individual) y Endpoint: POST /auth/signup/user
 */
export async function registerUser(userData: IRegisterProps) {
  try {
    const response = await fetch(`${APIURL}/auth/signup/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.token) localStorage.setItem('userToken', data.token);

      await Swal.fire({
        title: '¡Bienvenido!',
        text: 'Tu cuenta de usuario en TrackiFly ha sido creada.',
        icon: 'success',
        confirmButtonColor: '#e76f51',
      });
      return true;
    } else {
      throw new Error(data.message || 'Error en el registro de usuario');
    }
  } catch (error: any) {
    handleError(error.message);
    return false;
  }
}

/*
  Registro de Empresa
  Endpoint: POST /auth/signup/company
 */
export async function registerCompany(companyData: IRegisterCompanyProps) {
  try {
    const response = await fetch(`${APIURL}/auth/signup/company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyData),
    });

    const data = await response.json();

    if (response.ok) {
      await Swal.fire({
        title: 'Registro de Empresa',
        text: 'La empresa se ha registrado correctamente.',
        icon: 'success',
        confirmButtonColor: '#e76f51',
      });
      return true;
    } else {
      throw new Error(data.message || 'Error al registrar la empresa');
    }
  } catch (error: any) {
    handleError(error.message);
    return false;
  }
}

/*
  Registro de Empleado (Operator)
  Endpoint: POST /auth/register-operator
  Requiere token (empresa autenticada)
*/
export async function registerEmployee(employeeData: any) {
  try {
    const token = localStorage.getItem('userToken');

    const response = await fetch(`${APIURL}/auth/register-operator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeeData),
    });

    const data = await response.json();

    if (response.ok) {
      await Swal.fire({
        title: 'Registro de Empleado',
        text: 'El empleado ha sido registrado correctamente.',
        icon: 'success',
        confirmButtonColor: '#e76f51',
      });
      return true;
    } else {
      throw new Error(data.message || 'Error al registrar el empleado');
    }
  } catch (error: any) {
    handleError(error.message);
    return false;
  }
}

/*  
 Inicio de Sesión y Endpoint: POST /auth/signin 
 */

export async function login(credentials: ILoginProps) {
  try {
    const response = await fetch(`${APIURL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: 'success',
        title: `Bienvenido, ${data.user.name || 'a TrackiFly'}`,
      });

      return data;
    } else {
      throw new Error(data.message || 'Credenciales inválidas');
    }
  } catch (error: any) {
    handleError(error.message);
    return null;
  }
}

/*
  Manejador de errores centralizado
 */
const handleError = (message: string) => {
  Swal.fire({
    title: 'Ups...',
    text: message,
    icon: 'error',
    confirmButtonColor: '#e76f51',
  });
};
