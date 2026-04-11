"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { CATEGORIES } from "@/lib/categories";
import { validateShipment } from "@/lib/validates";

const COSTO_M3 = 500;
const COSTO_KM = 120;
const KM_A_MILLAS = 0.621371;

const RECARGOS = {
  FRAGIL: 0.15,
  PELIGROSO: 0.3,
  REFRIGERADO: 0.2,
  URGENTE: 0.5,
};

const OrderView = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const initialValues = {
    nombre: "",
    descripcion: "",
    id_categoria: "",
    direccion_retiro: "",
    direccion_entrega: "",
    distancia: 0,
    alto: "",
    ancho: "",
    profundidad: "",
    unidad: "cm",
    imagen: "",
    fragil: false,
    peligroso: false,
    refrigerado: false,
    urgente: false,
  };

  const calcularDistanciaOSM = async (
    origen: string,
    destino: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (origen.trim().length < 5 || destino.trim().length < 5) return;

    setIsCalculating(true);

    try {
      const resOrg = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          origen
        )}&limit=1`
      );
      const dataOrg = await resOrg.json();

      const resDest = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          destino
        )}&limit=1`
      );
      const dataDest = await resDest.json();

      if (dataOrg[0] && dataDest[0]) {
        const resRoute = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${dataOrg[0].lon},${dataOrg[0].lat};${dataDest[0].lon},${dataDest[0].lat}?overview=false`
        );
        const dataRoute = await resRoute.json();

        if (dataRoute.routes && dataRoute.routes[0]) {
          const kms = dataRoute.routes[0].distance / 1000;
          setFieldValue("distancia", kms);
        }
      }
    } catch (error) {
      console.error("Error en el mapa:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
  <Formik
    initialValues={initialValues}
    validate={validateShipment}
    onSubmit={(values) => {
      console.log("Orden enviada:", values);
    }}
  >
    {({ values, setFieldValue }) => {
      const alto = Number(values.alto) || 0;
      const ancho = Number(values.ancho) || 0;
      const profundidad = Number(values.profundidad) || 0;

      const volumenBase = alto * ancho * profundidad;

      const volumenM3 =
        values.unidad === "cm"
          ? volumenBase / 1000000
          : volumenBase * 0.0000163871;

      const costoBase = volumenM3 * COSTO_M3 + values.distancia * COSTO_KM;

      const porcentajeExtra =
        (values.fragil ? RECARGOS.FRAGIL : 0) +
        (values.peligroso ? RECARGOS.PELIGROSO : 0) +
        (values.refrigerado ? RECARGOS.REFRIGERADO : 0) +
        (values.urgente ? RECARGOS.URGENTE : 0);

      const montoRecargo = costoBase * porcentajeExtra;
      const precioFinal = costoBase + montoRecargo;

      return (
        <Form className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-2">
            Calculadora de Envío
          </h2>

          {/* GRID PRINCIPAL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* COLUMNA IZQUIERDA */}
            <div className="lg:col-span-2 space-y-2">
              <div>
                <Field
                  name="nombre"
                  placeholder="Nombre del producto"
                  className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-primary"
                />
                <ErrorMessage
                  name="nombre"
                  component="div"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              <Field
                name="descripcion"
                as="textarea"
                placeholder="Descripción breve"
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-primary resize-none min-h-[56px]"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Field
                  name="id_categoria"
                  as="select"
                  className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm bg-white outline-none focus:border-primary"
                >
                  <option value="">Selecciona Categoría</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Field>

                <Field
                  name="imagen"
                  placeholder="URL de la imagen"
                  className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-1">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Punto de Retiro:
                  </label>
                  <Field
                    name="direccion_retiro"
                    placeholder="Calle y altura, Ciudad"
                    onBlur={() =>
                      calcularDistanciaOSM(
                        values.direccion_retiro,
                        values.direccion_entrega,
                        setFieldValue
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Dirección de Entrega:
                  </label>
                  <Field
                    name="direccion_entrega"
                    placeholder="Calle y altura, Ciudad"
                    onBlur={() =>
                      calcularDistanciaOSM(
                        values.direccion_retiro,
                        values.direccion_entrega,
                        setFieldValue
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5">
                  {isCalculating
                    ? "Calculando..."
                    : values.distancia > 0
                    ? `Distancia: ${values.distancia.toFixed(2)} km / ${(
                        values.distancia * KM_A_MILLAS
                      ).toFixed(2)} mi`
                    : "Completa ambas direcciones"}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="space-y-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Unidad:
                </label>
                <Field
                  name="unidad"
                  as="select"
                  className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm bg-white outline-none focus:border-primary"
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <Field
                  name="alto"
                  type="number"
                  placeholder={`Alto (${values.unidad})`}
                  className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-primary"
                />
                <Field
                  name="ancho"
                  type="number"
                  placeholder={`Ancho (${values.unidad})`}
                  className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-primary"
                />
                <Field
                  name="profundidad"
                  type="number"
                  placeholder={`Profundidad (${values.unidad})`}
                  className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <hr className="border-gray-100" />

              <fieldset className="space-y-1">
                <legend className="text-sm font-semibold text-gray-900">
                  Extras:
                </legend>

                <div className="space-y-1 text-xs text-gray-700">
                  <label className="flex items-center gap-2">
                    <Field type="checkbox" name="fragil" />
                    Frágil
                  </label>
                  <label className="flex items-center gap-2">
                    <Field type="checkbox" name="peligroso" />
                    Peligroso
                  </label>
                  <label className="flex items-center gap-2">
                    <Field type="checkbox" name="refrigerado" />
                    Refrigerado
                  </label>
                  <label className="flex items-center gap-2">
                    <Field type="checkbox" name="urgente" />
                    Urgente
                  </label>
                </div>
              </fieldset>
            </div>
          </div>

          {/* FILA FINAL */}
          <div className="mt-3 border-t border-gray-100 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <section className="md:col-span-2 bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1 min-h-[90px]">
              <h3 className="text-base font-semibold text-gray-900">Presupuesto</h3>

              <p className="text-xs text-gray-600">
                Volumen: {volumenM3.toFixed(4)} m³
              </p>

              <p className="text-xs text-gray-600">
                Trayecto: {values.distancia.toFixed(1)} km
              </p>

              {porcentajeExtra > 0 && (
                <p className="text-xs text-orange-600">
                  Recargos: +${montoRecargo.toLocaleString("es-AR")}
                </p>
              )}

              <h2 className="text-xl font-bold text-gray-900">
                Total: ${precioFinal.toLocaleString("es-AR")}
              </h2>
            </section>

            <div className="flex md:justify-center md:items-center h-full">
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors w-full md:w-auto"
              >
                Generar orden
              </button>
            </div>
          </div>
        </Form>
      );
    }}
  </Formik>
);
};

export default OrderView;