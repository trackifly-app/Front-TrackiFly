"use client";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { validateCalculator } from '@/lib/validates';
const COSTO_M3 = 500; 
const COSTO_KM = 120;

export default function CalcularEnvioPage() {
  return (
    <main style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Calculá tu Envío</h1>
      <p>Ingresá las medidas y la distancia para obtener un presupuesto estimado.</p>

      <Formik
        initialValues={{ alto: 0, ancho: 0, profundidad: 0, distancia: 0 }}
        validate={validateCalculator}
        onSubmit={(values) => console.log("Cotización aceptada:", values)}
      >
        {({ values }) => {
          // Cálculo en tiempo real
          const volumen = values.alto * values.ancho * values.profundidad;
          const precioFinal = (volumen * COSTO_M3) + (values.distancia * COSTO_KM);

          return (
            <Form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label>Alto (m)</label>
                <Field name="alto" type="number" step="0.1" />
                <ErrorMessage name="alto" component="div" style={{color: 'red', fontSize: '12px'}} />
              </div>

              <div>
                <label>Ancho (m)</label>
                <Field name="ancho" type="number" step="0.1" />
                <ErrorMessage name="ancho" component="div" style={{color: 'red', fontSize: '12px'}} />
              </div>

              <div>
                <label>Profundidad (m)</label>
                <Field name="profundidad" type="number" step="0.1" />
                <ErrorMessage name="profundidad" component="div" style={{color: 'red', fontSize: '12px'}} />
              </div>

              <div>
                <label>Distancia aproximada (km)</label>
                <Field name="distancia" type="number" />
                <ErrorMessage name="distancia" component="div" style={{color: 'red', fontSize: '12px'}} />
              </div>

              {/* CARD DE RESULTADO */}
              <div style={{ 
                marginTop: '30px', 
                padding: '20px', 
                backgroundColor: '#1a1a1a', 
                color: 'white', 
                borderRadius: '12px' 
              }}>
                <h3>Resumen de Cotización</h3>
                <p>Volumen Total: <strong>{volumen.toFixed(3)} m³</strong></p>
                <p>Distancia: <strong>{values.distancia} km</strong></p>
                <hr />
                <h2 style={{ color: '#ffd700' }}>
                  Total: ${precioFinal.toLocaleString('es-AR')}
                </h2>
              </div>

              <button type="button" onClick={() => window.print()} style={{ marginTop: '10px' }}>
                Imprimir Presupuesto
              </button>
            </Form>
          );
        }}
      </Formik>
    </main>
  );
}