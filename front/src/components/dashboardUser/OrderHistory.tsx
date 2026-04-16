type HistoryOrder = {
  id: string;
  trackingCode: string;
  deliveredDate: string;
  destination: string;
  status: string;
};

type OrderHistoryProps = {
  orders: HistoryOrder[];
};

export default function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Historial de pedidos</h2>
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 text-sm font-semibold px-3 py-1 rounded-full">{orders.length} entregados</span>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-gray-50 dark:bg-slate-950 border border-dashed border-gray-300 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-500 dark:text-slate-400">Aún no tienes pedidos finalizados.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border border-gray-200 dark:border-slate-800 rounded-2xl p-5 bg-gray-50 dark:bg-slate-950">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Código de seguimiento</p>
                  <p className="font-semibold text-slate-800 dark:text-white">{order.trackingCode}</p>
                </div>

                <span className="w-fit bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-sm font-medium px-3 py-1 rounded-full">{order.status}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Destino</p>
                  <p className="text-slate-800 dark:text-white font-medium">{order.destination}</p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400">Fecha de entrega</p>
                  <p className="text-slate-800 dark:text-white font-medium">{order.deliveredDate}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
