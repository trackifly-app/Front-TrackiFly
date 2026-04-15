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
      <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.image || "https://via.placeholder.com/150"}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800">Mis datos</h2>
            <p className="text-sm text-slate-500">Información personal del usuario</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-slate-500">Email</p>
            <p className="text-slate-800 font-medium wrap-break-words">{user.email}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-slate-500">Nombre</p>
            <p className="text-slate-800 font-medium">{user.name}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-slate-500">Dirección</p>
            <p className="text-slate-800 font-medium">{user.address}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-slate-500">Teléfono</p>
            <p className="text-slate-800 font-medium">{user.phone}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-slate-500">Fecha de nacimiento</p>
            <p className="text-slate-800 font-medium">{user.birthDate}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-slate-500">Género</p>
            <p className="text-slate-800 font-medium">{user.gender}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
            <p className="text-sm text-slate-500">País</p>
            <p className="text-slate-800 font-medium">{user.country}</p>
          </div>
        </div>
      </section>
    </div>
  );
}