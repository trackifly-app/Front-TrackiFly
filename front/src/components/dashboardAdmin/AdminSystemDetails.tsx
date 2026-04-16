import { Settings, ShieldCheck, ScrollText } from 'lucide-react';

type DetailItem = {
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
};

interface AdminSystemDetailsProps {
  details: DetailItem[];
}

export default function AdminSystemDetails({ details }: AdminSystemDetailsProps) {
  return (
    <section className="bg-surface rounded-3xl shadow-sm border border-border p-6 md:p-8">
      <div className="mb-6">
        <p className="text-primary font-semibold mb-2">Detalles del sistema</p>

        <h2 className="text-2xl font-bold text-foreground">Control y supervisión</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {details.map((detail) => {
          const Icon = detail.icon;

          return (
            <div key={detail.title} className="rounded-2xl border border-border bg-surface-muted p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
                <Icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-foreground">{detail.title}</h3>

              <p className="mt-2 text-sm text-muted">{detail.description}</p>

              <button type="button" className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover">
                {detail.action}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export const adminSystemDetailsData = [
  {
    title: 'Configuración',
    description: 'Administra los ajustes generales y opciones principales del sistema.',
    icon: Settings,
    action: 'Administrar',
  },
  {
    title: 'Seguridad',
    description: 'Revisa accesos, protección de cuenta y controles de seguridad.',
    icon: ShieldCheck,
    action: 'Revisar',
  },
  {
    title: 'Registros (Logs)',
    description: 'Consulta el historial de eventos y movimientos importantes del sistema.',
    icon: ScrollText,
    action: 'Ver registros',
  },
];
