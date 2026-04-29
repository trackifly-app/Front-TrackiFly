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

function maskAddress(address?: string) {
  if (!address) return 'No disponible';

  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return parts.slice(-2).join(', ');
  }

  return address;
}

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
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <section className="mx-auto max-w-5xl rounded-3xl border border-border bg-surface p-8 shadow-sm">
          <p className="text-sm text-muted">Cargando información del envío...</p>
        </section>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 md:px-8">
        <section className="mx-auto max-w-5xl rounded-3xl border border-border bg-surface p-8 shadow-sm">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:-translate-x-1 hover:underline">
            <ArrowLeft size={18} />
            Volver al inicio
          </Link>

          <div className="rounded-2xl border border-border bg-surface-muted p-8 text-center">
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

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <section className="mx-auto max-w-6xl rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:-translate-x-1 hover:underline">
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr] lg:items-center">
          <div className="space-y-5 self-center">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-border bg-surface-muted p-3">
              <img src={pkg.image || '/default-package.png'} alt={pkg.name || 'Paquete'} className="max-h-full max-w-full object-contain" />
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5 text-center">
              <p className="text-sm text-muted">Estado actual</p>

              <div className="mt-2 flex items-center justify-center gap-2 text-primary">
                <StatusIcon size={22} />

                <p className="text-xl font-bold uppercase tracking-widest">{statusLabels[status] || order.status}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-2 font-semibold text-primary">Seguimiento de envío</p>

              <h1 className="text-3xl font-black uppercase italic tracking-tight text-foreground md:text-4xl">{pkg.name || 'Envío registrado'}</h1>

              <p className="mt-2 break-all font-mono text-sm text-muted">Código de seguimiento: {code}</p>

              <p className="mt-1 text-sm text-muted">Última actualización: {formatDate(lastUpdate)}</p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <DetailCard title="Trayecto">
                <DetailItem label="Origen aproximado" value={maskAddress(order.pickup_direction)} />

                <DetailItem label="Destino aproximado" value={maskAddress(order.delivery_direction)} />

                <DetailItem label="Distancia estimada" value={order.distance ? `${order.distance} km` : 'No disponible'} />
              </DetailCard>

              <DetailCard title="Paquete">
                <DetailItem label="Producto" value={pkg.name || 'Paquete registrado'} />

                <DetailItem label="Categoría" value={pkg.category || 'General'} />

                <DetailItem label="Peso" value={pkg.weight ? `${pkg.weight} ${pkg.unit || 'kg'}` : 'No disponible'} />

                <DetailItem label="Dimensiones" value={dims.width || dims.height || dims.depth ? `${dims.width || '0'}x${dims.height || '0'}x${dims.depth || '0'} cm` : 'No disponible'} />
              </DetailCard>
            </div>

            <div className="rounded-2xl border border-border bg-surface-muted p-5">
              <h3 className="mb-4 font-bold text-primary">Progreso del envío</h3>

              <TrackingSteps currentStatus={status} />
            </div>

            <div className="rounded-2xl border border-border bg-surface-muted p-5">
              <h3 className="mb-2 font-bold text-primary">Información protegida</h3>

              <p className="text-sm leading-relaxed text-muted">Por seguridad, esta vista pública solo muestra información logística general. Las direcciones completas, datos personales, datos del conductor, precio e información interna no se muestran sin iniciar sesión.</p>
            </div>
          </div>
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
      {steps.map((step, index) => {
        const isDone = currentIndex >= index;
        const isCurrent = currentIndex === index;

        return (
          <div key={step.key} className={`rounded-2xl border p-4 text-center ${isDone ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border bg-surface text-muted'}`}>
            <div className={`mx-auto mb-2 h-3 w-3 rounded-full ${isCurrent || isDone ? 'bg-primary' : 'bg-border'}`} />

            <p className="text-xs font-bold uppercase tracking-wide">{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-muted p-5">
      <h3 className="mb-4 font-bold text-primary">{title}</h3>

      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>

      <p className="wrap-break-words font-medium text-foreground">{value}</p>
    </div>
  );
}
