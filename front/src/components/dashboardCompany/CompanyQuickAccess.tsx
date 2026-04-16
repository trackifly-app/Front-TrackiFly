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
    <section className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="mb-2 font-semibold text-orange-500">Módulos / accesos rápidos</p>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gestión operativa</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <button key={module.title} type="button" className="group rounded-2xl border border-gray-200 dark:border-slate-800 bg-[#f8f8f8] dark:bg-slate-950 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-orange-500 shadow-sm transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                <Icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{module.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{module.description}</p>
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
