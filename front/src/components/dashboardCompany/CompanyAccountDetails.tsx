import { Settings, CreditCard } from 'lucide-react';

interface AccountDetailItem {
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
}

interface CompanyAccountDetailsProps {
  accountDetails: AccountDetailItem[];
}

export default function CompanyAccountDetails({ accountDetails }: CompanyAccountDetailsProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="mb-2 font-semibold text-primary">Detalles de cuenta</p>

        <h2 className="text-2xl font-bold text-foreground">Configuración y suscripción</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {accountDetails.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded-2xl border border-border bg-surface-muted p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
                <Icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-foreground">{item.title}</h3>

              <p className="mt-2 text-sm text-muted">{item.description}</p>

              <button type="button" className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover">
                {item.action}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export const companyAccountDetails = (plan: string) => [
  {
    title: 'Configuración de empresa',
    description: 'Edita los datos generales de tu empresa.',
    icon: Settings,
    action: 'Administrar',
  },
  {
    title: 'Plan / Suscripción',
    description: `Plan actual: ${plan}`,
    icon: CreditCard,
    action: 'Ver plan',
  },
];
