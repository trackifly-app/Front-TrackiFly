import { Building2, Mail, Phone, MapPinned, Globe, BriefcaseBusiness, UserRound } from 'lucide-react';

interface CompanyProfileCardProps {
  company: {
    email: string;
    company_name: string;
    industry: string;
    contact_name: string;
    phone: string;
    address: string;
    country: string;
  };
}

export default function CompanyProfileCard({ company }: CompanyProfileCardProps) {
  return (
    <section className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="mb-2 font-semibold text-orange-500">Datos de empresa</p>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Información general</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-[#f8f8f8] dark:bg-slate-950 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Mail size={16} />
            <span>Email</span>
          </div>
          <p className="font-semibold text-slate-800 dark:text-white">{company.email}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-[#f8f8f8] dark:bg-slate-950 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Building2 size={16} />
            <span>Nombre de empresa</span>
          </div>
          <p className="font-semibold text-slate-800 dark:text-white">{company.company_name}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-[#f8f8f8] dark:bg-slate-950 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <BriefcaseBusiness size={16} />
            <span>Industria</span>
          </div>
          <p className="font-semibold text-slate-800 dark:text-white">{company.industry}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-[#f8f8f8] dark:bg-slate-950 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <UserRound size={16} />
            <span>Nombre de contacto</span>
          </div>
          <p className="font-semibold text-slate-800 dark:text-white">{company.contact_name}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-[#f8f8f8] dark:bg-slate-950 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Phone size={16} />
            <span>Teléfono</span>
          </div>
          <p className="font-semibold text-slate-800 dark:text-white">{company.phone}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-[#f8f8f8] dark:bg-slate-950 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Globe size={16} />
            <span>País</span>
          </div>
          <p className="font-semibold text-slate-800 dark:text-white">{company.country}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-[#f8f8f8] dark:bg-slate-950 p-4 md:col-span-2">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <MapPinned size={16} />
            <span>Dirección</span>
          </div>
          <p className="font-semibold text-slate-800 dark:text-white">{company.address}</p>
        </div>
      </div>
    </section>
  );
}
