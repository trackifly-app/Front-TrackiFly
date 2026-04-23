import { useState } from 'react';
import Swal from 'sweetalert2';
import { ICompanyInputProps } from '@/interfaces/shipment';

export function CompanyInputField({ label, icon, value, isEditing, onChange }: ICompanyInputProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface-muted p-4 transition-all focus-within:border-primary/50">
      <div className="mb-1 flex items-center gap-2 text-sm text-muted">
        {icon}
        <span>{label}</span>
      </div>

      {isEditing ? (
        <input
          type="text"
          className="w-full border-b border-primary bg-transparent py-1 font-medium text-foreground outline-none animate-in fade-in duration-300"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p className="truncate font-semibold text-foreground">{value || 'No especificado'}</p>
      )}
    </div>
  );
}

export function CompanyEditor(
  initialCompany: any,
  userId: string | undefined,
  onCompanyUpdated?: (company: any) => void
) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>(initialCompany ?? null);
  const [original, setOriginal] = useState<any>(initialCompany ?? null);
  const [loading, setLoading] = useState(false);

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

    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
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

      const serverCompany = data?.company ?? data;

      const updatedCompany = {
        ...original,
        ...form,
        ...serverCompany,
      };

      setForm(updatedCompany);
      setOriginal(updatedCompany);
      setIsEditing(false);

      onCompanyUpdated?.(updatedCompany);

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
    setIsEditing,
    startEditing,
    form,
    updateField,
    reset,
    save,
    loading,
  };
}