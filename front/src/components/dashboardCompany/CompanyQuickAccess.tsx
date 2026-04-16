'use client';

import Link from 'next/link';
import { Users, Truck, MapPin, PackageSearch, TriangleAlert } from 'lucide-react';

interface ModuleItem {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface CompanyQuickAccessProps {
  modules: ModuleItem[];
}

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

          if (module.title === 'Empleados') {
            return (
              <Link key={module.title} href="/dashboard/company/employee" className="group rounded-2xl border border-border bg-surface-muted p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 active:scale-[0.985]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-bold text-foreground">{module.title}</h3>
                <p className="mt-2 text-sm text-muted">{module.description}</p>
              </Link>
            );
          }

          return (
            <button key={module.title} type="button" className="group rounded-2xl border border-border bg-surface-muted p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 active:scale-[0.985]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                <Icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-foreground">{module.title}</h3>
              <p className="mt-2 text-sm text-muted">{module.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export const companyModules = [
  {
    title: 'Empleados',
    description: 'Gestiona el personal administrativo y operativo.',
    icon: Users,
  },
  {
    title: 'Conductores',
    description: 'Consulta y administra los conductores registrados.',
    icon: Truck,
  },
  {
    title: 'Ubicaciones / Sedes',
    description: 'Organiza oficinas, almacenes y puntos de operación.',
    icon: MapPin,
  },
  {
    title: 'Monitoreo de pedidos',
    description: 'Haz seguimiento del estado y ruta de los envíos.',
    icon: PackageSearch,
  },
  {
    title: 'Incidencias',
    description: 'Revisa reportes, alertas y eventos pendientes.',
    icon: TriangleAlert,
  },
];
