import {
  Building2,
  Mail,
  Phone,
  MapPinned,
  Globe,
  BriefcaseBusiness,
  UserRound,
} from "lucide-react";

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

export default function CompanyProfileCard({
  company,
}: CompanyProfileCardProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="mb-2 font-semibold text-orange-500">Datos de empresa</p>
        <h2 className="text-2xl font-bold text-slate-800">
          Información general
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
            <Mail size={16} />
            <span>Email</span>
          </div>
          <p className="font-semibold text-slate-800">{company.email}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
            <Building2 size={16} />
            <span>Nombre de empresa</span>
          </div>
          <p className="font-semibold text-slate-800">
            {company.company_name}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
            <BriefcaseBusiness size={16} />
            <span>Industria</span>
          </div>
          <p className="font-semibold text-slate-800">{company.industry}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
            <UserRound size={16} />
            <span>Nombre de contacto</span>
          </div>
          <p className="font-semibold text-slate-800">
            {company.contact_name}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
            <Phone size={16} />
            <span>Teléfono</span>
          </div>
          <p className="font-semibold text-slate-800">{company.phone}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
            <Globe size={16} />
            <span>País</span>
          </div>
          <p className="font-semibold text-slate-800">{company.country}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-4 md:col-span-2">
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
            <MapPinned size={16} />
            <span>Dirección</span>
          </div>
          <p className="font-semibold text-slate-800">{company.address}</p>
        </div>
      </div>
    </section>
  );
}