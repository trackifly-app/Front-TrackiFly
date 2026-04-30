"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, PackageSearch, X } from "lucide-react";

import AdminMetricCard from "@/components/dashboardAdmin/AdminMetricCard";
import { CompanyApiOrder } from "@/interfaces/shipment";
import { getOrdersByCompanyEmployees } from "@/services/companyOrders.service";
import { useAuth } from "@/context/AuthContext";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
} from "@/constants/orderStatus";

export default function OrdersCompanyView() {
  const { userData, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<CompanyApiOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<CompanyApiOrder | null>(
    null,
  );

  useEffect(() => {
    async function loadCompanyOrders() {
      if (authLoading) return;

      try {
        setLoadingOrders(true);

        const roleName = userData?.user?.role?.name;
        let companyId = userData?.user?.id;

        // Si entra un operador, resolvemos el ID del usuario empresa desde parentCompany.
        if (roleName === "operator") {
          const userId = userData?.user?.id;

          if (!userId) {
            setOrders([]);
            return;
          }

          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
            {
              credentials: "include",
              cache: "no-store",
            },
          );

          if (!userResponse.ok) {
            throw new Error("Error al obtener la empresa del operador");
          }

          const employeeData = await userResponse.json();
          companyId = employeeData?.parentCompany?.id;
        }

        if (!companyId) {
          setOrders([]);
          return;
        }

        const allCompanyOrders = await getOrdersByCompanyEmployees(companyId);

        setOrders(allCompanyOrders || []);
      } catch (error) {
        console.error("Error al cargar órdenes de la empresa:", error);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadCompanyOrders();
  }, [userData, authLoading]);

  const loading = authLoading || loadingOrders;

  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-0">
        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <div className="mb-8">
            <Link
              href="/dashboard/company"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-all duration-300 hover:-translate-x-1 hover:underline"
            >
              <ArrowLeft size={18} />
              Volver al dashboard empresa
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <p className="mb-2 font-semibold text-primary">
                Gestión operativa
              </p>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Monitoreo de pedidos
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                Consulta las órdenes asociadas a tu empresa y revisa su estado
                actual.
              </p>
            </div>

            <div className="lg:justify-self-end">
              <AdminMetricCard
                title="Total de órdenes"
                value={orders.length}
                icon={PackageSearch}
                compact
              />
            </div>
          </div>

          <div className="my-8 h-px w-full bg-border" />

          <div>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Órdenes de la empresa
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Información general de los envíos vinculados a tu empresa.
                </p>
              </div>

              <div className="inline-flex w-fit items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
                {orders.length} registro{orders.length !== 1 ? "s" : ""}
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted animate-pulse">
                Cargando órdenes...
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">
                No hay órdenes registradas para esta empresa.
              </div>
            ) : (
              <CompanyOrdersTable
                orders={orders}
                onViewDetails={setSelectedOrder}
              />
            )}
          </div>
        </section>
      </main>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}

