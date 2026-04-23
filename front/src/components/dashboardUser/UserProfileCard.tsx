'use client';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import UserEditor from '../UserEditor';
import { IUpdateProfilePayload } from '@/interfaces/shipment';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function UserProfileCard() {
  const { userData, setUserData } = useAuth();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  if (!userData) {
    return <p className="text-center py-10">Cargando perfil...</p>;
  }

  const profile = userData.user.profile;
  const userId = userData.user.id;

  const handleEdit = (field: string, currentValue?: string) => {
    if (field === 'birthdate' && currentValue) {
      currentValue = currentValue.split('T')[0];
    }

    setEditingField(field);
    setTempValue(currentValue || '');
  };

  const handleSave = async (field: string) => {
    if (!userData) return;

    if (field === 'birthdate') {
      const today = new Date();
      const [year, month, day] = tempValue.split('-').map(Number);

      const birthDate = new Date(year, month - 1, day);

      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 18);

      if (birthDate > minDate) {
        alert('Debes ser mayor de 18 años');
        return;
      }
    }

    const payload: IUpdateProfilePayload = {};

    if (field === 'name') {
      const [first_name, ...rest] = tempValue.split(' ');
      payload.first_name = first_name;
      payload.last_name = rest.join(' ');
    } else {
      payload[field as keyof IUpdateProfilePayload] = tempValue;
    }

    const updatedLocalUser = {
      ...userData,
      user: {
        ...userData.user,
        profile: userData.user.profile
          ? {
              ...userData.user.profile,
              ...payload,
            }
          : userData.user.profile,
      },
    };

    setUserData(updatedLocalUser);
    setEditingField(null);
    setTempValue('');

    try {
      await fetch(`${APIURL}/profiles/user/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(error);
      setUserData(userData);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  return (
    <section className="bg-surface rounded-3xl shadow-sm border border-border p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-border bg-surface-muted shrink-0">
          <img src={profile?.profile_image || '/default-avatar.png'} alt="Foto de perfil" className="w-full h-full object-cover" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground">Mis datos</h2>
          <p className="text-sm text-muted">Información personal del usuario</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Email" value={userData.user.email} />

        <UserEditor label="Nombre" field="name" value={`${profile?.first_name || ''} ${profile?.last_name || ''}`} editingField={editingField} tempValue={tempValue} setTempValue={setTempValue} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} />

        <UserEditor label="Dirección" field="address" value={profile?.address} editingField={editingField} tempValue={tempValue} setTempValue={setTempValue} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} />

        <UserEditor label="Teléfono" field="phone" value={profile?.phone} editingField={editingField} tempValue={tempValue} setTempValue={setTempValue} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} />

        <UserEditor label="Fecha de nacimiento" field="birthdate" value={profile?.birthdate} type="date" editingField={editingField} tempValue={tempValue} setTempValue={setTempValue} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} />

        <UserEditor label="Género" field="gender" value={profile?.gender} type="select" editingField={editingField} tempValue={tempValue} setTempValue={setTempValue} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} />

        <div className="bg-surface-muted rounded-xl p-4 border border-border md:col-span-2">
          <p className="text-sm text-muted">País</p>
          <p className="text-foreground font-medium">{profile?.country || 'No especificado'}</p>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="bg-surface-muted rounded-xl p-4 border border-border">
      <p className="text-sm text-muted">{label}</p>
      <p className="text-foreground font-medium">{value || 'No especificado'}</p>
    </div>
  );
}
