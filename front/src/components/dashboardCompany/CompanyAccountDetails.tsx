import { CompanyAccountDetailsProps } from '@/interfaces/shipment';
import { CreditCard } from 'lucide-react';

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
            <div key={item.title} className="relative cursor-not-allowed rounded-2xl border border-border bg-surface-muted p-5 opacity-60" title="Funcionalidad próximamente">
              <span className="absolute right-4 top-4 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">Proximamente...</span>

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
                <Icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-foreground">{item.title}</h3>

              <p className="mt-2 text-sm text-muted">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export const companyAccountDetails = (plan: string) => [
  {
    title: 'Plan / Suscripción',
    description: `Plan actual: ${plan}`,
    icon: CreditCard,
  },
];
