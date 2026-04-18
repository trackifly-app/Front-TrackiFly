import { ActiveOrdersProps } from "@/types/types";


export default function ActiveOrders({ orders }: ActiveOrdersProps) {
  return (
    <section className="bg-surface rounded-3xl shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Pedidos en camino</h2>

        <span className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">{orders.length} activos</span>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-surface-muted border border-dashed border-border rounded-2xl p-6 text-center text-muted">No tienes pedidos en camino por ahora.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border border-border rounded-2xl p-5 bg-surface-muted">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-border bg-surface shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={order.image || 'https://via.placeholder.com/120'} alt="Producto" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1">
                    <div className="mb-4">
                      <p className="text-sm text-muted">Código de seguimiento</p>
                      <p className="font-semibold text-foreground">{order.trackingCode}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted">Origen</p>
                        <p className="text-foreground font-medium">{order.origin}</p>
                      </div>

                      <div>
                        <p className="text-muted">Destino</p>
                        <p className="text-foreground font-medium">{order.destination}</p>
                      </div>

                      <div>
                        <p className="text-muted">Entrega estimada</p>
                        <p className="text-foreground font-medium">{order.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <span className="w-fit bg-primary text-white text-sm font-medium px-3 py-1 rounded-full self-start md:self-center">{order.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
