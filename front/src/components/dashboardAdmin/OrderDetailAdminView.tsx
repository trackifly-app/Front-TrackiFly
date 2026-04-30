'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Box, CalendarDays, ChevronDown, MapPin, Package, Route, Scale, Tag, Truck } from 'lucide-react';
import { AdminApiOrder } from '@/interfaces/shipment';
import { getOrderById, updateOrderStatus } from '@/services/adminOrders.service';

interface OrderDetailAdminViewProps {
  orderId: string;
  userId: string;
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  processing: 'En proceso',
  shipped: 'Enviado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const orderStatusOptions = [
  {
    value: 'pending',
    label: 'Pendiente',
  },
  {
    value: 'paid',
    label: 'Pagado',
  },
  {
    value: 'processing',
    label: 'En proceso',
  },
  {
    value: 'shipped',
    label: 'Enviado',
  },
  {
    value: 'completed',
    label: 'Completado',
  },
  {
    value: 'cancelled',
    label: 'Cancelado',
  },
];

function formatDate(date?: string) {
  if (!date) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

function formatDistance(distance?: string) {
  if (!distance) return 'N/D';

  return `${Number(distance).toFixed(1)} km`;
}

function getStatusClass(status: string) {
  if (status === 'pending') {
    return 'bg-yellow-500/10 text-yellow-400';
  }

  if (status === 'paid') {
    return 'bg-blue-500/10 text-blue-400';
  }

  if (status === 'processing') {
    return 'bg-primary/10 text-primary';
  }

  if (status === 'shipped') {
    return 'bg-indigo-500/10 text-indigo-400';
  }

  if (status === 'completed') {
    return 'bg-emerald-500/10 text-emerald-400';
  }

  if (status === 'cancelled') {
    return 'bg-red-500/10 text-red-400';
  }

  return 'bg-surface text-muted';
}

export default function OrderDetailAdminView({ orderId, userId }: OrderDetailAdminViewProps) {
  const [order, setOrder] = useState<AdminApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);

        if (!userId) {
          console.error('No se recibió userId para consultar la orden');
          setOrder(null);
          return;
        }

        const orderData = await getOrderById(orderId, userId);

        setOrder(orderData);
        setSelectedStatus(orderData?.status || '');
      } catch (error) {
        console.error('Error al cargar detalle de orden:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId, userId]);

  async function handleUpdateStatus() {
    if (!order) return;
    if (!selectedStatus) return;
    if (selectedStatus === order.status) return;

    try {
      setUpdatingStatus(true);

      const updatedOrder = await updateOrderStatus(order.id, order.userId, selectedStatus);

      if (updatedOrder) {
        const refreshedOrder = await getOrderById(order.id, order.userId);

        setOrder(refreshedOrder);
        setSelectedStatus(refreshedOrder?.status || selectedStatus);
      }
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-0">
        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <p className="text-sm text-muted">Cargando detalle de orden...</p>
        </section>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-0">
        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <Link href="/dashboard/admin/ordenes" className="mb-8 inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-sm font-medium text-muted transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary">
            <ArrowLeft size={16} />
            Volver a órdenes
          </Link>

          <p className="font-semibold text-primary">Gestión principal</p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">Orden no encontrada</h1>

          <p className="mt-3 text-sm text-muted">No se pudo obtener la información de esta orden.</p>
        </section>
      </main>
    );
  }

  const packageData = order.package;
  const status = order.status || 'pending';

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-0">
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="mb-8">
          <Link href="/dashboard/admin/ordenes" className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-sm font-medium text-muted transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary">
            <ArrowLeft size={16} />
            Volver a órdenes
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="mb-2 font-semibold text-primary">Gestión principal</p>

            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Detalle de orden</h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">Información completa del paquete, trayecto y estado actual del envío.</p>
          </div>

          <div className="w-full rounded-2xl border border-border bg-surface-muted p-5 shadow-sm lg:w-[320px]">
            <p className="text-sm font-semibold text-muted">Estado actual</p>

            <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(status)}`}>{statusLabels[status] ?? status}</span>

            <div className="mt-5 space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-muted">Actualizar estado</label>

                <p className="mt-1 text-xs text-muted">Selecciona el nuevo estado del pedido.</p>
              </div>

              <div className="relative">
                <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-border bg-surface px-4 pr-11 text-sm font-semibold text-foreground shadow-sm outline-none transition-all duration-300 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20">
                  {orderStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted">
                  <ChevronDown size={18} />
                </div>
              </div>

              {selectedStatus !== order.status && (
                <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3">
                  <p className="text-xs font-medium text-primary">
                    Cambiarás el estado de <span className="font-bold">{statusLabels[order.status] ?? order.status}</span> a <span className="font-bold">{statusLabels[selectedStatus] ?? selectedStatus}</span>.
                  </p>
                </div>
              )}

              <button type="button" disabled={updatingStatus || selectedStatus === order.status} onClick={handleUpdateStatus} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100">
                {updatingStatus ? 'Actualizando...' : 'Guardar estado'}
              </button>
            </div>
          </div>
        </div>

        <div className="my-8 h-px w-full bg-border" />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-border bg-surface-muted p-5 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-primary">
                <Package size={22} />
              </div>

              <div>
                <p className="text-sm text-muted">Paquete</p>

                <h2 className="text-xl font-bold text-foreground">{packageData?.name || 'Paquete sin nombre'}</h2>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted">{packageData?.description || 'Sin descripción registrada.'}</p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoItem icon={Tag} label="Categoría" value={packageData?.category || 'Sin categoría'} />

              <InfoItem icon={Scale} label="Peso" value={packageData?.weight ? `${Number(packageData.weight).toFixed(2)} kg` : 'N/D'} />

              <InfoItem icon={Box} label="Dimensiones" value={packageData?.dimensions ? `${packageData.dimensions.height} x ${packageData.dimensions.width} x ${packageData.dimensions.depth} ${packageData.dimensions.unit}` : 'N/D'} />

              <InfoItem icon={CalendarDays} label="Fecha de creación" value={formatDate(order.created_at)} />
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-surface-muted p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-primary">
                <Truck size={22} />
              </div>

              <div>
                <p className="text-sm text-muted">Servicios</p>

                <h2 className="text-xl font-bold text-foreground">Características</h2>
              </div>
            </div>

            <div className="space-y-3">
              <ServiceBadge active={packageData?.fragile} label="Frágil" />
              <ServiceBadge active={packageData?.dangerous} label="Peligroso" />
              <ServiceBadge active={packageData?.cooled} label="Refrigerado" />
              <ServiceBadge active={packageData?.urgent} label="Urgente" />
            </div>
          </article>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-surface-muted p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-primary">
              <Route size={22} />
            </div>

            <div>
              <p className="text-sm text-muted">Trayecto</p>

              <h2 className="text-xl font-bold text-foreground">Ruta del envío</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoItem icon={MapPin} label="Origen" value={order.pickup_direction || 'No registrado'} />

            <InfoItem icon={MapPin} label="Destino" value={order.delivery_direction || 'No registrado'} />

            <InfoItem icon={Route} label="Distancia" value={formatDistance(order.distance)} />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-surface-muted p-5">
          <p className="text-sm font-semibold text-muted">ID de la orden</p>

          <p className="mt-2 break-all font-mono text-sm text-foreground">{order.id}</p>

          <p className="mt-4 text-sm font-semibold text-muted">ID del usuario</p>

          <p className="mt-2 break-all font-mono text-sm text-foreground">{order.userId}</p>
        </div>
      </section>
    </main>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-muted">
        <Icon size={16} />

        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>

      <p className="text-sm font-medium leading-relaxed text-foreground">{value}</p>
    </div>
  );
}

interface ServiceBadgeProps {
  active?: boolean;
  label: string;
}

function ServiceBadge({ active, label }: ServiceBadgeProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
      <span className="text-sm font-medium text-foreground">{label}</span>

      <span className={active ? 'rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary' : 'rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-muted'}>{active ? 'Sí' : 'No'}</span>
    </div>
  );
}
