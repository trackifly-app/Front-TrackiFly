"use client";
import { useState } from "react";
import { ActiveOrder } from "@/types/types";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
} from "@/constants/orderStatus";

export default function OrderHistory({ orders }: { orders: ActiveOrder[] }) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  if (selectedOrder) {
    const pkg = selectedOrder.package || {};

    return (
      <section className="bg-surface rounded-3xl shadow-sm border border-border p-8 animate-in fade-in duration-500">
        <button
          onClick={() => setSelectedOrder(null)}
          className="mb-6 text-primary font-semibold flex items-center gap-2 hover:translate-x-1 transition-transform"
        >
          ← Volver al historial
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
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
            <div className="p-4 rounded-2xl border text-center bg-surface-muted">
              <p className="text-sm text-muted mb-1">Estado final</p>
              <p
                className={`text-lg font-bold uppercase tracking-widest ${
                  ORDER_STATUS_COLOR[selectedOrder.status?.toLowerCase()] ||
                  "text-gray-500"
                }`}
              >
                {ORDER_STATUS_LABEL[selectedOrder.status?.toLowerCase()] ||
                  selectedOrder.status}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">
                Resumen del Pedido
              </h2>
              <p className="text-muted font-mono">ID: {selectedOrder.id}</p>
              <p className="text-muted font-mono font-bold">
                Producto: {pkg.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 bg-surface-muted p-5 rounded-2xl border border-border">
                <h3 className="font-bold text-primary">📍 Ruta Finalizada</h3>
                <div>
                  <p className="text-xs text-muted uppercase">Origen</p>
                  <p className="font-medium">
                    {selectedOrder.pickup_direction}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase">Destino</p>
                  <p className="font-medium">
                    {selectedOrder.delivery_direction}
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-surface-muted p-5 rounded-2xl border border-border">
                <h3 className="font-bold text-primary">📦 Datos del Paquete</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted uppercase">Costo Total</p>
                    <p className="font-medium">$ {selectedOrder.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase">Peso</p>
                    <p className="font-medium">
                      {pkg.weight || "1.0"} {pkg.unit || "kg"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

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

  return (
    <section className="bg-surface rounded-3xl shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Historial de pedidos
        </h2>
        <span className="bg-surface-muted text-muted text-sm font-semibold px-4 py-1.5 rounded-full">
          {orders.length} registros
        </span>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-surface-muted border border-dashed border-border rounded-2xl p-10 text-center text-muted">
            Tu historial está vacío por ahora.
          </div>
        ) : (
          orders.map((order: any) => (
            <div
              key={order.id}
              className="border border-border rounded-2xl p-5 bg-surface-muted hover:border-primary/30 transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-border bg-surface shrink-0 grayscale group-hover:grayscale-0 transition-all">
                    <img
                      src={
                        order.package?.image ||
                        "https://via.placeholder.com/120"
                      }
                      alt="Producto"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
                        Código
                      </p>
                      <p className="font-bold text-foreground">
                        {order.tracking_code}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
                        Destino
                      </p>
                      <p className="text-sm truncate">
                        {order.delivery_direction}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`text-[10px] font-black px-3 py-1 rounded-md uppercase ${
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
                    Ver detalles del historial
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
