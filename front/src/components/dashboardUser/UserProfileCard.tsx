'use client';
import { useAuth } from '@/context/AuthContext';

export default function UserProfileCard() {
  const { userData } = useAuth();

  if (!userData) {
    return <p className="text-center py-10">Cargando perfil...</p>;
  }

  const profile = userData.user.profile;

  return (
    <div>
      <section className="bg-surface rounded-3xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-border bg-surface-muted shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile?.profile_image || '/default-avatar.png'} alt="Foto de perfil" className="w-full h-full object-cover" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Mis datos</h2>
            <p className="text-sm text-muted">Información personal del usuario</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Email" value={userData.user.email} />

          <Field label="Nombre" value={`${profile?.first_name || ''} ${profile?.last_name || ''}`} />

          <Field label="Dirección" value={profile?.address} />

          <Field label="Teléfono" value={profile?.phone} />

          <Field label="Fecha de nacimiento" value={profile?.birthdate} />

          <Field label="Género" value={profile?.gender} />

          <div className="bg-surface-muted rounded-xl p-4 border border-border md:col-span-2">
            <p className="text-sm text-muted">País</p>
            <p className="text-foreground font-medium">{profile?.country || 'No especificado'}</p>
          </div>
        </div>
      </section>
    </div>
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
