type UserProfileCardProps = {
  user: {
    email: string;
    name: string;
    address: string;
    phone: string;
    birthDate: string;
    gender: string;
    country: string;
    image?: string;
  };
};

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div>
      <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user.image || 'https://via.placeholder.com/150'} alt="Foto de perfil" className="w-full h-full object-cover" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mis datos</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Información personal del usuario</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-slate-950 rounded-xl p-4 border border-gray-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
            <p className="text-slate-800 dark:text-white font-medium wrap-break-words">{user.email}</p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-950 rounded-xl p-4 border border-gray-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Nombre</p>
            <p className="text-slate-800 dark:text-white font-medium">{user.name}</p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-950 rounded-xl p-4 border border-gray-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Dirección</p>
            <p className="text-slate-800 dark:text-white font-medium">{user.address}</p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-950 rounded-xl p-4 border border-gray-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Teléfono</p>
            <p className="text-slate-800 dark:text-white font-medium">{user.phone}</p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-950 rounded-xl p-4 border border-gray-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Fecha de nacimiento</p>
            <p className="text-slate-800 dark:text-white font-medium">{user.birthDate}</p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-950 rounded-xl p-4 border border-gray-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Género</p>
            <p className="text-slate-800 dark:text-white font-medium">{user.gender}</p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-950 rounded-xl p-4 border border-gray-200 dark:border-slate-800 md:col-span-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">País</p>
            <p className="text-slate-800 dark:text-white font-medium">{user.country}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
