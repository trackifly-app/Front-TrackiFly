"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";

const COSTO_M3 = 500;
const COSTO_KM = 120;
const KM_A_MILLAS = 0.621371;

const RECARGOS = {
  FRAGIL: 0.15,
  PELIGROSO: 0.3,
  REFRIGERADO: 0.2,
  URGENTE: 0.5,
};

type CalculatorValues = {
  alto: string;
  ancho: string;
  profundidad: string;
  unidad: "cm" | "in";
  origen: string;
  destino: string;
  distancia: number;
  fragil: boolean;
  peligroso: boolean;
  refrigerado: boolean;
  urgente: boolean;
};

export default function CalcularEnvioPage() {
  const [isCalculating, setIsCalculating] = useState(false);

  const traducirDireccionACoordenadas = async (direccion: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon };
      }
    } catch (error) {
      console.error("Error traduciendo dirección:", error);
    }

    return null;
  };

  // 2. Calcular ruta por carretera (Routing)
  const calcularRutaInterna = async (
    origin: string,
    destiny: string,
    setFieldValue: any,
  ) => {
    if (origin.length < 5 || destiny.length < 5) return;

    setIsCalculating(true);
    const coordsOrg = await traducirDireccionACoordenadas(origin);
    const coordsDest = await traducirDireccionACoordenadas(destiny);

    try {
      const coordsOrg = await traducirDireccionACoordenadas(origen);
      const coordsDest = await traducirDireccionACoordenadas(destino);

      if (coordsOrg && coordsDest) {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordsOrg.lon},${coordsOrg.lat};${coordsDest.lon},${coordsDest.lat}?overview=false`,
        );
        const data = await response.json();

        if (data.routes && data.routes[0]) {
          const kms = data.routes[0].distance / 1000;
          setFieldValue("distancia", kms);
        }
      }
    } catch (error) {
      console.error("Error calculando ruta:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const initialValues: CalculatorValues = {
    alto: "",
    ancho: "",
    profundidad: "",
    unidad: "cm",
    origen: "",
    destino: "",
    distancia: 0,
    fragil: false,
    peligroso: false,
    refrigerado: false,
    urgente: false,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log("Cotización aceptada:", values);
      }}
    >
      {({ values, setFieldValue }) => {
        const factor = values.unidad === "cm" ? 0.01 : 0.0254;
        const altoM = (Number(values.alto) || 0) * factor;
        const anchoM = (Number(values.ancho) || 0) * factor;
        const profM = (Number(values.profundidad) || 0) * factor;

        const volumen = altoM * anchoM * profM;
        const precioBase = volumen * COSTO_M3 + values.distancia * COSTO_KM;

        let porcentajeExtra = 0;
        if (values.fragil) porcentajeExtra += RECARGOS.FRAGIL;
        if (values.peligroso) porcentajeExtra += RECARGOS.PELIGROSO;
        if (values.refrigerado) porcentajeExtra += RECARGOS.REFRIGERADO;
        if (values.urgente) porcentajeExtra += RECARGOS.URGENTE;

        const montoRecargo = precioBase * porcentajeExtra;
        const precioFinal = precioBase + montoRecargo;

        return (
          <Form className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm w-full">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Calculadora de Envío
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2 space-y-2">
                <div className="space-y-1">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Punto de Retiro:
                    </label>
                    <Field
                      name="origen"
                      placeholder="Calle y altura, Ciudad"
                      onBlur={() =>
                        calcularRutaInterna(
                          values.origen,
                          values.destino,
                          setFieldValue
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Punto de Entrega:
                    </label>
                    <Field
                      name="destino"
                      placeholder="Calle y altura, Ciudad"
                      onBlur={() =>
                        calcularRutaInterna(
                          values.origen,
                          values.destino,
                          setFieldValue
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5 min-h-[34px] flex items-center">
                    {isCalculating
                      ? "Calculando distancia..."
                      : values.distancia > 0
                      ? `Distancia: ${values.distancia.toFixed(2)} km / ${(
                          values.distancia * KM_A_MILLAS
                        ).toFixed(2)} mi`
                      : "Completa ambas direcciones"}
                  </div>
                </div>
              </div>

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

            <div className="mt-3 border-t border-gray-100 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <section className="md:col-span-2 bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1 min-h-[90px]">
                <h3 className="text-base font-semibold text-gray-900">
                  Presupuesto
                </h3>

                <p className="text-xs text-gray-600">
                  Volumen: {volumen.toFixed(4)} m³
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
                  Aceptar envío
                </button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
