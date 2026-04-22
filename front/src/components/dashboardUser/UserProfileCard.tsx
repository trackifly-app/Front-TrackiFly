"use client"
import { useAuth } from "@/context/AuthContext";
import { UserProfileCardProps } from "@/types/types";


export default function UserProfileCard({ user }: UserProfileCardProps) {
  const {userData} = useAuth();
  return (
    <div>
      <section className="bg-surface rounded-3xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-border bg-surface-muted shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user.image || 'https://via.placeholder.com/150'} alt="Foto de perfil" className="w-full h-full object-cover" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Mis datos</h2>
            <p className="text-sm text-muted">Información personal del usuario</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-muted rounded-xl p-4 border border-border">
            <p className="text-sm text-muted">Email</p>
            <p className="text-foreground font-medium wrap-break-words">{userData?.user.email}</p>
          </div>

          <div className="bg-surface-muted rounded-xl p-4 border border-border">
            <p className="text-sm text-muted">Nombre</p>
            <p className="text-foreground font-medium">{userData?.user.profile.first_name} {userData?.user.profile.last_name}</p>
          </div>

          <div className="bg-surface-muted rounded-xl p-4 border border-border">
            <p className="text-sm text-muted">Dirección</p>
            <p className="text-foreground font-medium">{userData?.user.profile.address}</p>
          </div>

          <div className="bg-surface-muted rounded-xl p-4 border border-border">
            <p className="text-sm text-muted">Teléfono</p>
            <p className="text-foreground font-medium">{userData?.user.profile.phone}</p>
          </div>

          <div className="bg-surface-muted rounded-xl p-4 border border-border">
            <p className="text-sm text-muted">Fecha de nacimiento</p>
            <p className="text-foreground font-medium">{userData?.user.profile.birthdate}</p>
          </div>

          <div className="bg-surface-muted rounded-xl p-4 border border-border">
            <p className="text-sm text-muted">Género</p>
            <p className="text-foreground font-medium">{userData?.user.profile.gender}</p>
          </div>

          <div className="bg-surface-muted rounded-xl p-4 border border-border md:col-span-2">
            <p className="text-sm text-muted">País</p>
            <p className="text-foreground font-medium">{userData?.user.profile.country}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
