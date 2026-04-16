interface AdminWelcomeCardProps {
  adminName: string;
  stats: {
    totalCompanies: number;
    activeCompanies: number;
    openIncidents: number;
    activePlans: number;
  };
}

export default function AdminWelcomeCard({
  adminName,
  stats,
}: AdminWelcomeCardProps) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-orange-500 font-semibold mb-2">
            Dashboard de administrador
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            Bienvenido, {adminName}
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Aquí puedes supervisar el sistema, revisar el estado general de las
            empresas y acceder a los módulos principales de administración.
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4">
          <p className="text-sm text-slate-500">Empresas registradas</p>
          <p className="text-3xl font-bold text-orange-500">
            {stats.totalCompanies}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-4">
          <p className="text-sm text-slate-500">Empresas registradas</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {stats.totalCompanies}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-4">
          <p className="text-sm text-slate-500">Empresas activas</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {stats.activeCompanies}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-4">
          <p className="text-sm text-slate-500">Incidencias abiertas</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {stats.openIncidents}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-4">
          <p className="text-sm text-slate-500">Planes activos</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {stats.activePlans}
          </p>
        </div>
      </div>
    </section>
  );
}