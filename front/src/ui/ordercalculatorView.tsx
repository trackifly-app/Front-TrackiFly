"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";

const COSTO_M3 = 500;
const COSTO_KM = 120;
const RECARGOS = {
  FRAGIL: 0.15,
  PELIGROSO: 0.3,
  REFRIGERADO: 0.2,
  URGENTE: 0.5,
};

export default function CalcularEnvioPage() {
  const [isCalculating, setIsCalculating] = useState(false);

  // 1. Traducir texto de calle a coordenadas (Geocoding)
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

    if (coordsOrg && coordsDest) {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordsOrg.lon},${coordsOrg.lat};${coordsDest.lon},${coordsDest.lat}?overview=false`,
        );
        const data = await response.json();

        if (data.routes && data.routes[0]) {
          const kms = data.routes[0].distance / 1000;
          setFieldValue("distancia", kms);
        }
      } catch (error) {
        console.error("Error calculando ruta:", error);
      } finally {
        setIsCalculating(false);
      }
    }
  };

  return (
    <main>
      <h1>Calculadora Trackifly</h1>

      <Formik
        initialValues={{
          height: "",
          width: "",
          depth: "",
          unit: "cm", // Agregado: Selector de unit
          origin: "",
          destiny: "",
          distance: 0,
          fragile: false,
          dangerous: false,
          cooled: false,
          urgent: false,
        }}
        onSubmit={(values) => console.log("Cotización aceptada:", values)}
      >
        {({ values, setFieldValue }) => {
          // Lógica de conversión de unidades a Metros
          const factor = values.unit === "cm" ? 0.01 : 0.0254;
          const altoM = (Number(values.height) || 0) * factor;
          const anchoM = (Number(values.width) || 0) * factor;
          const profM = (Number(values.depth) || 0) * factor;

          const volumen = altoM * anchoM * profM;
          const precioBase = volumen * COSTO_M3 + values.distance * COSTO_KM;

          let porcentajeExtra = 0;
          if (values.fragile) porcentajeExtra += RECARGOS.FRAGIL;
          if (values.dangerous) porcentajeExtra += RECARGOS.PELIGROSO;
          if (values.cooled) porcentajeExtra += RECARGOS.REFRIGERADO;
          if (values.urgent) porcentajeExtra += RECARGOS.URGENTE;

          const precioFinal = precioBase + precioBase * porcentajeExtra;

          return (
            <Form>
              {/* Selector de Unidad */}
              <div>
                <label>Unidad de medida:</label>
                <Field name="unit" as="select">
                  <option value="cm">Centímetros (cm)</option>
                  <option value="in">Pulgadas (in)</option>
                </Field>
              </div>

              {/* Medidas con placeholders dinámicos y sin el 0 inicial */}
              <Field
                name="height"
                type="number"
                placeholder={`Alto (${values.unit})`}
              />
              <Field
                name="width"
                type="number"
                placeholder={`Ancho (${values.unit})`}
              />
              <Field
                name="depth"
                type="number"
                placeholder={`Profundidad (${values.unit})`}
              />

              <hr />

              <label>Punto de Retiro:</label>
              <Field
                name="origin"
                placeholder="Calle y altura, Ciudad"
                onBlur={() =>
                  calcularRutaInterna(
                    values.origin,
                    values.destiny,
                    setFieldValue,
                  )
                }
              />

              <label>Punto de Entrega:</label>
              <Field
                name="destiny"
                placeholder="Calle y altura, Ciudad"
                onBlur={() =>
                  calcularRutaInterna(
                    values.origin,
                    values.destiny,
                    setFieldValue,
                  )
                }
              />

              <div style={{ minHeight: "25px", color: "white" }}>
                {isCalculating
                  ? "Calculando distancia..."
                  : values.distance > 0
                    ? `distancia detectada: ${values.distance.toFixed(2)} km`
                    : null}
              </div>

              <hr />

              {/* Checkboxes completos */}
              <label>
                <Field type="checkbox" name="fragile" /> Frágil
              </label>
              <br />
              <label>
                <Field type="checkbox" name="dangerous" /> Peligroso
              </label>
              <br />
              <label>
                <Field type="checkbox" name="cooled" /> Refrigerado
              </label>
              <br />
              <label>
                <Field type="checkbox" name="urgent" /> Urgente
              </label>

              <hr />

              <section>
                <p>Volumen calculado: {volumen.toFixed(4)} m³</p>
                <h3>
                  Presupuesto Final: ${precioFinal.toLocaleString("es-AR")}
                </h3>
              </section>

              <button type="submit">Aceptar Envío</button>
            </Form>
          );
        }}
      </Formik>
    </main>
  );
}
