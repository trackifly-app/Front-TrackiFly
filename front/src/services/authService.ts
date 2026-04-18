import Swal from 'sweetalert2';
import { ILoginProps, IRegisterCompanyProps, IRegisterProps, IUserSession } from '@/interfaces/shipment';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

// --- Utilidades Internas ---

// Función para decodificar el token JWT y obtener la información del usuario
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
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
        confirmButtonColor: '#e76f51' 
    });
};

// --- Funciones de Autenticación ---

// Envía los datos al backend para crear un nuevo usuario final
export async function registerUser(userData: IRegisterProps): Promise<boolean> {
    try {
        const payload = { ...userData, name: `${userData.first_name} ${userData.last_name}`.trim() };
        const response = await fetch(`${APIURL}/auth/signup/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return response.ok;
    } catch (error: any) {
        handleError(error.message);
        return false;
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
                Authorization: `Bearer ${token}` 
            },
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
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        // Decodificamos el token para saber el ID del usuario y pedir su perfil completo
        const decoded = parseJwt(data.token);
        const userResp = await fetch(`${APIURL}/users/${decoded.id || decoded.sub}`, {
            headers: { 'Authorization': `Bearer ${data.token}` }
        });
        
        const fullUser = await userResp.json();

        // Armamos el objeto de sesión que usará toda la app
        const session: IUserSession = {
            token: data.token,
            user: {
                id: fullUser.id,
                email: fullUser.email,
                first_name: fullUser.profile?.first_name || fullUser.name || "Usuario",
                last_name: fullUser.profile?.last_name || "",
                role: fullUser.role?.name || "user",
                address: fullUser.address || "",
                phone: fullUser.phone || "",
            }
        };

        // Persistencia de datos en el navegador
        localStorage.setItem("userSession", JSON.stringify(session));
        localStorage.setItem("userToken", data.token);

        return session;
    } catch (error: any) {
        handleError(error.message || "Error al iniciar sesión");
        return null;
    }
}

// Borra toda la información de seguridad del almacenamiento local
export const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userSession');
        localStorage.removeItem('userToken');
        localStorage.clear(); 
    }
};