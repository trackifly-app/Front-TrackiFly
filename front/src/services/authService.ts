import Swal from 'sweetalert2';
import { ILoginProps, IRegisterCompanyProps, IRegisterProps, IUserSession, ILoginCompany } from '@/interfaces/shipment';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

// --- Utilidades Internas ---

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

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

// --- Funciones de Login ---

export async function login(userData: ILoginProps): Promise<IUserSession | null> {
  try {
    const response = await fetch(`${APIURL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    const decoded = parseJwt(data.token);
    const userResp = await fetch(`${APIURL}/users/${decoded.id || decoded.sub}`, {
      headers: { Authorization: `Bearer ${data.token}` },
    });

    const fullUser = await userResp.json();

    const session: IUserSession = {
      token: data.token,
      user: {
        id: fullUser.id,
        email: fullUser.email,
        first_name: fullUser.profile?.first_name || fullUser.name || 'Usuario',
        last_name: fullUser.profile?.last_name || '',
        role: fullUser.role?.name || 'user',
        address: fullUser.address || '',
        phone: fullUser.phone || '',
      },
    };

    localStorage.setItem('userSession', JSON.stringify(session));
    return session;
  } catch (error: any) {
    handleError(error.message || 'Error al iniciar sesión');
    return null;
  }
}

export async function loginCompany(companyData: ILoginCompany): Promise<ILoginCompany | null> {
  try {
    const response = await fetch(`${APIURL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    const decoded = parseJwt(data.token);
    const userResp = await fetch(`${APIURL}/users/${decoded.id || decoded.sub}`, {
      headers: { Authorization: `Bearer ${data.token}` },
    });

    const fullCompany = await userResp.json();

    const company: ILoginCompany = {
      token: data.token,
      role: {
        id: fullCompany.id,
        email: fullCompany.email,
        name: fullCompany.name,
      },
      company: {
        company_name: fullCompany.company?.company_name || '',
        industry: fullCompany.company?.industry || '',
        contact_name: fullCompany.company?.contact_name || '',
        address: fullCompany.company?.address || '',
        phone: fullCompany.company?.phone || '',
        plan: fullCompany?.company?.plan || '',
        country: fullCompany?.company?.country || '',
      },
    };

    // Usamos 'companySession' para que el AuthContext lo detecte por separado
    localStorage.setItem('companySession', JSON.stringify(company));
    return company;
  } catch (error: any) {
    handleError(error.message || 'Error al iniciar sesión');
    return null;
  }
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
};