import {
  Building2,
  CreditCard,
  TriangleAlert,
  BarChart3,
} from "lucide-react";

type ModuleItem = {
  title: string;
  description: string;
  icon: React.ElementType;
};

interface AdminModulesProps {
  modules: ModuleItem[];
}

export default function AdminModules({ modules }: AdminModulesProps) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="mb-6">
        <p className="text-orange-500 font-semibold mb-2">
          Módulos de administración
        </p>
        <h2 className="text-2xl font-bold text-slate-800">
          Gestión principal
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <button
              key={module.title}
              type="button"
              className="group rounded-2xl border border-gray-200 bg-[#f8f8f8] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                <Icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                {module.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {module.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export const adminModulesData = [
  {
    title: "Empresas",
    description: "Gestiona el registro, consulta y administración general de empresas.",
    icon: Building2,
  },
  {
    title: "Planes / Suscripciones",
    description: "Revisa y administra los planes disponibles del sistema.",
    icon: CreditCard,
  },
  {
    title: "Incidencias",
    description: "Consulta reportes, alertas y problemas globales del sistema.",
    icon: TriangleAlert,
  },
  {
    title: "Reportes",
    description: "Visualiza información consolidada y métricas generales.",
    icon: BarChart3,
  },
];