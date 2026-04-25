import Link from 'next/link';
import { AdminSystemDetailsProps } from '@/interfaces/shipment';
import { Settings, ScrollText } from 'lucide-react';

export default function AdminSystemDetails({ details }: AdminSystemDetailsProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="mb-2 font-semibold text-primary">Detalles del sistema</p>

        <h2 className="text-2xl font-bold text-foreground">Control y supervisión</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {details.map((detail) => {
          const Icon = detail.icon;

          return (
            <article key={detail.title} className="rounded-2xl border border-border bg-surface-muted p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
                <Icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-foreground">{detail.title}</h3>

              <p className="mt-2 text-sm leading-relaxed text-muted">{detail.description}</p>

              <Link href={detail.href} className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover">
                {detail.action}
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export const adminSystemDetailsData = [
  {
    title: 'Gestión de Administradores',
    description: 'Gestiona los usuarios que supervisan la aplicación como administrador.',
    icon: Settings,
    action: 'Administrar',
    href: '/dashboard/admin/administradores',
  },
  {
    title: 'Registros (Logs)',
    description: 'Consulta el historial de eventos y movimientos importantes del sistema.',
    icon: ScrollText,
    action: 'Ver registros',
    href: '/dashboard/admin/logs',
  },
];
