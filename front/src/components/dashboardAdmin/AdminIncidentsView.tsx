'use client';

import { useEffect, useState } from 'react';
import { TriangleAlert } from 'lucide-react';

import BackToAdminDashboard from '@/components/dashboardAdmin/BackToAdminDashboard';
import AdminMetricCard from '@/components/dashboardAdmin/AdminMetricCard';
import { AdminIncident } from '@/interfaces/shipment';
import { getAdminIncidents } from '@/services/adminIncidents.service';
import AdminIncidentsTable from './AdminIncidentsTable';

export default function AdminIncidentsView() {
  const [incidents, setIncidents] = useState<AdminIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIncidents() {
      try {
        setLoading(true);

        const incidentsData = await getAdminIncidents();

        setIncidents(incidentsData);
      } catch (error) {
        console.error('Error al cargar incidencias:', error);
        setIncidents([]);
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, []);

  const openIncidents = incidents.filter((incident) => incident.status === 'open');

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-0">
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="mb-8">
          <BackToAdminDashboard />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="mb-2 font-semibold text-primary">Gestión principal</p>

            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Incidencias</h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">Consulta reportes, alertas y problemas registrados dentro del sistema.</p>
          </div>

          <div className="lg:justify-self-end">
            <AdminMetricCard title="Incidencias abiertas" value={openIncidents.length} icon={TriangleAlert} compact />
          </div>
        </div>

        <div className="my-8 h-px w-full bg-border" />

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Listado de incidencias</h2>

              <p className="mt-1 text-sm text-muted">Información general de incidencias y alertas del sistema.</p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
              {incidents.length} registro{incidents.length !== 1 ? 's' : ''}
            </div>
          </div>

          {loading ? <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando incidencias...</div> : <AdminIncidentsTable incidents={incidents} />}
        </div>
      </section>
    </main>
  );
}
