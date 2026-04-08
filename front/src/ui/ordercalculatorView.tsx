"use client";
import { Formik, Form, Field } from 'formik';

const COSTO_M3 = 500; 
const COSTO_KM = 120;
const RECARGOS = { FRAGIL: 0.15, PELIGROSO: 0.30, REFRIGERADO: 0.20, URGENTE: 0.50 };

export default function CalcularEnvioPage() {

  // Esta función es la que "traduce" la calle a coordenadas por detrás
  const traducirDireccionACoordenadas = async (direccion: string) => {
    try {
      // Agregamos limit=1 para que sea más rápido
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

  const calcularRutaInterna = async (origen: string, destino: string, setFieldValue: any) => {
    if (origen.length < 5 || destino.length < 5) return; // Evitamos búsquedas con texto muy corto

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
      }
    }
  };

  return (
    <main>
      <h1>Calculadora Trackifly</h1>

      <Formik
        initialValues={{ 
          alto: 0, ancho: 0, profundidad: 0, 
          origen: '', destino: '', distancia: 0,
          fragil: false, peligroso: false, refrigerado: false, urgente: false 
        }}
        onSubmit={(values) => console.log("Cotización aceptada:", values)}
      >
        {({ values, setFieldValue }) => {
          const volumen = values.alto * values.ancho * values.profundidad;
          const precioBase = (volumen * COSTO_M3) + (values.distancia * COSTO_KM);
          
          let porcentajeExtra = 0;
          if (values.fragil) porcentajeExtra += RECARGOS.FRAGIL;
          if (values.peligroso) porcentajeExtra += RECARGOS.PELIGROSO;
          if (values.refrigerado) porcentajeExtra += RECARGOS.REFRIGERADO;
          if (values.urgente) porcentajeExtra += RECARGOS.URGENTE;

          const precioFinal = precioBase + (precioBase * porcentajeExtra);

          return (
            <Form>
              {/* Medidas */}
              <Field name="alto" type="number" placeholder="Alto (m)" />
              <Field name="ancho" type="number" placeholder="Ancho (m)" />
              <Field name="profundidad" type="number" placeholder="Profundidad (m)" />

              <hr />
              
              {/* Entradas de texto simples para el usuario */}
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

              {values.distancia > 0 && (
                <p>Distancia detectada por el sistema: <strong>{values.distancia.toFixed(2)} km</strong></p>
              )}

              <hr />

              <label><Field type="checkbox" name="fragil" /> Frágil</label>
              <label><Field type="checkbox" name="peligroso" /> Peligroso</label>
              <label><Field type="checkbox" name="urgente" /> Urgente</label>

              <hr />

              <section>
                <h3>Presupuesto: ${precioFinal.toLocaleString('es-AR')}</h3>
              </section>

              <button type="submit">Aceptar Envío</button>
            </Form>
          );
        }}
      </Formik>
    </main>
  );
}