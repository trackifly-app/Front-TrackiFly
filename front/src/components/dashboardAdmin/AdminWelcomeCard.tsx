import { AdminWelcomeCardProps } from '@/interfaces/shipment';

export default function AdminWelcomeCard({ adminName, stats }: AdminWelcomeCardProps) {
  return (
    <section className="bg-surface rounded-3xl shadow-sm border border-border p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-primary font-semibold mb-2">Dashboard de administrador</p>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Bienvenido, {adminName}</h1>

          <p className="text-muted mt-2 max-w-2xl">Aquí puedes supervisar el sistema, revisar el estado general de las empresas y acceder a los módulos principales de administración.</p>
        </div>

        <div className="bg-primary/10 border border-primary/30 rounded-2xl px-5 py-4">
          <p className="text-sm text-muted">Empresas registradas</p>

          <p className="text-3xl font-bold text-primary">{stats.totalCompanies}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <div className="rounded-2xl border border-border bg-surface-muted p-4">
          <p className="text-sm text-muted">Empresas registradas</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.totalCompanies}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-muted p-4">
          <p className="text-sm text-muted">Empresas activas</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.activeCompanies}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-muted p-4">
          <p className="text-sm text-muted">Incidencias abiertas</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.openIncidents}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-muted p-4">
          <p className="text-sm text-muted">Planes activos</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.activePlans}</p>
        </div>
      </div>
    </section>
  );
}
