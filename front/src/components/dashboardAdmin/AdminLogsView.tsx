'use client';

import { ScrollText } from 'lucide-react';

import BackToAdminDashboard from '@/components/dashboardAdmin/BackToAdminDashboard';
import AdminMetricCard from '@/components/dashboardAdmin/AdminMetricCard';

const logs: AdminLog[] = [];

interface AdminLog {
  id: string;
  action: string;
  description: string;
  created_at: string;
}

export default function AdminLogsView() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-0">
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="mb-8">
          <BackToAdminDashboard />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="mb-2 font-semibold text-primary">Control y supervisión</p>

            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Registros del sistema</h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">Consulta eventos y movimientos importantes realizados dentro del sistema.</p>
          </div>

          <div className="lg:justify-self-end">
            <AdminMetricCard title="Total de registros" value={logs.length} icon={ScrollText} compact />
          </div>
        </div>

        <div className="my-8 h-px w-full bg-border" />

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Historial de actividad</h2>

              <p className="mt-1 text-sm text-muted">Registro de acciones importantes realizadas en la plataforma.</p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
              {logs.length} registro{logs.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-muted p-8 text-center">
            <p className="text-sm font-semibold text-foreground">No hay registros disponibles.</p>

            <p className="mt-2 text-sm text-muted">Cuando exista un endpoint de logs, aquí se mostrará el historial del sistema.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
