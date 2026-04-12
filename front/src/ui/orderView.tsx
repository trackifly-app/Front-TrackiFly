"use client";
import { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import dynamic from "next/dynamic";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { CATEGORIES } from "@/lib/categories";
import "leaflet/dist/leaflet.css";
import { Map as LeafletMap } from "leaflet";
import { useRouter } from "next/navigation";
import { validateShipment } from "@/lib/validates";
import { OrderFormValues } from "@/types/types";

// Importaciones dinámicas con SSR desactivado
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
  const router = useRouter();
  const [coords, setCoords] = useState<{
    origen: [number, number] | null;
    destino: [number, number] | null;
  }>({ origen: null, destino: null });
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [distance, setDistance] = useState(0);
  const mapRef = useRef<LeafletMap | null>(null);
  const provider = new OpenStreetMapProvider();

  const inputStyle =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  useEffect(() => {
    import("leaflet").then((leaflet) => setL(leaflet));
  }, []);

  useEffect(() => {
    if (coords.origen && coords.destino && L) {
      const d =
        L.latLng(coords.origen).distanceTo(L.latLng(coords.destino)) / 1000;
      setDistance(d);
    }
  }, [coords, L]);

  useEffect(() => {
    if (mapRef.current && coords.origen && coords.destino && L) {
      const bounds = L.latLngBounds([coords.origen, coords.destino]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coords, L]);

  const handleSearch = async (
    query: string,
    type: "origen" | "destino",
    setFieldValue: FormikHelpers<OrderFormValues>["setFieldValue"],
    setFieldTouched: FormikHelpers<OrderFormValues>["setFieldTouched"],
    setFieldError: FormikHelpers<OrderFormValues>["setFieldError"],
  ) => {
    if (query.length < 4) return;
    try {
      const results = await provider.search({ query });
      if (results && results.length > 0) {
        const { y, x, label } = results[0];
        setCoords((prev) => ({ ...prev, [type]: [y, x] }));
        const fieldName =
          type === "origen" ? "pickup_direction" : "delivery_direction";
        setFieldValue(fieldName, label);
        setFieldTouched(fieldName, true);
      } else {
        const fieldName =
          type === "origen" ? "pickup_direction" : "delivery_direction";
        setFieldError(fieldName, "Dirección no encontrada, intentá con otra");
      }
    } catch (error) {
      console.error("Error buscando dirección:", error);
    }
  };

  if (!L)
    return (
      <div className="p-10 text-center font-bold text-primary">
        Iniciando Trackifly...
      </div>
    );

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
        pickup_direction: "",
        delivery_direction: "",
        weight: "",
        height: "",
        width: "",
        depth: "",
        unit: "cm",
        fragile: false,
        dangerous: false,
        cooled: false,
        urgent: false,
      }}
      validate={(values) => {
        const shipmentValues = {
          ...values,
          height: Number(values.height) || 0,
          width: Number(values.width) || 0,
          depth: Number(values.depth) || 0,
          weight: Number(values.weight) || 0,
        };
        const errors = validateShipment(shipmentValues);
        // Reforzamos la obligatoriedad de los campos clave
        if (!values.image) errors.image = "La imagen es obligatoria";
        if (!values.category_id)
          errors.category_id = "Seleccioná una categoría";
        if (!values.weight) errors.weight = "El peso es obligatorio";
        if (!values.height) errors.height = "Requerido";
        if (!values.width) errors.width = "Requerido";
        if (!values.depth) errors.depth = "Requerido";
        return errors;
      }}
      onSubmit={async (values) => {
        console.log("Orden válida, enviando:", values);
        router.push("/dashboard/user");
      }}
    >
      {({
        values,
        setFieldValue,
        setFieldTouched,
        setFieldError,
        errors,
        touched,
        isSubmitting,
      }) => {
        const factor = values.unit === "cm" ? 0.01 : 0.0254;
        const volumenM3 =
          Number(values.height) *
            factor *
            (Number(values.width) * factor) *
            (Number(values.depth) * factor) || 0;
        const precioBase = volumenM3 * COSTO_M3 + distance * COSTO_KM;

        // Recargo por peso: +5% cada 2kg extra (base 2kg)
        let recargoPeso = 0;
        const pesoNum = Number(values.weight) || 0;
        if (pesoNum > 2) {
          const bloquesExtras = Math.floor((pesoNum - 2) / 2);
          recargoPeso = bloquesExtras * 0.05;
        }

        let extraServicios = 0;
        if (values.fragile) extraServicios += RECARGOS.FRAGIL;
        if (values.dangerous) extraServicios += RECARGOS.PELIGROSO;
        if (values.cooled) extraServicios += RECARGOS.REFRIGERADO;
        if (values.urgent) extraServicios += RECARGOS.URGENTE;

        const precioFinal = precioBase * (1 + extraServicios + recargoPeso);

        return (
          <main className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-6xl">
              <Form className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
                <div className="space-y-6">
                  {/* DETALLES DEL PRODUCTO */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 border-b pb-2 text-left">
                      Detalles del Producto
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <Field
                          name="name"
                          placeholder="Nombre"
                          className={inputStyle}
                        />
                        {errors.name && touched.name && (
                          <p className="text-red-500 text-[10px] mt-1 text-left">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <Field
                        as="textarea"
                        name="description"
                        placeholder="Descripción..."
                        className={`${inputStyle} h-20`}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
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
                          {errors.category_id && touched.category_id && (
                            <p className="text-red-500 text-[10px] mt-1 text-left">
                              {errors.category_id}
                            </p>
                          )}
                        </div>
                        <div>
                          <Field
                            name="image"
                            placeholder="Imagen URL"
                            className={inputStyle}
                          />
                          {errors.image && touched.image && (
                            <p className="text-red-500 text-[10px] mt-1 text-left">
                              {errors.image}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Field
                            name="height"
                            placeholder="Altura"
                            type="number"
                            className={inputStyle}
                          />
                          {errors.height && touched.height && (
                            <p className="text-red-500 text-[10px] mt-1">
                              {errors.height}
                            </p>
                          )}
                        </div>
                        <div className="flex-1">
                          <Field
                            name="width"
                            placeholder="Ancho"
                            type="number"
                            className={inputStyle}
                          />
                          {errors.width && touched.width && (
                            <p className="text-red-500 text-[10px] mt-1">
                              {errors.width}
                            </p>
                          )}
                        </div>
                        <div className="flex-1">
                          <Field
                            name="depth"
                            placeholder="Profundidad"
                            type="number"
                            className={inputStyle}
                          />
                          {errors.depth && touched.depth && (
                            <p className="text-red-500 text-[10px] mt-1">
                              {errors.depth}
                            </p>
                          )}
                        </div>
                        <Field
                          as="select"
                          name="unit"
                          className="rounded-xl border border-gray-300 bg-gray-50 px-3 font-bold text-gray-700 outline-none h-12.5"
                        >
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </Field>
                      </div>

                      <div>
                        <Field
                          name="weight"
                          placeholder="Peso (kg)"
                          type="number"
                          className={inputStyle}
                        />
                        {errors.weight && touched.weight && (
                          <p className="text-red-500 text-[10px] mt-1 text-left">
                            {errors.weight}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* TRAYECTO */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 border-b pb-2 text-left">
                      Trayecto
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 mb-4">
                      <div>
                        <Field
                          name="pickup_direction"
                          placeholder="Origen"
                          className={inputStyle}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                            handleSearch(
                              e.target.value,
                              "origen",
                              setFieldValue,
                              setFieldTouched,
                              setFieldError,
                            )
                          }
                        />
                        {errors.pickup_direction &&
                          touched.pickup_direction && (
                            <p className="text-red-500 text-[10px] mt-1 text-left">
                              {errors.pickup_direction}
                            </p>
                          )}
                      </div>
                      <div>
                        <Field
                          name="delivery_direction"
                          placeholder="Destino"
                          className={inputStyle}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                            handleSearch(
                              e.target.value,
                              "destino",
                              setFieldValue,
                              setFieldTouched,
                              setFieldError,
                            )
                          }
                        />
                        {errors.delivery_direction &&
                          touched.delivery_direction && (
                            <p className="text-red-500 text-[10px] mt-1 text-left">
                              {errors.delivery_direction}
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="h-87.5 rounded-xl overflow-hidden border">
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

                {/* PRESUPUESTO */}
                <aside className="h-fit rounded-2xl bg-[#1a232e] p-8 shadow-xl text-white sticky top-10 text-left">
                  <h2 className="text-xl font-bold mb-6">Presupuesto</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-gray-700 pb-2 text-sm text-gray-400">
                      <span>Trayecto</span>
                      <span>{distance.toFixed(1)} km</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2 text-sm text-gray-400">
                      <span>Volumen</span>
                      <span>{volumenM3.toFixed(4)} m³</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2 text-sm text-gray-400">
                      <span>Peso</span>
                      <span>
                        {pesoNum} kg{" "}
                        {recargoPeso > 0 && (
                          <span className="text-primary ml-1">
                            {" "}
                            (+{(recargoPeso * 100).toFixed(0)}%)
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="pt-4 space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                        <Field
                          type="checkbox"
                          name="fragile"
                          className="accent-primary"
                        />{" "}
                        Frágil (+15%)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                        <Field
                          type="checkbox"
                          name="dangerous"
                          className="accent-primary"
                        />{" "}
                        Peligroso (+30%)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                        <Field
                          type="checkbox"
                          name="cooled"
                          className="accent-primary"
                        />{" "}
                        Refrigerado (+20%)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                        <Field
                          type="checkbox"
                          name="urgent"
                          className="accent-primary"
                        />{" "}
                        Urgente (+50%)
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
                    disabled={isSubmitting}
                    className="mt-8 w-full rounded-xl bg-primary py-4 font-bold text-white hover:bg-[#bf5a3a] transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? "Enviando..." : "Confirmar Envío"}
                  </button>

                  {Object.keys(errors).length > 0 && (
                    <p className="text-red-400 text-[10px] mt-4 text-center uppercase tracking-widest font-bold">
                      Datos incompletos
                    </p>
                  )}
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
