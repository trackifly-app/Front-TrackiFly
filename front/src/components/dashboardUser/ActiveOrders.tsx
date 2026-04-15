type ActiveOrder = {
  id: string;
  trackingCode: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  image?: string;
};

type ActiveOrdersProps = {
  orders: ActiveOrder[];
};

export default function ActiveOrders({ orders }: ActiveOrdersProps) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Pedidos en camino</h2>
        <span className="bg-orange-100 text-orange-600 text-sm font-semibold px-3 py-1 rounded-full">
          {orders.length} activos
        </span>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-6 text-center text-slate-500">
            No tienes pedidos en camino por ahora.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-2xl p-5 bg-gray-50"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-white shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={order.image || "https://via.placeholder.com/120"}
                      alt="Producto"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="mb-4">
                      <p className="text-sm text-slate-500">Código de seguimiento</p>
                      <p className="font-semibold text-slate-800">{order.trackingCode}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Origen</p>
                        <p className="text-slate-800 font-medium">{order.origin}</p>
                      </div>

                      <div>
                        <p className="text-slate-500">Destino</p>
                        <p className="text-slate-800 font-medium">{order.destination}</p>
                      </div>

                      <div>
                        <p className="text-slate-500">Entrega estimada</p>
                        <p className="text-slate-800 font-medium">
                          {order.estimatedDelivery}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <span className="w-fit bg-orange-500 text-white text-sm font-medium px-3 py-1 rounded-full self-start md:self-center">
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}