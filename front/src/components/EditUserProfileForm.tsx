'use client';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function EditUserProfileForm() {
  const { userData } = useAuth();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    birthdate: '',
    gender: '',
    country: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      const profile = userData.user.profile;

      setForm({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        birthdate: profile?.birthdate || '',
        gender: profile?.gender || '',
        country: profile?.country || '',
      });
    }
  }, [userData]);

  if (!userData) {
    return <p className="text-center py-10">Cargando...</p>;
  }

  const profile = userData.user.profile;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = userData.user.id;

      const res = await fetch(`${APIURL}/profiles/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('ERROR BACKEND:', data);
        throw new Error(data.message || 'Error al actualizar');
      }

      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-3xl border border-border p-6 space-y-4">
      <h2 className="text-xl font-bold">Editar perfil</h2>

      <Input label="Nombre" name="first_name" value={form.first_name} onChange={handleChange} />
      <Input label="Apellido" name="last_name" value={form.last_name} onChange={handleChange} />
      <Input label="Teléfono" name="phone" value={form.phone} onChange={handleChange} />
      <Input label="Dirección" name="address" value={form.address} onChange={handleChange} />

      <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded-xl w-full">
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
}

function Input({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <label className="text-sm text-muted">{label}</label>
      <input type="text" name={name} value={value} onChange={onChange} className="w-full mt-1 p-2 border border-border rounded-lg bg-background" />
    </div>
  );
}
