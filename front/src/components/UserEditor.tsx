'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Swal from 'sweetalert2';

type UserInputFieldProps = {
  label: string;
  value?: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: 'text' | 'select' | 'date';
  options?: {
    label: string;
    value: string;
  }[];
  icon?: ReactNode;
};

function normalizeProfile(profile: any) {
  if (!profile) return null;

  return {
    ...profile,
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
    birthdate: profile.birthdate ? profile.birthdate.split('T')[0] : '',
  };
}

export function UserInputField({ label, value, isEditing, onChange, type = 'text', options = [], icon }: UserInputFieldProps) {
  const maxBirthdate = type === 'date' ? new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0] : undefined;

  return (
    <div className="bg-surface-muted rounded-xl p-4 border border-border transition-all focus-within:border-primary/50">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-sm text-muted">{label}</p>
      </div>

      {isEditing ? (
        type === 'select' ? (
          <select className="w-full border-b border-primary bg-transparent py-1 font-medium text-foreground outline-none animate-in fade-in duration-300" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
            <option value="">Seleccionar</option>

            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input type={type} max={maxBirthdate} className="w-full border-b border-primary bg-transparent py-1 font-medium text-foreground outline-none animate-in fade-in duration-300" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        )
      ) : (
        <p className="text-foreground font-medium">{formatDisplayValue(label, value)}</p>
      )}
    </div>
  );
}

function formatDisplayValue(label: string, value?: string) {
  if (!value) return 'No especificado';

  if (label === 'Género') {
    const genderMap: Record<string, string> = {
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro',
    };

    return genderMap[value] ?? value;
  }

  if (label === 'País') {
    const countryMap: Record<string, string> = {
      AR: 'Argentina',
      BO: 'Bolivia',
      BR: 'Brasil',
      CL: 'Chile',
      CO: 'Colombia',
      CR: 'Costa Rica',
      CU: 'Cuba',
      DO: 'República Dominicana',
      EC: 'Ecuador',
      SV: 'El Salvador',
      GT: 'Guatemala',
      HN: 'Honduras',
      MX: 'México',
      NI: 'Nicaragua',
      PA: 'Panamá',
      PY: 'Paraguay',
      PE: 'Perú',
      UY: 'Uruguay',
      VE: 'Venezuela',
    };

    return countryMap[value] ?? value;
  }

  if (label === 'Fecha de nacimiento') {
    return value.split('T')[0];
  }

  return value;
}

export function useUserEditor(initialProfile: any, userId: string | undefined, onUserUpdated?: (profile: any) => void) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>(normalizeProfile(initialProfile));
  const [original, setOriginal] = useState<any>(normalizeProfile(initialProfile));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialProfile || isEditing) return;

    const normalizedProfile = normalizeProfile(initialProfile);

    setForm(normalizedProfile);
    setOriginal(normalizedProfile);
  }, [initialProfile, isEditing]);

  const updateField = (key: string, value: string) => {
    setForm((prev: any) => ({
      ...(prev ?? {}),
      [key]: value,
    }));
  };

  const reset = () => {
    setForm(original);
    setIsEditing(false);
  };

  const startEditing = () => {
    setForm(original);
    setIsEditing(true);
  };

  const save = async () => {
    if (!userId) {
      Swal.fire('Error', 'No se detectó sesión de usuario.', 'error');
      return;
    }

    if (form?.birthdate) {
      const today = new Date();
      const [year, month, day] = form.birthdate.split('-').map(Number);
      const birthDate = new Date(year, month - 1, day);

      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 18);

      if (birthDate > minDate) {
        Swal.fire('Error', 'Debes ser mayor de 18 años.', 'error');
        return;
      }
    }

    const fullName = form?.name?.trim() || '';
    const [first_name, ...rest] = fullName.split(/\s+/);

    const payload = {
      first_name: first_name || original?.first_name || '',
      last_name: rest.length > 0 ? rest.join(' ') : original?.last_name || '',
      address: form?.address ?? '',
      phone: form?.phone ?? '',
      birthdate: form?.birthdate ?? '',
      gender: form?.gender ?? '',
      country: form?.country ?? '',
    };

    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/user/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let data: any;

      try {
        data = await res.json();
      } catch {
        throw new Error('Respuesta inválida del servidor');
      }

      if (!res.ok) {
        throw new Error(data?.message || 'Error al actualizar');
      }

      const serverProfile = data?.profile ?? data;

      const updatedProfile = normalizeProfile({
        ...original,
        ...payload,
        ...serverProfile,
      });

      setForm(updatedProfile);
      setOriginal(updatedProfile);
      setIsEditing(false);

      onUserUpdated?.(updatedProfile);

      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire('Error', error?.message || 'Ocurrió un error al guardar los cambios.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    isEditing,
    startEditing,
    form,
    updateField,
    reset,
    save,
    loading,
  };
}
