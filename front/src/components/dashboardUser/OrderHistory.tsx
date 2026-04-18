import { OrderHistoryProps } from "@/types/types";


export default function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <section className="bg-surface rounded-3xl shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Historial de pedidos</h2>

        <span className="bg-surface-muted text-muted text-sm font-semibold px-3 py-1 rounded-full">{orders.length} entregados</span>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-surface-muted border border-dashed border-border rounded-2xl p-6 text-center text-muted">Aún no tienes pedidos finalizados.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border border-border rounded-2xl p-5 bg-surface-muted">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-muted">Código de seguimiento</p>
                  <p className="font-semibold text-foreground">{order.trackingCode}</p>
                </div>

                <span className="w-fit bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">{order.status}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted">Destino</p>
                  <p className="text-foreground font-medium">{order.destination}</p>
                </div>

                <div>
                  <p className="text-muted">Fecha de entrega</p>
                  <p className="text-foreground font-medium">{order.deliveredDate}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
