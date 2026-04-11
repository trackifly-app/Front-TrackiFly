"use client";
import { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import dynamic from "next/dynamic";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { CATEGORIES } from "@/lib/categories";
import "leaflet/dist/leaflet.css";
import { Map as LeafletMap } from "leaflet";

// Importaciones dinámicas con SSR desactivado para evitar el error "window is not defined"
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false },
);

const COSTO_M3 = 500;
const COSTO_KM = 120;
const RECARGOS = {
  FRAGIL: 0.15,
  PELIGROSO: 0.3,
  REFRIGERADO: 0.2,
  URGENTE: 0.5,
};

const OrderView = () => {
  const [coords, setCoords] = useState<{
    origen: [number, number] | null;
    destino: [number, number] | null;
  }>({ origen: null, destino: null });
  const [L, setL] = useState<typeof import("leaflet") | null>(null); // Estado para cargar Leaflet solo en el cliente
  const [distance, setDistance] = useState(0); //nueva
  const mapRef = useRef<LeafletMap | null>(null);
  const provider = new OpenStreetMapProvider();

  const inputStyle =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#D96B4A] focus:ring-1 focus:ring-[#D96B4A]";

  // Carga Leaflet solo del lado del cliente para evitar el error de Runtime
  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  //useEffect afuera del render de Formik
  useEffect(() => {
    if (coords.origen && coords.destino && L) {
      const d =
        L.latLng(coords.origen).distanceTo(L.latLng(coords.destino)) / 1000;
      setDistance(d);
    }
  }, [coords, L]);

  // Ajuste automático del mapa para que no se vea "corrido"
  useEffect(() => {
    if (mapRef.current && coords.origen && coords.destino && L) {
      const bounds = L.latLngBounds([coords.origen, coords.destino]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coords, L]);

  const handleSearch = async (
    query: string,
    type: "origen" | "destino",
    setFieldValue: FormikHelpers<unknown>["setFieldValue"],
  ) => {
    if (query.length < 4) return;
    const results = await provider.search({ query });
    if (results && results.length > 0) {
      const { y, x, label } = results[0];
      setCoords((prev) => ({ ...prev, [type]: [y, x] }));
      setFieldValue(type === "origen" ? "retry_id" : "delivery_id", label);
    }
  };

  if (!L) return <div className="p-10 text-center">Iniciando Trackifly...</div>;

  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        category_id: "",
        image: "",
        retry_id: "",
        delivery_id: "",
        height: "",
        width: "",
        depth: "",
        unit: "cm", // unit agregada aquí
        fragile: false,
        dangerous: false,
        cooled: false,
        urgent: false,
      }}
      onSubmit={(v) => console.log("Orden lista:", v)}
    >
      {({ values, setFieldValue }) => {
        // Lógica de conversión a m3
        const factor = values.unit === "cm" ? 0.01 : 0.0254;
        const volumenM3 =
          Number(values.height) *
            factor *
            (Number(values.width) * factor) *
            (Number(values.depth) * factor) || 0;
        const precioBase = volumenM3 * COSTO_M3 + distance * COSTO_KM;
        let extra = 0;
        if (values.fragile) extra += RECARGOS.FRAGIL;
        if (values.dangerous) extra += RECARGOS.PELIGROSO;
        if (values.cooled) extra += RECARGOS.REFRIGERADO;
        if (values.urgent) extra += RECARGOS.URGENTE;
        const precioFinal = precioBase * (1 + extra);

        return (
          <main className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-6xl">
              <Form className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
                <div className="space-y-6">
                  {/* Detalles del Producto completo */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 border-b pb-2 text-left">
                      Detalles del Producto
                    </h3>
                    <div className="grid gap-4">
                      <Field
                        name="name"
                        placeholder="Nombre"
                        className={inputStyle}
                      />
                      <Field
                        as="textarea"
                        name="description"
                        placeholder="Descripción..."
                        className={`${inputStyle} h-20`}
                      />
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field
                          as="select"
                          name="category_id"
                          className={inputStyle}
                        >
                          <option value="">Selecciona Categoría...</option>
                          {CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </Field>
                        <Field
                          name="image"
                          placeholder="Imagen URL"
                          className={inputStyle}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Field
                          name="height"
                          placeholder="Altura"
                          type="number"
                          className={inputStyle}
                        />
                        <Field
                          name="width"
                          placeholder="Ancho"
                          type="number"
                          className={inputStyle}
                        />
                        <Field
                          name="depth"
                          placeholder="Profundidad"
                          type="number"
                          className={inputStyle}
                        />
                        {/* Selector de unit integrado sin romper estilos */}
                        <Field
                          as="select"
                          name="unit"
                          className="rounded-xl border border-gray-300 bg-gray-50 px-3 font-bold text-gray-700 outline-none focus:border-primary"
                        >
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </Field>
                      </div>
                    </div>
                  </div>

                  {/* Trayecto y Mapa Lineal */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 border-b pb-2 text-left">
                      Trayecto
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 mb-4">
                      <Field
                        name="retry_id"
                        placeholder="Origen"
                        className={inputStyle}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                          handleSearch(e.target.value, "origen", setFieldValue)
                        }
                      />
                      <Field
                        name="delivery_id"
                        placeholder="Destino"
                        className={inputStyle}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                          handleSearch(e.target.value, "destino", setFieldValue)
                        }
                      />
                    </div>
                    <div className="h-87.5 rounded-xl overflow-hidden">
                      <MapContainer
                        center={[-34.1633, -58.9592]}
                        zoom={12}
                        style={{ height: "100%" }}
                        ref={mapRef}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {coords.origen && (
                          <Marker position={coords.origen} icon={customIcon} />
                        )}
                        {coords.destino && (
                          <Marker position={coords.destino} icon={customIcon} />
                        )}
                        {coords.origen && coords.destino && (
                          <Polyline
                            positions={[coords.origen, coords.destino]}
                            pathOptions={{
                              color: "#D96B4A",
                              weight: 4,
                              dashArray: "8, 12",
                            }}
                          />
                        )}
                      </MapContainer>
                    </div>
                  </div>
                </div>

                {/* Presupuesto con los 4 checks */}
                <aside className="h-fit rounded-2xl bg-[#1a232e] p-8 shadow-xl text-white sticky top-10 text-left">
                  <h2 className="text-xl font-bold mb-6">Presupuesto</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-gray-700 pb-2 text-sm text-gray-400">
                      <span>Trayecto</span>
                      <span>{distance.toFixed(1)} km</span>
                    </div>
                    {/* Agregado volumen para que veas la conversión real */}
                    <div className="flex justify-between border-b border-gray-700 pb-2 text-sm text-gray-400">
                      <span>Volumen</span>
                      <span>{volumenM3.toFixed(4)} m³</span>
                    </div>
                    <div className="pt-4 space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Field type="checkbox" name="fragile" /> Frágil (+15%)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Field type="checkbox" name="dangerous" /> Peligroso
                        (+30%)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Field type="checkbox" name="cooled" /> Refrigerado
                        (+20%)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Field type="checkbox" name="urgent" /> Urgente (+50%)
                      </label>
                    </div>
                    <div className="flex justify-between text-2xl border-t border-gray-700 pt-6 mt-6">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-primary">
                        ${precioFinal.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-8 w-full rounded-xl bg-primary py-4 font-bold text-white hover:bg-[#bf5a3a] transition-all"
                  >
                    Confirmar Envío
                  </button>
                </aside>
              </Form>
            </div>
          </main>
        );
      }}
    </Formik>
  );
};

export default OrderView;
