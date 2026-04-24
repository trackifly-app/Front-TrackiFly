'use client';
import { Formik, Form, Field } from 'formik';
import { ShipmentValues } from '@/interfaces/shipment';
import { useRouter } from 'next/navigation';
import { descargarReporte } from '@/lib/orderCalculatorReport';
import RouteMapFields from "@/components/forms/RouteMapFields";
import { useFeedback } from "@/context/feedback/useFeedback";

const COSTO_M3 = 500;
const COSTO_KM = 120;
const KM_A_MILLAS = 0.621371;
const OBELISCO_COORDS = { lat: -34.6037, lng: -58.3816 };
const OBELISCO_ADDRESS =
  "Obelisco, Av. 9 de Julio s/n, C1043 Ciudad Autónoma de Buenos Aires";

const RECARGOS = {
  FRAGIL: 0.15,
  PELIGROSO: 0.3,
  REFRIGERADO: 0.2,
  URGENTE: 0.5,
};

export default function CalcularEnvioPage() {
  const router = useRouter();
  const { showToast } = useFeedback();
  const initialValues: ShipmentValues = {
    name: '',
    category_id: '',
    description: '',
    image: '',
    height: '',
    width: '',
    depth: '',
    weight: '',
    unit: 'cm',
    pickup_direction: OBELISCO_ADDRESS,
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
        const factor = values.unit === "cm" ? 0.01 : 0.0254;
        const altoM = (Number(values.height) || 0) * factor;
        const anchoM = (Number(values.width) || 0) * factor;
        const profM = (Number(values.depth) || 0) * factor;
        const volumen = altoM * anchoM * profM;
        const pesoNum = Number(values.weight) || 0;

        if (volumen === 0 || values.distance === 0 || pesoNum === 0) {
          showToast("Cotizacion vacia o sin datos", "warning", 2500);
          return;
        }

        const calculatorData ={
          height: values.height,
          width: values.width,
          depth: values.depth,
          weight: values.weight,
          unit: values.unit,
          pickup_direction: values.pickup_direction,
          delivery_direction: values.delivery_direction,
          distance: values.distance,
          fragile: values.fragile,
          dangerous: values.dangerous,
          cooled: values.cooled,
          urgent: values.urgent,
        };

        sessionStorage.setItem("calculatorOrderDraft", JSON.stringify(calculatorData));

        showToast("Cotizacion aceptada", "success", 1800);
        showToast("Redirigiendo a Realizar Pedidos...", "success", 2600);

        setTimeout(() => {
          router.push("/es/orders");
        }, 1800);
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

                <div className="space-y-2">
                  <RouteMapFields
                    pickupDirection={values.pickup_direction}
                    deliveryDirection={values.delivery_direction}
                    setFieldValue={setFieldValue}
                    fixedAddress={OBELISCO_ADDRESS}
                    fixedCoords={OBELISCO_COORDS}
                    fixedStartsAsOrigin={true}
                    fixedLocationName="Obelisco"
                  />

                  <div className="text-xs text-muted bg-surface-muted border border-border rounded-lg px-2 py-1.5 min-h-8.5 flex items-center">
                    {values.distance > 0
                      ? `Distancia: ${values.distance.toFixed(2)} km / ${(values.distance * KM_A_MILLAS).toFixed(2)} mi`
                      : "Selecciona punto de retiro y punto de entrega"}
                  </div>
                </div>

              </div>

              <div className="space-y-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Unidad:</label>
                  <Field name="unit" as="select" className="w-full rounded-lg border border-border bg-surface-muted text-foreground px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30">
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  <Field name="height" type="number" placeholder={`Alto (${values.unit})`} className="w-full rounded-lg border border-border bg-surface-muted text-foreground placeholder-muted px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                  <Field name="width" type="number" placeholder={`Ancho (${values.unit})`} className="w-full rounded-lg border border-border bg-surface-muted text-foreground placeholder-muted px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                  <Field name="depth" type="number" placeholder={`Profundidad (${values.unit})`} className="w-full rounded-lg border border-border bg-surface-muted text-foreground placeholder-muted px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                  <Field name="weight" type="number" placeholder="Peso (kg)" className="w-full rounded-lg border border-border bg-surface-muted text-foreground placeholder-muted px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>

                <hr className="border-border" />

                <fieldset className="space-y-1">
                  <legend className="text-sm font-semibold text-foreground">Extras:</legend>

                  <div className="space-y-1 text-xs text-muted">
                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="fragile" />
                      Frágil
                    </label>
                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="dangerous" />
                      Peligroso
                    </label>
                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="cooled" />
                      Refrigerado
                    </label>
                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="urgent" />
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

              {/*======= BOTONES PRINCIPALES ================*/}
              <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-2 h-full">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors w-full md:w-auto"
                >
                  Aceptar envio
                </button>
                <button
                  type="button"
                  onClick={() =>
                    descargarReporte(
                      values,
                      volumen,
                      precioBase,
                      montoRecargo,
                      precioFinal,
                      pesoNum
                    )
                  }
                  className="border border-border bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors w-full md:w-auto"
                >
                  Descargar cotización
                </button>
              </div>
              {/*======= FIN BOTONES PRINCIPALES ================*/}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
