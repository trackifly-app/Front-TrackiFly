'use client';

import { useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Camera, Edit2 } from 'lucide-react';
import { useUserEditor, UserInputField } from '../UserEditor';

export default function UserProfileCard() {
  const { userData, setUserData } = useAuth();
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const profile = userData?.user?.profile;
  const userId = userData?.user?.id;

  const { isEditing, startEditing, form, updateField, reset, save, loading } = useUserEditor(profile, userId, (updatedProfile) => {
    if (!userData) return;

    const { name, ...profileWithoutAuxFields } = updatedProfile;

    setUserData({
      ...userData,
      user: {
        ...userData.user,
        profile: {
          ...userData.user.profile,
          ...profileWithoutAuxFields,
        },
      },
    });
  });

  const handleImageClick = () => {
    if (uploadingImage) return;
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !userId || !userData) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      alert('Solo puedes subir imágenes PNG, JPG, JPEG o WEBP');
      event.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setUserData({
      ...userData,
      user: {
        ...userData.user,
        profile: {
          ...userData.user.profile,
          profile_image: previewUrl,
        },
      },
    });

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/user/${userId}/image`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      let data: any;

      try {
        data = await res.json();
      } catch {
        throw new Error('Respuesta inválida del servidor');
      }

      if (!res.ok) {
        throw new Error(data?.message || 'Error al actualizar la imagen');
      }

      const updatedProfile = data?.profile ?? data?.user?.profile ?? data;
      const newImageUrl = updatedProfile?.profile_image;

      setUserData({
        ...userData,
        user: {
          ...userData.user,
          profile: {
            ...userData.user.profile,
            profile_image: newImageUrl ? `${newImageUrl}?t=${Date.now()}` : previewUrl,
          },
        },
      });
    } catch (error: any) {
      console.error(error);
      alert(error?.message || 'Ocurrió un error al subir la imagen');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  if (!userData) {
    return <p className="text-center py-10">Cargando perfil...</p>;
  }

  const displayData = form ?? profile;

  return (
    <section className="bg-surface rounded-3xl shadow-sm border border-border p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button type="button" onClick={handleImageClick} disabled={uploadingImage} className="group relative w-20 h-20 rounded-full overflow-hidden border border-border bg-surface-muted shrink-0 disabled:cursor-not-allowed disabled:opacity-70" aria-label="Cambiar foto de perfil">
            <img src={profile?.profile_image || '/default-avatar.png'} alt="Foto de perfil" className="w-full h-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-75" />

            <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition duration-300 group-hover:opacity-100">{uploadingImage ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Camera size={22} className="text-white" />}</div>
          </button>

          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={handleImageChange} />

          <div>
            <h2 className="text-2xl font-bold text-foreground">Mis datos</h2>
            <p className="text-sm text-muted">Información personal del usuario</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isEditing) reset();
            else startEditing();
          }}
          className="p-2 text-primary hover:opacity-80"
          type="button"
          aria-label={isEditing ? 'Cancelar edición' : 'Editar información'}
        >
          <Edit2 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Email" value={userData.user.email} />

        <UserInputField label="Nombre" value={displayData?.name} isEditing={isEditing} onChange={(value) => updateField('name', value)} />

        <UserInputField label="Dirección" value={displayData?.address} isEditing={isEditing} onChange={(value) => updateField('address', value)} />

        <UserInputField label="Teléfono" value={displayData?.phone} isEditing={isEditing} onChange={(value) => updateField('phone', value)} />

        <UserInputField label="Fecha de nacimiento" value={displayData?.birthdate} type="date" isEditing={isEditing} onChange={(value) => updateField('birthdate', value)} />

        <UserInputField
          label="Género"
          value={displayData?.gender}
          type="select"
          isEditing={isEditing}
          onChange={(value) => updateField('gender', value)}
          options={[
            { label: 'Masculino', value: 'male' },
            { label: 'Femenino', value: 'female' },
            { label: 'Otro', value: 'other' },
          ]}
        />

        <div className="md:col-span-2">
          <UserInputField
            label="País"
            value={displayData?.country}
            type="select"
            isEditing={isEditing}
            onChange={(value) => updateField('country', value)}
            options={[
              { label: 'Argentina', value: 'AR' },
              { label: 'Bolivia', value: 'BO' },
              { label: 'Brasil', value: 'BR' },
              { label: 'Chile', value: 'CL' },
              { label: 'Colombia', value: 'CO' },
              { label: 'Costa Rica', value: 'CR' },
              { label: 'Cuba', value: 'CU' },
              { label: 'República Dominicana', value: 'DO' },
              { label: 'Ecuador', value: 'EC' },
              { label: 'El Salvador', value: 'SV' },
              { label: 'Guatemala', value: 'GT' },
              { label: 'Honduras', value: 'HN' },
              { label: 'México', value: 'MX' },
              { label: 'Nicaragua', value: 'NI' },
              { label: 'Panamá', value: 'PA' },
              { label: 'Paraguay', value: 'PY' },
              { label: 'Perú', value: 'PE' },
              { label: 'Uruguay', value: 'UY' },
              { label: 'Venezuela', value: 'VE' },
            ]}
          />
        </div>
      </div>

      {isEditing && (
        <div className="mt-8 flex justify-end gap-3">
          <button onClick={reset} type="button" className="rounded-xl border border-border px-6 py-2 transition-all hover:bg-surface-muted">
            Cancelar
          </button>

          <button onClick={save} type="button" disabled={loading} className="rounded-xl bg-primary px-6 py-2 text-white transition-all shadow-md shadow-primary/20 hover:opacity-90 disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      )}
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
