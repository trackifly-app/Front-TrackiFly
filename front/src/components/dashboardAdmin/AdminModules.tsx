import { AdminModulesProps } from '@/interfaces/shipment';
import { Building2, CreditCard, TriangleAlert, BarChart3, User } from 'lucide-react';

export default function AdminModules({ modules }: AdminModulesProps) {
  return (
    <section className="bg-surface rounded-3xl shadow-sm border border-border p-6 md:p-8">
      <div className="mb-6">
        <p className="text-primary font-semibold mb-2">Módulos de administración</p>

        <h2 className="text-2xl font-bold text-foreground">Gestión principal</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <button key={module.title} type="button" className="group rounded-2xl border border-border bg-surface-muted p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10">
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

export const adminModulesData = [
  {
    title: 'Empresas',
    description: 'Gestiona el registro, consulta y administración general de empresas.',
    icon: Building2,
  },
  {
    title: 'Usuarios',
    description: 'Gestiona el registro, consulta y administración general de empresas.',
    icon: User,
  },
  {
    title: 'Planes / Suscripciones',
    description: 'Revisa y administra los planes disponibles del sistema.',
    icon: CreditCard,
  },
  {
    title: 'Incidencias',
    description: 'Consulta reportes, alertas y problemas globales del sistema.',
    icon: TriangleAlert,
  },
  {
    title: 'Reportes',
    description: 'Visualiza información consolidada y métricas generales.',
    icon: BarChart3,
  },
];
