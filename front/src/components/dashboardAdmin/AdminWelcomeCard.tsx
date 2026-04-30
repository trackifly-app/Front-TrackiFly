'use client';

import { useEffect, useState } from 'react';
import { getAdminDashboardStats } from '@/services/adminDashboard.service';
import { AdminDashboardStats, AdminStatItemProps, AdminWelcomeCardProps } from '@/interfaces/shipment';

const initialStats: AdminDashboardStats = {
  totalCompanies: 0,
  totalUsers: 0,
  openIncidents: 0,
};

export default function AdminWelcomeCard({ adminName }: AdminWelcomeCardProps) {
  const [stats, setStats] = useState<AdminDashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);

        const dashboardStats = await getAdminDashboardStats();

        setStats(dashboardStats);
      } catch (error) {
        console.error('Error al cargar estadísticas del administrador:', error);
        setStats(initialStats);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <section className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 font-semibold text-primary">Dashboard de administrador</p>

          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Bienvenido, {adminName}</h1>

          <p className="mt-2 max-w-2xl text-muted">Aquí puedes supervisar el sistema, revisar el estado general de las empresas y acceder a los módulos principales de administración.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminStatItem title="Empresas registradas" value={stats.totalCompanies} loading={loading} />

        <AdminStatItem title="Usuarios registrados" value={stats.totalUsers} loading={loading} />

        <AdminStatItem title="Incidencias abiertas" value={stats.openIncidents} loading={loading} />
      </div>
    </section>
  );
}

function AdminStatItem({ title, value, loading }: AdminStatItemProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface-muted p-4">
      <p className="text-sm text-muted">{title}</p>

      {loading ? <div className="mt-3 h-8 w-16 animate-pulse rounded-lg bg-surface" /> : <p className="mt-3 text-3xl font-bold leading-none text-foreground">{value}</p>}
    </article>
  );
}
