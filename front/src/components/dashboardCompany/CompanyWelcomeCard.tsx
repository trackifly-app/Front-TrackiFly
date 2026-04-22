"use client"

import { useAuth } from "@/context/AuthContext";
import { CompanyWelcomeCardProps } from "@/interfaces/shipment";


export default function CompanyWelcomeCard({ company, moduleCount }: CompanyWelcomeCardProps) {
  const {userData}=useAuth()
  return (
    <section className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="h-22 w-22 overflow-hidden rounded-2xl border border-primary/30 bg-primary/10 shadow-sm">
            <img src={company.image} alt={company.company_name} className="h-full w-full object-cover" />
          </div>

          <div>
            <p className="mb-2 font-semibold text-primary">Dashboard empresarial</p>

            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Bienvenido, {userData?.user?.company?.company_name}</h1>

            <p className="mt-2 max-w-2xl text-muted">Aquí puedes revisar la información de tu empresa y acceder a los módulos principales de gestión.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Highlight principal */}
          <div className="rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4 text-center">
            <p className="text-sm text-muted">Módulos activos</p>
            <p className="text-3xl font-bold text-primary">{moduleCount}</p>
          </div>

          {/* Card neutra - País */}
          <div className="rounded-2xl border border-border bg-surface-muted px-5 py-4 text-center">
            <p className="text-sm text-muted">País</p>
            <p className="text-2xl font-bold text-foreground">{userData?.user?.company?.country}</p>
          </div>

          {/* Card neutra - Plan */}
          <div className="rounded-2xl border border-border bg-surface-muted px-5 py-4 text-center">
            <p className="text-sm text-muted">Plan</p>
            <p className="text-lg font-bold text-foreground">{userData?.user?.company?.plan}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
