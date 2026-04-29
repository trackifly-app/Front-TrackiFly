"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

type DateFilter = "1h" | "1d" | "7d" | "1m" | "historic";

type ReportesData = {
  totalUsers: number;
  previousUsers: number;
  totalCompanies: number;
  previousCompanies: number;
  orders: {
    delivered: number;
    started: number;
    canceled: number;
  };
  previousOrders: {
    delivered: number;
    started: number;
    canceled: number;
  };
  usersPerPeriod: number[];
  companiesPerPeriod: number[];
  labels: string[];
};

function calculateGrowth(current: number, previous: number) {
  if (previous === 0) return 0;

  return Math.round(((current - previous) / previous) * 100);
}

function formatGrowth(value: number) {
  return value >= 0 ? `+${value}%` : `${value}%`;
}

function getGrowthColor(value: number) {
  return value >= 0 ? "text-green-600" : "text-red-500";
}

function getGrowthBadgeColor(value: number) {
  return value >= 0
    ? "bg-green-500/10 text-green-600"
    : "bg-red-500/10 text-red-500";
}

function getStatus(value: number) {
  if (value > 0) return "Positivo";
  if (value === 0) return "Neutral";
  return "Negativo";
}

function getStatusColor(value: number) {
  if (value > 0) return "bg-green-500/10 text-green-600";
  if (value === 0) return "bg-yellow-500/10 text-yellow-500";
  return "bg-red-500/10 text-red-500";
}

