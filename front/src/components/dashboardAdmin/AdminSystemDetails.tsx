import { Settings, ShieldCheck, ScrollText } from "lucide-react";

type DetailItem = {
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
};

interface AdminSystemDetailsProps {
  details: DetailItem[];
}

export default function AdminSystemDetails({
  details,
}: AdminSystemDetailsProps) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="mb-6">
        <p className="text-orange-500 font-semibold mb-2">
          Detalles del sistema
        </p>
        <h2 className="text-2xl font-bold text-slate-800">
          Control y supervisión
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {details.map((detail) => {
          const Icon = detail.icon;

          return (
            <div
              key={detail.title}
              className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
                <Icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                {detail.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {detail.description}
              </p>

              <button
                type="button"
                className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
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
    title: "Configuración",
    description: "Administra los ajustes generales y opciones principales del sistema.",
    icon: Settings,
    action: "Administrar",
  },
  {
    title: "Seguridad",
    description: "Revisa accesos, protección de cuenta y controles de seguridad.",
    icon: ShieldCheck,
    action: "Revisar",
  },
  {
    title: "Registros (Logs)",
    description: "Consulta el historial de eventos y movimientos importantes del sistema.",
    icon: ScrollText,
    action: "Ver registros",
  },
];