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

          const content = (
            <>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                <Icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-foreground">{detail.title}</h3>

              <p className="mt-2 text-sm leading-relaxed text-muted">{detail.description}</p>
            </>
          );

          const activeClassName = 'group rounded-2xl border border-border bg-surface-muted p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40';

          const disabledClassName = 'group relative cursor-not-allowed rounded-2xl border border-border bg-surface-muted p-5 text-left opacity-60';

          if (!detail.href) {
            return (
              <button key={detail.title} type="button" disabled title="Funcionalidad próximamente" className={disabledClassName}>
                <span className="absolute right-4 top-4 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">Proximamente...</span>

                {content}
              </button>
            );
          }

          return (
            <Link key={detail.title} href={detail.href} className={activeClassName}>
              {content}
            </Link>
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
    href: '/dashboard/admin/administradores',
  },
  {
    title: 'Registros (Logs)',
    description: 'Consulta el historial de eventos y movimientos importantes del sistema.',
    icon: ScrollText,
  },
];
