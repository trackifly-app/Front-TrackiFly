'use client'
import { useAuth } from "@/context/AuthContext";

export default function CompanyWelcomeCard() {
  const { userData } = useAuth();

  // Extraemos los datos de forma segura para no llenar el JSX de "?"
  const companyName = userData?.user?.company_name || "Empresa";
  const country = userData?.user?.country || "N/A";
  const plan = userData?.user?.plan || "Sin plan";
  
  // Si moduleCount no viene del auth, podrías definirlo aquí o recibirlo por props
  const moduleCount = 0; 

  return (
    <section className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="h-22 w-22 overflow-hidden rounded-2xl border border-primary/30 bg-primary/10 shadow-sm">
            {/* Aquí podrías poner un logo si lo tienes en userData */}
          </div>

          <div>
            <p className="mb-2 font-semibold text-primary">Dashboard empresarial</p>

            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Bienvenido, {companyName}
            </h1>

            <p className="mt-2 max-w-2xl text-muted">
              Aquí puedes revisar la información de tu empresa y acceder a los módulos principales de gestión.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Módulos activos */}
          <div className="rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4 text-center">
            <p className="text-sm text-muted">Módulos activos</p>
            <p className="text-3xl font-bold text-primary">{moduleCount}</p>
          </div>

          {/* País */}
          <div className="rounded-2xl border border-border bg-surface-muted px-5 py-4 text-center">
            <p className="text-sm text-muted">País</p>
            <p className="text-2xl font-bold text-foreground">{country}</p>
          </div>

          {/* Plan */}
          <div className="rounded-2xl border border-border bg-surface-muted px-5 py-4 text-center">
            <p className="text-sm text-muted">Plan</p>
            <p className="text-lg font-bold text-foreground uppercase">{plan}</p>
          </div>
        </div>
      </div>
    </section>
  );
}