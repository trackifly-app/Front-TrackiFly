"use client";

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CATEGORIES } from '@/lib/categories';
import { validateShipment } from '@/lib/validates';

const COSTO_M3 = 500; 
const COSTO_KM = 120;
const KM_A_MILLAS = 0.621371;
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
    alto: '',        
    ancho: '',       
    profundidad: '', 
    unidad: 'cm',    
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
      onSubmit={(values) => console.log("Orden Final:", values)}
    >
      {({ values, setFieldValue }) => {
        
        // --- LA MATEMÁTICA CORRECTA ESTÁ AQUÍ ---
        // Si es 'cm' divide por 100 (0.01). 
        // Si es 'in' (pulgadas) multiplica por 0.0254.
        const factor = values.unidad === 'cm' ? 0.01 : 0.0254;

        // Convertimos cada lado a metros antes de multiplicar
        const altoM = (Number(values.alto) || 0) * factor;
        const anchoM = (Number(values.ancho) || 0) * factor;
        const profM = (Number(values.profundidad) || 0) * factor;

        const volumenM3 = altoM * anchoM * profM;
        const precioBase = (volumenM3 * COSTO_M3) + (values.distancia * COSTO_KM);
        
        let porcentajeExtra = 0;
        if (values.fragil) porcentajeExtra += RECARGOS.FRAGIL;
        if (values.peligroso) porcentajeExtra += RECARGOS.PELIGROSO;
        if (values.refrigerado) porcentajeExtra += RECARGOS.REFRIGERADO;
        if (values.urgente) porcentajeExtra += RECARGOS.URGENTE;

        const montoRecargo = precioBase * porcentajeExtra;
        const precioFinal = precioBase + montoRecargo;

        return (
          <Form>
            <h2>Detalles del Envío</h2>
            <Field name="nombre" placeholder="Nombre del producto" />
            <ErrorMessage name="nombre" component="div" />

            <Field name="descripcion" as="textarea" placeholder="Descripción breve" />

            <Field name="id_categoria" as="select">
              <option value="">Selecciona Categoría</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Field>

            <Field name="imagen" placeholder="URL de la imagen" />

            <hr />
            
            <label>Punto de Retiro:</label>
            <Field 
              name="direccion_retiro" 
              placeholder="Calle y altura, Ciudad" 
              onBlur={() => calcularDistanciaOSM(values.direccion_retiro, values.direccion_entrega, setFieldValue)}
            />
            
            <label>Dirección de Entrega:</label>
            <Field 
              name="direccion_entrega" 
              placeholder="Calle y altura, Ciudad" 
              onBlur={() => calcularDistanciaOSM(values.direccion_retiro, values.direccion_entrega, setFieldValue)}
            />

            <div>
              {isCalculating ? "Calculando..." : values.distancia > 0 ? (
                `Distancia: ${values.distancia.toFixed(2)} km / ${(values.distancia * KM_A_MILLAS).toFixed(2)} mi`
              ) : null}
            </div>

            <hr />

            <label>Unidad:</label>
            <Field name="unidad" as="select">
              <option value="cm">Centímetros (cm)</option>
              <option value="in">Pulgadas (in)</option>
            </Field>

            <div>
              <Field name="alto" type="number" placeholder={`Alto (${values.unidad})`} />
              <Field name="ancho" type="number" placeholder={`Ancho (${values.unidad})`} />
              <Field name="profundidad" type="number" placeholder={`Profundidad (${values.unidad})`} />
            </div>

            <hr />

            <fieldset>
              <legend>Extras:</legend>
              <label><Field type="checkbox" name="fragil" /> Frágil</label>
              <label><Field type="checkbox" name="peligroso" /> Peligroso</label>
              <label><Field type="checkbox" name="refrigerado" /> Refrigerado</label>
              <label><Field type="checkbox" name="urgente" /> Urgente</label>
            </fieldset>

            <hr />

            <section>
              <h3>Presupuesto</h3>
              <p>Volumen Total: {volumenM3.toFixed(4)} m³</p>
              <p>Trayecto: {values.distancia.toFixed(1)} km</p>
              
              {porcentajeExtra > 0 && (
                <p>Recargos: +${montoRecargo.toLocaleString('es-AR')}</p>
              )}
              
              <h2>Total: ${precioFinal.toLocaleString('es-AR')}</h2>
            </section>

            <button type="submit">Generar Orden de Envío</button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OrderView;