'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, PackageSearch, Truck, XCircle } from 'lucide-react';

import { CompanyApiOrder } from '@/interfaces/shipment';
import { getOrderByTrackingCode } from '@/services/tracking.service';

type Props = {
  code: string;
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  processing: 'En preparación',
  shipped: 'En camino',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  paid: CheckCircle2,
  processing: PackageSearch,
  shipped: Truck,
  completed: CheckCircle2,
  cancelled: XCircle,
};

function formatDate(date?: string) {
  if (!date) return 'No disponible';

  return new Date(date).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function TrackingResultView({ code }: Props) {
  const [order, setOrder] = useState<CompanyApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setErrorMessage('');

        const data = await getOrderByTrackingCode(code);

        setOrder(data);
      } catch (error) {
        setOrder(null);
        setErrorMessage(error instanceof Error ? error.message : 'No se pudo obtener el envío');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [code]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-6 md:px-8 md:py-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <p className="text-sm text-muted">Cargando información del envío...</p>
        </section>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-background px-4 py-6 md:px-8 md:py-10">
        <section className="mx-auto max-w-5xl rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:-translate-x-1 hover:underline">
            <ArrowLeft size={18} />
            Volver al inicio
          </Link>

          <div className="rounded-2xl border border-border bg-surface-muted p-6 text-center md:p-8">
            <XCircle className="mx-auto mb-4 text-primary" size={44} />

            <h1 className="text-2xl font-bold text-foreground">No encontramos ese envío</h1>

            <p className="mt-2 text-sm text-muted">{errorMessage || 'Verifica el código de seguimiento e intenta nuevamente.'}</p>
          </div>
        </section>
      </main>
    );
  }

  const pkg = order.package || {};
  const dims = pkg.dimensions || {};

  const status = order.status?.toLowerCase() || 'pending';
  const StatusIcon = statusIcons[status] || Clock;
  const lastUpdate = order.updated_at || order.created_at;

  const dimensions = dims.width || dims.height || dims.depth ? `${dims.width || '0'} × ${dims.height || '0'} × ${dims.depth || '0'} cm` : 'No disponible';

  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-8 md:py-10">
      <section className="mx-auto max-w-7xl rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 md:p-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:-translate-x-1 hover:underline md:mb-10">
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
          <div className="hidden lg:block" />

          <header className="text-center lg:text-left">
            <p className="mb-2 font-semibold text-primary">Seguimiento de envío</p>

            <h1 className="break-words text-3xl font-black uppercase italic tracking-tight text-foreground sm:text-4xl md:text-5xl">{pkg.name || 'Envío registrado'}</h1>

            <div className="mt-3 space-y-1 text-sm text-muted sm:text-base">
              <p className="break-all font-mono">Código de seguimiento: {code}</p>
              <p>Última actualización: {formatDate(lastUpdate)}</p>
            </div>
          </header>

          <aside className="mx-auto w-full max-w-md space-y-5 lg:max-w-none">
            <div className="overflow-hidden rounded-3xl border border-border bg-surface-muted p-4">
              <div className="overflow-hidden rounded-2xl">
                <img src={pkg.image || '/default-package.png'} alt={pkg.name || 'Paquete'} className="h-70 w-full object-cover sm:h-85 lg:h-105 xl:h-115" />
              </div>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5 text-center">
              <p className="text-sm text-muted">Estado actual</p>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-primary">
                <StatusIcon size={22} />

                <p className="text-lg font-bold uppercase tracking-widest sm:text-xl">{statusLabels[status] || order.status}</p>
              </div>
            </div>
          </aside>

          <section className="min-w-0 space-y-6">
            <div className="rounded-2xl border border-border bg-surface-muted p-5 sm:p-6">
              <h3 className="mb-5 font-bold text-primary">Paquete</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DetailItem label="Producto" value={pkg.name || 'Paquete registrado'} />
                <DetailItem label="Categoría" value={pkg.category || 'General'} />
                <DetailItem label="Peso" value={pkg.weight ? `${pkg.weight} ${pkg.unit || 'kg'}` : 'No disponible'} />
                <DetailItem label="Dimensiones" value={dimensions} />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface-muted p-5 sm:p-6">
              <h3 className="mb-5 font-bold text-primary">Progreso del envío</h3>

              <TrackingSteps currentStatus={status} />
            </div>

            <div className="rounded-2xl border border-border bg-surface-muted p-5 sm:p-6">
              <h3 className="mb-2 font-bold text-primary">Información protegida</h3>

              <p className="text-sm leading-relaxed text-muted sm:text-base">Por seguridad, esta vista pública solo muestra información logística general. Las direcciones completas, datos personales, datos del conductor, precio e información interna solo se muestran en los paneles de control correspondientes.</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function TrackingSteps({ currentStatus }: { currentStatus: string }) {
  const steps = [
    { key: 'pending', label: 'Pendiente' },
    { key: 'paid', label: 'Pagado' },
    { key: 'processing', label: 'Procesando' },
    { key: 'shipped', label: 'En camino' },
    { key: 'completed', label: 'Completado' },
  ];

  const currentIndex = steps.findIndex((step) => step.key === currentStatus);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {steps.map((step, index) => {
        const isDone = currentIndex >= index;
        const isCurrent = currentIndex === index;

        return (
          <div key={step.key} className={`flex min-h-20 items-center justify-between gap-3 rounded-2xl border p-4 text-left transition sm:flex-col sm:justify-center sm:text-center ${isDone ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border bg-surface text-muted'}`}>
            <div className={`h-3 w-3 shrink-0 rounded-full sm:mx-auto ${isCurrent || isDone ? 'bg-primary' : 'bg-border'}`} />

            <p className="text-xs font-bold uppercase tracking-wide">{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface/40 p-4">
      <p className="mb-1 text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="wrap-break-words text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}
