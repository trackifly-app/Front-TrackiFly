'use client';

import Link from 'next/link';
import { Users, Truck, MapPin, PackageSearch, TriangleAlert } from 'lucide-react';
import { CompanyQuickAccessProps } from '@/interfaces/shipment';
import { ModuleItem } from '@/types/types';

export default function CompanyQuickAccess({ modules }: CompanyQuickAccessProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="mb-2 font-semibold text-primary">Módulos / accesos rápidos</p>

        <h2 className="text-2xl font-bold text-foreground">Gestión operativa</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;

          const content = (
            <>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                <Icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-foreground">{module.title}</h3>

              <p className="mt-2 text-sm text-muted">{module.description}</p>
            </>
          );

          const activeClassName = 'group rounded-2xl border border-border bg-surface-muted p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 active:scale-[0.985]';

          const disabledClassName = 'group relative cursor-not-allowed rounded-2xl border border-border bg-surface-muted p-5 text-left opacity-60';

          if (!module.href) {
            return (
              <button key={module.title} type="button" disabled title="Funcionalidad próximamente" className={disabledClassName}>
                <span className="absolute right-4 top-4 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">Proximamente...</span>

                {content}
              </button>
            );
          }

          return (
            <Link key={module.title} href={module.href} className={activeClassName}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export const companyModules: ModuleItem[] = [
  {
    title: 'Empleados',
    description: 'Gestiona el personal administrativo y operativo.',
    icon: Users,
    href: '/dashboard/company/employee',
  },
  {
    title: 'Monitoreo de pedidos',
    description: 'Haz seguimiento del estado y ruta de los envíos.',
    icon: PackageSearch,
    href: '/dashboard/company/orders',
  },
  {
    title: 'Ubicaciones / Sedes',
    description: 'Organiza oficinas, almacenes y puntos de operación.',
    icon: MapPin,
  },
  {
    title: 'Conductores',
    description: 'Consulta y administra los conductores registrados.',
    icon: Truck,
  },
  {
    title: 'Incidencias',
    description: 'Revisa reportes, alertas y eventos pendientes.',
    icon: TriangleAlert,
  },
];
