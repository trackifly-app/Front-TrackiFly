const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al iniciar sesión');
  }

  return res.json(); 
};
