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
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="mb-2 font-semibold text-primary">Datos de empresa</p>

        <h2 className="text-2xl font-bold text-foreground">Información general</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface-muted p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-muted">
            <Mail size={16} />
            <span>Email</span>
          </div>
          <p className="font-semibold text-foreground">{company.email}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-muted p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-muted">
            <Building2 size={16} />
            <span>Nombre de empresa</span>
          </div>
          <p className="font-semibold text-foreground">{company.company_name}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-muted p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-muted">
            <BriefcaseBusiness size={16} />
            <span>Industria</span>
          </div>
          <p className="font-semibold text-foreground">{company.industry}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-muted p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-muted">
            <UserRound size={16} />
            <span>Nombre de contacto</span>
          </div>
          <p className="font-semibold text-foreground">{company.contact_name}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-muted p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-muted">
            <Phone size={16} />
            <span>Teléfono</span>
          </div>
          <p className="font-semibold text-foreground">{company.phone}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-muted p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-muted">
            <Globe size={16} />
            <span>País</span>
          </div>
          <p className="font-semibold text-foreground">{company.country}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-muted p-4 md:col-span-2">
          <div className="mb-1 flex items-center gap-2 text-sm text-muted">
            <MapPinned size={16} />
            <span>Dirección</span>
          </div>
          <p className="font-semibold text-foreground">{company.address}</p>
        </div>
      </div>
    </section>
  );
}