export default function ReportesPage() {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState<DateFilter>("1m");
  const [data, setData] = useState<ReportesData | null>(null);
  const [dailyData, setDailyData] = useState<ReportesData | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReportes() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!baseUrl) {
          throw new Error("NEXT_PUBLIC_API_URL no está configurada");
        }

        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const headers: HeadersInit = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const [currentResponse, dailyResponse] = await Promise.all([
          fetch(`${baseUrl}/admin/reportes?filter=${dateFilter}`, {
            method: "GET",
            headers,
            credentials: "include",
            signal: controller.signal,
          }),
          fetch(`${baseUrl}/admin/reportes?filter=1d`, {
            method: "GET",
            headers,
            credentials: "include",
            signal: controller.signal,
          }),
        ]);

        if (!currentResponse.ok) {
          throw new Error("No se pudieron cargar los reportes");
        }

        if (!dailyResponse.ok) {
          throw new Error("No se pudieron cargar las variaciones diarias");
        }

        const currentJson = (await currentResponse.json()) as ReportesData;
        const dailyJson = (await dailyResponse.json()) as ReportesData;

        setData(currentJson);
        setDailyData(dailyJson);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Error cargando reportes:", error);
        setData(null);
        setDailyData(null);
      }
    }

    loadReportes();

    return () => controller.abort();
  }, [dateFilter]);

  const currentData = data;

  const totalUsers = currentData?.totalUsers ?? 0;
  const totalCompanies = currentData?.totalCompanies ?? 0;

  const totalOrders = currentData
    ? currentData.orders.delivered +
      currentData.orders.started +
      currentData.orders.canceled
    : 0;

  // Variaciones diarias fijas.
  // Siempre se calculan con filter=1d, no con el filtro seleccionado.
  const usersGrowth = dailyData
    ? calculateGrowth(dailyData.totalUsers, dailyData.previousUsers)
    : 0;

  const ordersGrowth = dailyData
    ? calculateGrowth(
        dailyData.orders.delivered +
          dailyData.orders.started +
          dailyData.orders.canceled,
        dailyData.previousOrders.delivered +
          dailyData.previousOrders.started +
          dailyData.previousOrders.canceled
      )
    : 0;

  const companiesGrowth = dailyData
    ? calculateGrowth(dailyData.totalCompanies, dailyData.previousCompanies)
    : 0;

  const hasData = totalUsers > 0 || totalCompanies > 0 || totalOrders > 0;

  const usersChartData = useMemo(
    () => ({
      labels: currentData?.labels ?? [],
      datasets: [
        {
          label: "Usuarios suscriptos",
          data: currentData?.usersPerPeriod ?? [],
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.14)",
          pointBackgroundColor: "#2563eb",
          pointBorderColor: "#ffffff",
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.35,
          fill: true,
        },
      ],
    }),
    [currentData]
  );

  const ordersChartData = useMemo(
    () => ({
      labels: ["Entregados", "Iniciados", "Cancelados"],
      datasets: [
        {
          label: "Pedidos",
          data: [
            currentData?.orders.delivered ?? 0,
            currentData?.orders.started ?? 0,
            currentData?.orders.canceled ?? 0,
          ],
          backgroundColor: ["#22c55e", "#f97316", "#ef4444"],
          borderColor: ["#16a34a", "#ea580c", "#dc2626"],
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    }),
    [currentData]
  );

  const companiesChartData = useMemo(
    () => ({
      labels: currentData?.labels ?? [],
      datasets: [
        {
          label: "Empresas suscriptas",
          data: currentData?.companiesPerPeriod ?? [],
          backgroundColor: "rgba(168, 85, 247, 0.75)",
          hoverBackgroundColor: "rgba(168, 85, 247, 0.95)",
          borderRadius: 8,
          maxBarThickness: 36,
        },
      ],
    }),
    [currentData]
  );

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 900,
      easing: "easeOutQuart" as const,
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 16,
        },
      },
    },
  };

  const axisOptions = {
    ...commonOptions,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: dateFilter === "1m" ? 8 : 7,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.18)",
        },
      },
    },
  };

  const pieOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 14,
        },
      },
    },
  };

  const summaryRows = [
    {
      metric: "Usuarios suscriptos",
      total: totalUsers,
      variation: formatGrowth(usersGrowth),
      status: getStatus(usersGrowth),
      color: "text-blue-600",
      variationColor: getGrowthColor(usersGrowth),
      statusColor: getStatusColor(usersGrowth),
    },
    {
      metric: "Pedidos totales",
      total: totalOrders,
      variation: formatGrowth(ordersGrowth),
      status: getStatus(ordersGrowth),
      color: "text-green-600",
      variationColor: getGrowthColor(ordersGrowth),
      statusColor: getStatusColor(ordersGrowth),
    },
    {
      metric: "Empresas suscriptas",
      total: totalCompanies,
      variation: formatGrowth(companiesGrowth),
      status: getStatus(companiesGrowth),
      color: "text-purple-600",
      variationColor: getGrowthColor(companiesGrowth),
      statusColor: getStatusColor(companiesGrowth),
    },
  ];

  return (
    <main className="p-6 md:p-8">
      <button
        type="button"
        onClick={() => router.push("/dashboard/admin")}
        className="mb-6 rounded-xl bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary/80"
      >
        ← Volver
      </button>

      <section className="rounded-3xl border border-border bg-surface p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
            <p className="mt-2 text-sm text-muted">
              Métricas generales de usuarios, pedidos y empresas.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-muted">
                Filtrar por fecha
              </label>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="rounded-xl border border-border bg-surface-muted px-4 py-2 text-foreground outline-none transition focus:border-primary"
              >
                <option value="1h">Última hora</option>
                <option value="1d">Último día</option>
                <option value="7d">Última semana</option>
                <option value="1m">Último mes</option>
                <option value="historic">Histórico</option>
              </select>
            </div>
          </div>
        </div>

        {!hasData ? (
          <div className="mt-8 rounded-2xl border border-border bg-surface-muted p-10 text-center">
            <h2 className="text-xl font-bold text-foreground">
              No hay datos para este período
            </h2>
            <p className="mt-2 text-sm text-muted">
              Probá seleccionando otro filtro de fecha.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="min-h-[130px] rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
                <p className="text-sm font-medium text-muted">Usuarios</p>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <h2 className="text-3xl font-bold text-blue-600">
                    {totalUsers}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getGrowthBadgeColor(
                      usersGrowth
                    )}`}
                  >
                    {formatGrowth(usersGrowth)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">Usuarios suscritos</p>
              </div>

              <div className="min-h-[130px] rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
                <p className="text-sm font-medium text-muted">Pedidos</p>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <h2 className="text-3xl font-bold text-green-600">
                    {totalOrders}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getGrowthBadgeColor(
                      ordersGrowth
                    )}`}
                  >
                    {formatGrowth(ordersGrowth)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">
                  Entregados, iniciados y cancelados
                </p>
              </div>

              <div className="min-h-[130px] rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
                <p className="text-sm font-medium text-muted">Empresas</p>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <h2 className="text-3xl font-bold text-purple-600">
                    {totalCompanies}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getGrowthBadgeColor(
                      companiesGrowth
                    )}`}
                  >
                    {formatGrowth(companiesGrowth)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">Empresas suscritas</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface-muted p-5">
                <h3 className="mb-4 font-bold text-foreground">
                  Usuarios suscriptos
                </h3>

                <div className="h-[280px]">
                  <Line data={usersChartData} options={axisOptions} />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface-muted p-5">
                <h3 className="mb-4 text-center font-bold text-foreground">
                  Estado de pedidos
                </h3>

                <div className="mx-auto h-[250px] max-w-[250px]">
                  <Pie data={ordersChartData} options={pieOptions} />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface-muted p-5">
                <h3 className="mb-4 font-bold text-foreground">
                  Empresas suscriptas
                </h3>

                <div className="h-[280px]">
                  <Bar data={companiesChartData} options={axisOptions} />
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-surface-muted p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-bold text-foreground">Resumen diario</h3>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600">
                  Métricas calculadas
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted">
                      <th className="py-3 font-semibold">Métrica</th>
                      <th className="py-3 font-semibold">Total</th>
                      <th className="py-3 font-semibold">Variación diaria</th>
                      <th className="py-3 font-semibold">Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {summaryRows.map((row) => (
                      <tr
                        key={row.metric}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="py-3 font-medium text-foreground">
                          {row.metric}
                        </td>
                        <td className={`py-3 font-bold ${row.color}`}>
                          {row.total}
                        </td>
                        <td
                          className={`py-3 font-semibold ${row.variationColor}`}
                        >
                          {row.variation}
                        </td>
                        <td className="py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${row.statusColor}`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}