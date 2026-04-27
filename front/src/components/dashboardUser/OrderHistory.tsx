"use client"
import { useState, useEffect } from "react";
import { ActiveOrder } from "@/types/types"; 
import { useAuth } from "@/context/AuthContext";

export default function OrderHistory() {
  const { userData } = useAuth();
  const [history, setHistory] = useState<ActiveOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userData?.user?.id) return;
      try {
        setLoading(true);
        const response = await fetch(
          `https://back-trackifly-production.up.railway.app/orders?userId=${userData.user.id}`
        );
        if (!response.ok) throw new Error("Error al obtener el historial");
        const data: ActiveOrder[] = await response.json();
        
        // Filtramos para mostrar solo los estados finales
        const filtered = data.filter(order => 
          order.status.toLowerCase() === "completed" || 
          order.status.toLowerCase() === "cancelled"
        );
        
        setHistory(filtered);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userData?.user?.id]);

  if (loading) return <div className="p-6 text-center text-muted italic">Cargando historial...</div>;

  // --- VISTA DE DETALLE (Idéntica a ActiveOrders) ---
  if (selectedOrder) {
    const pkg = selectedOrder.package || {};
    const dims = pkg.dimensions || {};

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
                src={pkg.image || 'https://via.placeholder.com/400?text=Sin+Imagen'} 
                className="w-full h-full object-cover" 
                alt="Producto"
              />
            </div>
            <div className={`p-4 rounded-2xl border text-center ${
              selectedOrder.status.toLowerCase() === 'completed' 
                ? 'bg-green-500/5 border-green-500/10' 
                : 'bg-red-500/5 border-red-500/10'
            }`}>
              <p className="text-sm text-muted mb-1">Estado final</p>
              <p className={`text-lg font-bold uppercase tracking-widest ${
                selectedOrder.status.toLowerCase() === 'completed' ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedOrder.status}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">Resumen del Pedido</h2>
              <p className="text-muted font-mono">ID: {selectedOrder.id}</p>
              <p className="text-muted font-mono font-bold">Producto: {pkg.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 bg-surface-muted p-5 rounded-2xl border border-border">
                <h3 className="font-bold text-primary flex items-center gap-2">📍 Ruta Finalizada</h3>
                <div>
                  <p className="text-xs text-muted uppercase">Origen</p>
                  <p className="font-medium">{selectedOrder.pickup_direction}</p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase">Destino</p>
                  <p className="font-medium">{selectedOrder.delivery_direction}</p>
                </div>
              </div>

              <div className="space-y-3 bg-surface-muted p-5 rounded-2xl border border-border">
                <h3 className="font-bold text-primary flex items-center gap-2">📦 Datos del Paquete</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted uppercase">Costo Total</p>
                    <p className="font-medium">$ {selectedOrder.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase">Peso</p>
                    <p className="font-medium">{pkg.weight || "1.0"} {pkg.unit || "kg"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge active={pkg.fragile} label="Frágil" color="bg-yellow-500" />
              <Badge active={pkg.urgent} label="Urgente" color="bg-red-500" />
              <Badge active={pkg.cooled} label="Refrigerado" color="bg-blue-500" />
              <Badge active={pkg.dangerous} label="Peligroso" color="bg-orange-600" />
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
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Historial de pedidos</h2>
        <span className="bg-surface-muted text-muted text-sm font-semibold px-4 py-1.5 rounded-full">
          {history.length} registros
        </span>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="bg-surface-muted border border-dashed border-border rounded-2xl p-10 text-center text-muted">
            Tu historial está vacío por ahora.
          </div>
        ) : (
          history.map((order: any) => (
            <div key={order.id} className="border border-border rounded-2xl p-5 bg-surface-muted hover:border-primary/30 transition-colors group">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-border bg-surface shrink-0 grayscale group-hover:grayscale-0 transition-all">
                    <img 
                      src={order.package?.image || 'https://via.placeholder.com/120'} 
                      alt="Producto" 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-widest font-bold">Código</p>
                      <p className="font-bold text-foreground">{order.tracking_code}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-widest font-bold">Destino</p>
                      <p className="text-sm truncate">{order.delivery_direction}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-md uppercase ${
                    order.status.toLowerCase() === 'completed' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {order.status}
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

// Badge auxiliar (debes tenerlo definido o importarlo)
function Badge({ active, label, color }: { active: boolean, label: string, color: string }) {
  if (!active) return <span className="px-3 py-1 rounded-full bg-border text-muted text-[10px] uppercase font-bold opacity-30">{label}</span>;
  return <span className={`px-3 py-1 rounded-full ${color} text-white text-[10px] uppercase font-bold shadow-sm`}>{label}</span>;
}
