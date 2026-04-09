import UserProfileCard from "@/components/dashboardUser/UserProfileCard";
import ActiveOrders from "@/components/dashboardUser/ActiveOrders";
import OrderHistory from "@/components/dashboardUser/OrderHistory";

export default function DashboardUserPage() {
  const user = {
    email: "miguel@gmail.com",
    name: "Miguel RV",
    address: "Av. Los Ángeles 245, Arequipa",
    phone: "987654321",
    birthDate: "15/08/1995",
    gender: "Masculino",
    country: "Perú",
  };

  const activeOrders = [
    {
      id: "1",
      trackingCode: "TRK-458721",
      status: "En camino",
      origin: "Arequipa",
      destination: "Cusco",
      estimatedDelivery: "10/04/2026",
    },
    {
      id: "2",
      trackingCode: "TRK-458722",
      status: "Preparando envío",
      origin: "Lima",
      destination: "Arequipa",
      estimatedDelivery: "12/04/2026",
    },
  ];

  const orderHistory = [
    {
      id: "1",
      trackingCode: "TRK-452100",
      deliveredDate: "02/04/2026",
      destination: "Puno",
      status: "Entregado",
    },
    {
      id: "2", 
      trackingCode: "TRK-451890",
      deliveredDate: "28/03/2026",
      destination: "Tacna",
      status: "Entregado",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-10 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-orange-500 font-semibold mb-2">Dashboard de usuario</p>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                Bienvenido, {user.name}
              </h1>
              <p className="text-slate-500 mt-2">
                Aquí puedes revisar tu información, tus pedidos en camino y tu historial.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4">
              <p className="text-sm text-slate-500">Pedidos activos</p>
              <p className="text-3xl font-bold text-orange-500">{activeOrders.length}</p>
            </div>
          </div>
        </section>

        <UserProfileCard user={user} />

        <ActiveOrders orders={activeOrders} />

        <OrderHistory orders={orderHistory} />
      </div>
    </main>
  );
}