"use client";

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CATEGORIES } from '@/lib/categories';
import { validateShipment } from '@/lib/validates';
import { ShipmentValues } from '@/interfaces/shipment';

const ShipmentLogicForm = () => {
  const initialValues: ShipmentValues = {
    nombre: '',
    descripcion: '',
    id_categoria: '',
    direccion_entrega: '',
    alto: 0,
    ancho: 0,
    profundidad: 0,
    imagen: ''
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validateShipment}
      onSubmit={(values) => console.log("Enviando a Trackifly:", values)}
    >
      {({ values }) => (
        <Form>
          <Field name="nombre" placeholder="Nombre del producto" />
          <ErrorMessage name="nombre" component="div" />

          <Field name="descripcion" as="textarea" placeholder="Descripción" />

          <Field name="id_categoria" as="select">
            <option value="">Selecciona Categoría</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Field>
          <ErrorMessage name="id_categoria" component="div" />

          <Field name="direccion_entrega" placeholder="Dirección de destino" />
          <ErrorMessage name="direccion_entrega" component="div" />

          <Field name="alto" type="number" placeholder="Alto" />
          <ErrorMessage name="alto" component="div" />

          <Field name="ancho" type="number" placeholder="Ancho" />
          <ErrorMessage name="ancho" component="div" />

          <Field name="profundidad" type="number" placeholder="Profundidad" />
          <ErrorMessage name="profundidad" component="div" />

          <Field name="imagen" placeholder="URL de la imagen" />

          <button type="submit">Generar Envío</button>

          <div style={{ marginTop: '20px', borderTop: '1px solid #ccc' }}>
            <strong>Vista previa del volumen:</strong> 
            {values.alto * values.ancho * values.profundidad} m³
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ShipmentLogicForm;