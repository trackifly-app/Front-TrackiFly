"use client";
import { useState } from "react";
import { ActiveOrder, ActiveOrdersProps } from "@/types/types";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
  FINAL_ORDER_STATUSES,
} from "@/constants/orderStatus";

export default function ActiveOrders({
  orders: initialOrders,
}: ActiveOrdersProps) {
  const activeOrders = (initialOrders || []).filter(
    (o) => !FINAL_ORDER_STATUSES.includes(o.status.toLowerCase()),
  );

  const [orders] = useState<ActiveOrder[]>(activeOrders);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // --- VISTA DE DETALLE MOCKEADA ---
  if (selectedOrder) {
    const pkg = selectedOrder.package || {};
    const dims = pkg.dimensions || {};

    return (
      <section className="bg-surface rounded-3xl shadow-sm border border-border p-8 animate-in fade-in duration-500">
        <button
          onClick={() => setSelectedOrder(null)}
          className="mb-6 text-primary font-semibold flex items-center gap-2 hover:translate-x-1 transition-transform"
        >
          ← Volver al listado
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna Izquierda: Imagen y Estado */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden border border-border bg-surface-muted">
              <img
                src={
                  pkg.image || "https://via.placeholder.com/400?text=Sin+Imagen"
                }
                className="w-full h-full object-cover"
                alt="Producto"
              />
            </div>
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-center">
              <p className="text-sm text-muted mb-1">Estado actual</p>
              <p
                className={`text-lg font-bold uppercase tracking-widest ${ORDER_STATUS_COLOR[selectedOrder.status?.toLowerCase()] || "text-gray-500"}`}
              >
                {ORDER_STATUS_LABEL[selectedOrder.status?.toLowerCase()] ||
                  selectedOrder.status}
              </p>
            </div>
          </div>

          {/* Columna Derecha: Información detallada */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">
                Detalles del Envío
              </h2>
              <p className="text-muted font-mono">ID: {selectedOrder.id}</p>
              <p className="text-muted font-mono">nombre: {pkg.name}</p>
              <p className="text-muted font-mono">
                descripcion del producto:{" "}
                {pkg.description?.length > 15
                  ? `${pkg.description.substring(0, 15)}...`
                  : pkg.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ruta */}
              <div className="space-y-3 bg-surface-muted p-5 rounded-2xl border border-border">
                <h3 className="font-bold text-primary flex items-center gap-2">
                  📍 Trayecto
                </h3>
                <div>
                  <p className="text-xs text-muted uppercase">
                    Punto de Retiro
                  </p>
                  <p className="font-medium">
                    {selectedOrder.pickup_direction}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase">
                    Punto de Entrega
                  </p>
                  <p className="font-medium">
                    {selectedOrder.delivery_direction}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase">Distancia</p>
                  <p className="font-medium">
                    {selectedOrder.distance || "Calculando..."} km
                  </p>
                </div>
              </div>

              {/* Especificaciones del Paquete */}
              <div className="space-y-3 bg-surface-muted p-5 rounded-2xl border border-border">
                <h3 className="font-bold text-primary flex items-center gap-2">
                  📦 Paquete
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted uppercase">
                      Precio del envio
                    </p>
                    <p className="font-medium">$ {selectedOrder.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase">Peso</p>
                    <p className="font-medium">
                      {pkg.weight || "1.0"} {pkg.unit || "kg"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted uppercase">Dimensiones</p>
                    <p className="font-medium">
                      {dims.width || "0"}x{dims.height || "0"}x
                      {dims.depth || "0"} cm
                    </p>
                  </div>
                  <br />
                  <div>
                    <p className="text-xs text-muted uppercase">Categoría</p>
                    <p className="font-medium">{pkg.category || "General"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Etiquetas Especiales Mockeadas */}
            <div className="flex flex-wrap gap-3">
              <Badge
                active={pkg.fragile}
                label="Frágil"
                color="bg-yellow-500"
              />
              <Badge active={pkg.urgent} label="Urgente" color="bg-red-500" />
              <Badge
                active={pkg.cooled}
                label="Refrigerado"
                color="bg-blue-500"
              />
              <Badge
                active={pkg.dangerous}
                label="Peligroso"
                color="bg-orange-600"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- VISTA DE LISTA ---
  return (
    <section className="bg-surface rounded-3xl shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Pedidos en camino
        </h2>
        <span className="bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
          {orders.length} activos
        </span>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-surface-muted border border-dashed border-border rounded-2xl p-10 text-center text-muted">
            No tienes pedidos en camino por ahora.
          </div>
        ) : (
          orders.map((order: any) => (
            <div
              key={order.id}
              className="border border-border rounded-2xl p-5 bg-surface-muted hover:border-primary/30 transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-border bg-surface shrink-0">
                    <img
                      src={
                        order.package?.image ||
                        "https://via.placeholder.com/120"
                      }
                      alt="Producto"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
                        Seguimiento
                      </p>
                      <p className="font-bold text-foreground">
                        {order.tracking_code}
                      </p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
                        Ruta
                      </p>
                      <p className="text-sm truncate w-full">
                        {order.pickup_direction} → {order.delivery_direction}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`w-fit text-[10px] font-black px-3 py-1 rounded-md uppercase ${
                      ORDER_STATUS_COLOR[order.status?.toLowerCase()] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {ORDER_STATUS_LABEL[order.status?.toLowerCase()] ||
                      order.status}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Detalles completos
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// Sub-componente auxiliar para los badges
function Badge({
  active,
  label,
  color,
}: {
  active: boolean;
  label: string;
  color: string;
}) {
  if (!active)
    return (
      <span className="px-3 py-1 rounded-full bg-border text-muted text-[10px] uppercase font-bold opacity-30">
        {label}
      </span>
    );
  return (
    <span
      className={`px-3 py-1 rounded-full ${color} text-white text-[10px] uppercase font-bold shadow-sm`}
    >
      {label}
    </span>
  );
}
