interface CompanyWelcomeCardProps {
  company: {
    company_name: string;
    country: string;
    plan: string;
    image: string;
  };
  moduleCount: number;
}

export default function CompanyWelcomeCard({
  company,
  moduleCount,
}: CompanyWelcomeCardProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="h-22 w-22 overflow-hidden rounded-2xl border border-orange-200 bg-orange-50 shadow-sm">
            <img
              src={company.image}
              alt={company.company_name}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="mb-2 font-semibold text-orange-500">
              Dashboard empresarial
            </p>
            <h1 className="text-3xl font-bold text-slate-800 md:text-4xl">
              Bienvenido, {company.company_name}
            </h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Aquí puedes revisar la información de tu empresa y acceder a los
              módulos principales de gestión.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-center">
            <p className="text-sm text-slate-500">Módulos activos</p>
            <p className="text-3xl font-bold text-orange-500">
              {moduleCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-center">
            <p className="text-sm text-slate-500">País</p>
            <p className="text-2xl font-bold text-slate-800">
              {company.country}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-center">
            <p className="text-sm text-slate-500">Plan</p>
            <p className="text-lg font-bold text-slate-800">
              {company.plan}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}