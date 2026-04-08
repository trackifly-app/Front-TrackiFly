"use client";

import { useState } from 'react'; 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CATEGORIES } from '@/lib/categories';
import { validateShipment } from '@/lib/validates';

const COSTO_M3 = 500; 
const COSTO_KM = 120;
const RECARGOS = { FRAGIL: 0.15, PELIGROSO: 0.30, REFRIGERADO: 0.20, URGENTE: 0.50 };

const OrderView = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const initialValues = {
    nombre: '',
    descripcion: '',
    id_categoria: '',
    direccion_retiro: '',
    direccion_entrega: '',
    distancia: 0,
    alto: 0,
    ancho: 0,
    profundidad: 0,
    imagen: '',
    fragil: false,
    peligroso: false,
    refrigerado: false,
    urgente: false
  };

  const calcularDistanciaOSM = async (origen: string, destino: string, setFieldValue: any) => {
    if (origen.length < 5 || destino.length < 5) return;

    setIsCalculating(true); 
    try {
      const resOrg = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(origen)}&limit=1`);
      const dataOrg = await resOrg.json();
      
      const resDest = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destino)}&limit=1`);
      const dataDest = await resDest.json();

      if (dataOrg[0] && dataDest[0]) {
        const resRoute = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${dataOrg[0].lon},${dataOrg[0].lat};${dataDest[0].lon},${dataDest[0].lat}?overview=false`
        );
        const dataRoute = await resRoute.json();

        if (dataRoute.routes && dataRoute.routes[0]) {
          const kms = dataRoute.routes[0].distance / 1000;
          setFieldValue('distancia', kms);
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
      onSubmit={(values) => console.log("Orden generada:", values)}
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
            <Field name="nombre" placeholder="Nombre del producto" />
            <Field name="descripcion" as="textarea" placeholder="Descripción" />

            <Field name="id_categoria" as="select">
              <option value="">Selecciona Categoría</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Field>

            <hr />
            
            {/* DIRECCIONES CON FEEDBACK INMEDIATO */}
            <div>
              <label>Punto de Retiro:</label>
              <Field 
                name="direccion_retiro" 
                placeholder="Calle y altura, Ciudad" 
                onBlur={() => calcularDistanciaOSM(values.direccion_retiro, values.direccion_entrega, setFieldValue)}
              />
            </div>
            
            <div>
              <label>Destino Final:</label>
              <Field 
                name="direccion_entrega" 
                placeholder="Calle y altura, Ciudad" 
                onBlur={() => calcularDistanciaOSM(values.direccion_retiro, values.direccion_entrega, setFieldValue)}
              />
            </div>

            {/* Muestra la distancia apenas se calcula */}
            <div style={{ height: '24px', margin: '10px 0' }}>
              {isCalculating ? (
                <span>⌛ Calculando distancia óptima...</span>
              ) : values.distancia > 0 ? (
                <span>📍 Distancia: <strong>{values.distancia.toFixed(2)} km</strong></span>
              ) : null}
            </div>

            <hr />

            <Field name="alto" type="number" placeholder="Alto (m)" />
            <Field name="ancho" type="number" placeholder="Ancho (m)" />
            <Field name="profundidad" type="number" placeholder="Profundidad (m)" />

            <hr />

            <fieldset>
              <legend>Extras:</legend>
              <label><Field type="checkbox" name="fragil" /> Frágil</label>
              <label><Field type="checkbox" name="peligroso" /> Peligroso</label>
              <label><Field type="checkbox" name="refrigerado" /> Refrigerado</label>
              <label><Field type="checkbox" name="urgente" /> Urgente</label>
            </fieldset>

            <hr />

            {/* RESUMEN DE COSTOS ACTUALIZADO AL INSTANTE */}
            <section>
              <p>Volumen: {volumen.toFixed(3)} m³</p>
              <p>Costo por Distancia: ${ (values.distancia * COSTO_KM).toLocaleString('es-AR') }</p>
              {porcentajeExtra > 0 && <p>Recargo Cuidados: +{porcentajeExtra * 100}%</p>}
              <h2>Total: ${precioFinal.toLocaleString('es-AR')}</h2>
            </section>

            <button type="submit">Confirmar Orden</button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OrderView;