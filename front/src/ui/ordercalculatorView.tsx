"use client";

import { useState } from 'react';
import { Formik, Form, Field } from 'formik';

const COSTO_M3 = 500; 
const COSTO_KM = 120;
const RECARGOS = { FRAGIL: 0.15, PELIGROSO: 0.30, REFRIGERADO: 0.20, URGENTE: 0.50 };

export default function CalcularEnvioPage() {
  const [isCalculating, setIsCalculating] = useState(false);

  // 1. Traducir texto de calle a coordenadas (Geocoding)
  const traducirDireccionACoordenadas = async (direccion: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`
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
  const calcularRutaInterna = async (origen: string, destino: string, setFieldValue: any) => {
    if (origen.length < 5 || destino.length < 5) return;

    setIsCalculating(true);
    const coordsOrg = await traducirDireccionACoordenadas(origen);
    const coordsDest = await traducirDireccionACoordenadas(destino);

    if (coordsOrg && coordsDest) {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordsOrg.lon},${coordsOrg.lat};${coordsDest.lon},${coordsDest.lat}?overview=false`
        );
        const data = await response.json();

        if (data.routes && data.routes[0]) {
          const kms = data.routes[0].distance / 1000;
          setFieldValue('distancia', kms);
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
          alto: '', ancho: '', profundidad: '', 
          unidad: 'cm', // Agregado: Selector de unidad
          origen: '', destino: '', distancia: 0,
          fragil: false, peligroso: false, refrigerado: false, urgente: false 
        }}
        onSubmit={(values) => console.log("Cotización aceptada:", values)}
      >
        {({ values, setFieldValue }) => {
          // Lógica de conversión de unidades a Metros
          const factor = values.unidad === 'cm' ? 0.01 : 0.0254;
          const altoM = (Number(values.alto) || 0) * factor;
          const anchoM = (Number(values.ancho) || 0) * factor;
          const profM = (Number(values.profundidad) || 0) * factor;

          const volumen = altoM * anchoM * profM;
          const precioBase = (volumen * COSTO_M3) + (values.distancia * COSTO_KM);
          
          let porcentajeExtra = 0;
          if (values.fragil) porcentajeExtra += RECARGOS.FRAGIL;
          if (values.peligroso) porcentajeExtra += RECARGOS.PELIGROSO;
          if (values.refrigerado) porcentajeExtra += RECARGOS.REFRIGERADO;
          if (values.urgente) porcentajeExtra += RECARGOS.URGENTE;

          const precioFinal = precioBase + (precioBase * porcentajeExtra);

          return (
            <Form>
              {/* Selector de Unidad */}
              <div>
                <label>Unidad de medida:</label>
                <Field name="unidad" as="select">
                  <option value="cm">Centímetros (cm)</option>
                  <option value="in">Pulgadas (in)</option>
                </Field>
              </div>

              {/* Medidas con placeholders dinámicos y sin el 0 inicial */}
              <Field name="alto" type="number" placeholder={`Alto (${values.unidad})`} />
              <Field name="ancho" type="number" placeholder={`Ancho (${values.unidad})`} />
              <Field name="profundidad" type="number" placeholder={`Profundidad (${values.unidad})`} />

              <hr />
              
              <label>Punto de Retiro:</label>
              <Field 
                name="origen" 
                placeholder="Calle y altura, Ciudad" 
                onBlur={() => calcularRutaInterna(values.origen, values.destino, setFieldValue)} 
              />

              <label>Punto de Entrega:</label>
              <Field 
                name="destino" 
                placeholder="Calle y altura, Ciudad" 
                onBlur={() => calcularRutaInterna(values.origen, values.destino, setFieldValue)}
              />

              <div style={{ minHeight: '25px', color: 'white' }}>
                {isCalculating ? "Calculando distancia..." : values.distancia > 0 ? `Distancia detectada: ${values.distancia.toFixed(2)} km` : null}
              </div>

              <hr />

              {/* Checkboxes completos */}
              <label><Field type="checkbox" name="fragil" /> Frágil</label>
              <br />
              <label><Field type="checkbox" name="peligroso" /> Peligroso</label>
              <br />
              <label><Field type="checkbox" name="refrigerado" /> Refrigerado</label>
              <br />
              <label><Field type="checkbox" name="urgente" /> Urgente</label>

              <hr />

              <section>
                <p>Volumen calculado: {volumen.toFixed(4)} m³</p>
                <h3>Presupuesto Final: ${precioFinal.toLocaleString('es-AR')}</h3>
              </section>

              <button type="submit">Aceptar Envío</button>
            </Form>
          );
        }}
      </Formik>
    </main>
  );
}