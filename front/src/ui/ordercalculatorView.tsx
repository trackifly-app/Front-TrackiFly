'use client';

import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { ShipmentValues } from '@/interfaces/shipment';

const COSTO_M3 = 500;
const COSTO_KM = 120;
const KM_A_MILLAS = 0.621371;

const RECARGOS = {
  FRAGIL: 0.15,
  PELIGROSO: 0.3,
  REFRIGERADO: 0.2,
  URGENTE: 0.5,
};

export default function CalcularEnvioPage() {
  const [isCalculating, setIsCalculating] = useState(false);

  const traducirDireccionACoordenadas = async (direccion: string) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon };
      }
    } catch (error) {
      console.error('Error traduciendo dirección:', error);
    }

    return null;
  };

  const calcularRutaInterna = async (origin: string, destiny: string, setFieldValue: (field: string, value: any) => void) => {
    if (origin.length < 5 || destiny.length < 5) return;

    setIsCalculating(true);

    try {
      const coordsOrg = await traducirDireccionACoordenadas(origin);
      const coordsDest = await traducirDireccionACoordenadas(destiny);

      if (coordsOrg && coordsDest) {
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsOrg.lon},${coordsOrg.lat};${coordsDest.lon},${coordsDest.lat}?overview=false`);
        const data = await response.json();

        if (data.routes && data.routes[0]) {
          const kms = data.routes[0].distance / 1000;
          setFieldValue('distancia', kms);
        }
      }
    } catch (error) {
      console.error('Error calculando ruta:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const initialValues: ShipmentValues = {
    name: '',
    category_id: '',
    description: '',
    image: '',

    height: 0,
    width: 0,
    depth: 0,
    weight: 0,
    unit: '',
    pickup_direction: '',
    delivery_direction: '',
    distance: 0,
    fragile: false,
    dangerous: false,
    cooled: false,
    urgent: false,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log('Cotización aceptada:', values);
      }}
    >
      {({ values, setFieldValue }) => {
        const factor = values.unit === 'cm' ? 0.01 : 0.0254;
        const altoM = (Number(values.height) || 0) * factor;
        const anchoM = (Number(values.width) || 0) * factor;
        const profM = (Number(values.depth) || 0) * factor;

        const volumen = altoM * anchoM * profM;
        const precioBase = volumen * COSTO_M3 + values.distance * COSTO_KM;
        const pesoNum = Number(values.weight) || 0;

        let recargoPeso = 0;
        if (pesoNum > 2) {
          const bloquesExtras = Math.floor((pesoNum - 2) / 2);
          recargoPeso = bloquesExtras * 0.05;
        }

        let porcentajeExtra = recargoPeso;
        if (values.fragile) porcentajeExtra += RECARGOS.FRAGIL;
        if (values.dangerous) porcentajeExtra += RECARGOS.PELIGROSO;
        if (values.cooled) porcentajeExtra += RECARGOS.REFRIGERADO;
        if (values.urgent) porcentajeExtra += RECARGOS.URGENTE;

        const montoRecargo = precioBase * porcentajeExtra;
        const precioFinal = precioBase + montoRecargo;

        return (
          <Form className="bg-surface border border-border rounded-2xl p-3 shadow-sm w-full">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Calculadora de Envío</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2 space-y-2">
                <div className="space-y-1">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Punto de Retiro:</label>
                    <Field name="origen" placeholder="Calle y altura, Ciudad" onBlur={() => calcularRutaInterna(values.pickup_direction, values.delivery_direction, setFieldValue)} className="w-full rounded-lg border border-border bg-surface-muted text-foreground placeholder-muted px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Punto de Entrega:</label>
                    <Field name="destino" placeholder="Calle y altura, Ciudad" onBlur={() => calcularRutaInterna(values.pickup_direction, values.delivery_direction, setFieldValue)} className="w-full rounded-lg border border-border bg-surface-muted text-foreground placeholder-muted px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                  </div>

                  <div className="text-xs text-muted bg-surface-muted border border-border rounded-lg px-2 py-1.5 min-h-8.5 flex items-center">{isCalculating ? 'Calculando distancia...' : values.distance > 0 ? `Distancia: ${values.distance.toFixed(2)} km / ${(values.distance * KM_A_MILLAS).toFixed(2)} mi` : 'Completa ambas direcciones'}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Unidad:</label>
                  <Field name="unidad" as="select" className="w-full rounded-lg border border-border bg-surface-muted text-foreground px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30">
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  <Field name="alto" type="number" placeholder={`Alto (${values.unit})`} className="w-full rounded-lg border border-border bg-surface-muted text-foreground placeholder-muted px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                  <Field name="ancho" type="number" placeholder={`Ancho (${values.unit})`} className="w-full rounded-lg border border-border bg-surface-muted text-foreground placeholder-muted px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                  <Field name="profundidad" type="number" placeholder={`Profundidad (${values.unit})`} className="w-full rounded-lg border border-border bg-surface-muted text-foreground placeholder-muted px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                  <Field name="peso" type="number" placeholder="Peso (kg)" className="w-full rounded-lg border border-border bg-surface-muted text-foreground placeholder-muted px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>

                <hr className="border-border" />

                <fieldset className="space-y-1">
                  <legend className="text-sm font-semibold text-foreground">Extras:</legend>

                  <div className="space-y-1 text-xs text-muted">
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

            <div className="mt-3 border-t border-border pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <section className="md:col-span-2 bg-surface-muted border border-border rounded-xl p-3 space-y-1 min-h-22.5">
                <h3 className="text-base font-semibold text-foreground">Presupuesto</h3>

                <p className="text-xs text-muted">Volumen: {volumen.toFixed(4)} m³</p>

                <p className="text-xs text-muted">Trayecto: {values.distance.toFixed(1)} km</p>

                <p className="text-xs text-muted">
                  Peso: {pesoNum} kg
                  {recargoPeso > 0 && ` (+${(recargoPeso * 100).toFixed(0)}%)`}
                </p>

                {porcentajeExtra > 0 && <p className="text-xs text-primary">Recargos: +${montoRecargo.toLocaleString('es-AR')}</p>}

                <h2 className="text-xl font-bold text-foreground">Total: ${precioFinal.toLocaleString('es-AR')}</h2>
              </section>

              <div className="flex md:justify-center md:items-center h-full">
                <button type="submit" className="bg-primary hover:bg-primary-hover text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-colors w-full md:w-auto">
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