function CompanyOrdersTable({
  orders,
  onViewDetails,
}: {
  orders: CompanyApiOrder[];
  onViewDetails: (order: CompanyApiOrder) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted">
      <div className="grid grid-cols-[1.6fr_0.7fr_0.8fr_0.7fr] border-b border-border px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">
        <div>Paquete</div>
        <div>Estado</div>
        <div>Fecha</div>
        <div className="text-right">Acción</div>
      </div>

      <div>
        {orders.map((order) => {
          const pkg = order.package || {};
          const createdAt = order.created_at
            ? new Date(order.created_at).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Sin fecha";

          return (
            <div
              key={order.id}
              className="grid grid-cols-[1.6fr_0.7fr_0.8fr_0.7fr] items-center border-b border-border px-5 py-4 last:border-b-0"
            >
              <div>
                <p className="font-bold text-foreground">
                  {pkg.name || "Sin nombre"}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Código de Seguiminento: {order.tracking_code}
                </p>
              </div>

              <div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${ORDER_STATUS_COLOR[order.status?.toLowerCase()] || "bg-gray-100 text-gray-700"}`}
                >
                  {ORDER_STATUS_LABEL[order.status?.toLowerCase()] ||
                    order.status ||
                    "Pendiente"}
                </span>
              </div>

              <div className="text-sm text-muted">{createdAt}</div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onViewDetails(order)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary"
                >
                  <Eye size={16} />
                  Ver detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderDetailsModal({
  order,
  onClose,
}: {
  order: CompanyApiOrder;
  onClose: () => void;
}) {
  const pkg = order.package || {};
  const dims = pkg.dimensions || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-border bg-surface p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-muted text-muted transition hover:border-primary/40 hover:text-primary"
        >
          <X size={20} />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mb-6 flex items-center gap-2 font-semibold text-primary transition-transform hover:-translate-x-1"
        >
          ← Volver al listado
        </button>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full space-y-6 lg:w-1/3">
            <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-surface-muted">
              <img
                src={
                  pkg.image || "https://via.placeholder.com/400?text=Sin+Imagen"
                }
                className="h-full w-full object-cover"
                alt="Producto"
              />
            </div>
            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 text-center">
              <p className="mb-1 text-sm text-muted">Estado actual</p>
              <p
                className={`text-lg font-bold uppercase tracking-widest ${ORDER_STATUS_COLOR[order.status?.toLowerCase()] || "text-gray-500"}`}
              >
                {ORDER_STATUS_LABEL[order.status?.toLowerCase()] ||
                  order.status}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="pr-10">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-foreground">
                Detalles del Envío
              </h2>
              <p className="break-all font-mono text-muted">ID: {order.id}</p>
              <p className="font-mono text-muted">
                nombre: {pkg.name || "Sin nombre"}
              </p>
              <p className="font-mono text-muted">
                descripcion:{" "}
                {pkg.description
                  ? pkg.description.length > 80
                    ? `${pkg.description.substring(0, 80)}...`
                    : pkg.description
                  : "Sin descripción"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-border bg-surface-muted p-5">
                <h3 className="flex items-center gap-2 font-bold text-primary">
                  📍 Trayecto
                </h3>
                <div>
                  <p className="text-xs uppercase text-muted">
                    Punto de Retiro
                  </p>
                  <p className="font-medium">
                    {order.pickup_direction || "No registrado"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted">
                    Punto de Entrega
                  </p>
                  <p className="font-medium">
                    {order.delivery_direction || "No registrado"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-border bg-surface-muted p-5">
                <h3 className="flex items-center gap-2 font-bold text-primary">
                  📦 Paquete
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase text-muted">Precio</p>
                    <p className="font-medium">$ {order.price || "0.00"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted">Peso</p>
                    <p className="font-medium">
                      {pkg.weight || "1.0"} {pkg.unit || "kg"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted">Dimensiones</p>
                    <p className="font-medium">
                      {dims.width || "0"}x{dims.height || "0"}x
                      {dims.depth || "0"} cm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge
                active={pkg.fragile ?? false}
                label="Frágil"
                color="bg-yellow-500"
              />
              <Badge
                active={pkg.urgent ?? false}
                label="Urgente"
                color="bg-red-500"
              />
              <Badge
                active={pkg.cooled ?? false}
                label="Refrigerado"
                color="bg-blue-500"
              />
              <Badge
                active={pkg.dangerous ?? false}
                label="Peligroso"
                color="bg-orange-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({
  active,
  label,
  color,
}: {
  active: boolean;
  label: string;
  color: string;
}) {
  if (!active) {
    return (
      <span className="rounded-full bg-border px-3 py-1 text-[10px] font-bold uppercase text-muted opacity-30">
        {label}
      </span>
    );
  }
  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase text-white shadow-sm ${color}`}
    >
      {label}
    </span>
  );
}
