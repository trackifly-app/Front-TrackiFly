'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/navigation';
import { GoogleMap, useJsApiLoader, Marker, Polyline, Autocomplete } from '@react-google-maps/api';

import { validateShipment } from '@/lib/validates';
import { createOrder } from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';

const libraries: 'places'[] = ['places'];
const mapContainerStyle = { width: '100%', height: '100%' };
const centerDefault = { lat: -34.5997, lng: -58.3819 };

// COORDENADAS Y DIRECCIÓN DEL OBELISCO
const OBELISCO_COORDS = { lat: -34.6037, lng: -58.3816 };
const OBELISCO_ADDRESS = 'Obelisco, Av. 9 de Julio s/n, C1043 Ciudad Autónoma de Buenos Aires';

const COSTO_M3 = 500;
const COSTO_KM = 120;
const RECARGOS = {
  FRAGIL: 0.15,
  PELIGROSO: 0.3,
  REFRIGERADO: 0.2,
  URGENTE: 0.5,
};

const OrderView = () => {
  const router = useRouter();
  const { userData } = useAuth();
  // ESTADO PARA EL BOTÓN DEL OBELISCO
  const [obeliscoIsOrigin, setObeliscoIsOrigin] = useState(true);

  const [coords, setCoords] = useState<{
    origen: google.maps.LatLngLiteral | null;
    destino: google.maps.LatLngLiteral | null;
  }>({ origen: OBELISCO_COORDS, destino: null }); // Iniciamos con Obelisco en origen

  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [distance, setDistance] = useState(0);
  const [backendCategories, setBackendCategories] = useState<any[]>([]);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  const originRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // FUNCIÓN AUXILIAR PARA CALCULAR PRECIOS (Evita errores de scope)
  const getCalculatedPrices = (values: any) => {
    const factor = values.unit === 'cm' ? 0.01 : 0.0254;
    const volumenM3 = Number(values.height) * factor * (Number(values.width) * factor) * (Number(values.depth) * factor) || 0;
    const precioBase = volumenM3 * COSTO_M3 + distance * COSTO_KM;

    let recargoPeso = 0;
    const pesoNum = Number(values.weight) || 0;
    if (pesoNum > 2) {
      recargoPeso = Math.floor((pesoNum - 2) / 2) * 0.05;
    }

    let extraServicios = 0;
    if (values.fragile) extraServicios += RECARGOS.FRAGIL;
    if (values.dangerous) extraServicios += RECARGOS.PELIGROSO;
    if (values.cooled) extraServicios += RECARGOS.REFRIGERADO;
    if (values.urgent) extraServicios += RECARGOS.URGENTE;

    const esEmpresa = userData?.user?.role?.name === 'company';
    const precioFinal = precioBase > 0 ? precioBase * (1 + extraServicios + recargoPeso) : 0;
    const pConDesc = esEmpresa ? precioFinal * 0.9 : precioFinal;

    return { precioFinal, pConDesc, volumenM3, pesoNum };
  };

  const calcularRutaReal = useCallback(
    (origen: google.maps.LatLngLiteral, destino: google.maps.LatLngLiteral) => {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origen,
          destination: destino,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK' && result) {
            const distKm = (result.routes[0].legs[0].distance?.value || 0) / 1000;
            setDistance(distKm);
            const path = result.routes[0].overview_path.map((p) => ({
              lat: p.lat(),
              lng: p.lng(),
            }));
            setRoutePath(path);

            if (mapRef && result.routes[0].bounds) {
              mapRef.fitBounds(result.routes[0].bounds);
            }
          }
        },
      );
    },
    [mapRef],
  );

  const handleSwapObelisco = (setFieldValue: any) => {
    const nextState = !obeliscoIsOrigin;
    setObeliscoIsOrigin(nextState);
    setDistance(0);
    setRoutePath([]);

    if (nextState) {
      setFieldValue('pickup_direction', OBELISCO_ADDRESS);
      setFieldValue('delivery_direction', '');
      setCoords({ origen: OBELISCO_COORDS, destino: null });
    } else {
      setFieldValue('pickup_direction', '');
      setFieldValue('delivery_direction', OBELISCO_ADDRESS);
      setCoords({ origen: null, destino: OBELISCO_COORDS });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://back-trackifly-production.up.railway.app/categories');
        const data = await response.json();
        setBackendCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategories();
  }, []);

  const onPlaceChanged = (type: 'origen' | 'destino', setFieldValue: any) => {
    const autocomplete = type === 'origen' ? originRef.current : destinationRef.current;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const newCoord = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      const fieldName = type === 'origen' ? 'pickup_direction' : 'delivery_direction';
      setFieldValue(fieldName, place.formatted_address);

      setCoords((prev) => {
        const newCoords = { ...prev, [type]: newCoord };
        if (newCoords.origen && newCoords.destino) {
          calcularRutaReal(newCoords.origen, newCoords.destino);
        }
        return newCoords;
      });
    }
  };

  const inputStyle = 'w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all';
  const readOnlyStyle = 'w-full rounded-xl border border-border bg-muted/10 px-4 py-3 text-muted-foreground cursor-not-allowed outline-none italic';
  const errorLabel = 'text-red-500 text-[10px] mt-1 font-bold uppercase ml-2 text-left';

  if (!isLoaded) return <div className="p-10 text-center font-bold text-primary animate-pulse text-lg">Iniciando TrackiFly...</div>;

  return (
    <Formik
      initialValues={{
        name: '',
        description: '',
        category_id: '',
        image: '',
        pickup_direction: OBELISCO_ADDRESS,
        delivery_direction: '',
        weight: '',
        height: '',
        width: '',
        depth: '',
        unit: 'cm',
        fragile: false,
        dangerous: false,
        cooled: false,
        urgent: false,
      }}
      validate={(values) => {
        const shipmentValues = {
          ...values,
          height: Number(values.height) || 0,
          width: Number(values.width) || 0,
          depth: Number(values.depth) || 0,
          weight: Number(values.weight) || 0,
          distance: distance,
        };

        const errors: any = validateShipment(shipmentValues);

        if (!values.description) {
          errors.description = 'Requerido';
        } else if (values.description.length < 10) {
          errors.description = 'Muy corta (mín. 10 caracteres)';
        }

        const pesoNum = Number(values.weight);
        if (!values.weight) {
          errors.weight = 'Requerido';
        } else if (pesoNum <= 0) {
          errors.weight = 'Debe ser mayor a 0';
        } else if (pesoNum > 500) {
          errors.weight = 'Máximo 500kg por envío';
        }

        if (!values.name) errors.name = 'Requerido';
        if (!values.category_id) errors.category_id = 'Seleccioná categoría';
        if (!values.image) errors.image = 'URL obligatoria';
        if (!values.pickup_direction) errors.pickup_direction = 'Origen requerido';
        if (!values.delivery_direction) errors.delivery_direction = 'Destino requerido';

        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        if (distance === 0) {
          alert('Selecciona origen y destino válidos en el mapa para calcular la distancia.');
          setSubmitting(false);
          return;
        }
        if (!userData?.user?.id) {
          alert('Debes estar logueado para realizar un envío.');
          setSubmitting(false);
          return;
        }

        const { precioFinal, pConDesc } = getCalculatedPrices(values);

        try {
          const orderToSave = { 
            ...values, 
            distance, 
            userId: userData.user.id,
            price: precioFinal.toFixed(2), 
            total_amount: pConDesc.toFixed(2), 
          };
          const response = await createOrder(orderToSave);

          if (response) {
            alert('¡Pedido confirmado con éxito!');
            router.push('/dashboard/user');
          }
        } catch (error: any) {
          console.error('Error al crear la orden:', error);
          alert(error.message || 'Hubo un problema al guardar tu pedido. Reintentá.');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, setFieldValue, errors, touched, isSubmitting, submitCount }) => {
        const { precioFinal, volumenM3, pesoNum } = getCalculatedPrices(values);

        return (
          <main className="min-h-screen bg-background px-4 py-10">
            <div className="mx-auto max-w-7xl">
              <Form className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                <div className="flex-1 space-y-8">
                  <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold border-b border-border pb-2 uppercase text-foreground">Detalles del Producto</h3>
                    <div className="grid gap-4">
                      <div>
                        <Field name="name" placeholder="Nombre del producto" className={`${inputStyle} ${errors.name && (touched.name || submitCount > 0) ? 'border-red-500' :''}`} />
                        {errors.name && (touched.name || submitCount > 0) && <p className={errorLabel}>{errors.name}</p>}
                      </div>

                      <div>
                        <Field as="textarea" name="description" placeholder="Descripción detallada del contenido..." className={`${inputStyle} h-24 resize-none ${errors.description && (touched.description || submitCount > 0) ? 'border-red-500' : ''}`} />
                        {errors.description && (touched.description || submitCount > 0) && <p className={errorLabel}>{errors.description}</p>}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Field as="select" name="category_id" className={`${inputStyle} ${errors.category_id && (touched.category_id || submitCount > 0) ? 'border-red-500' : ''}`}>
                            <option value="">Selecciona una categoría</option>
                            {backendCategories.length > 0 ? (
                              backendCategories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))
                            ) : (
                              <option disabled>Cargando...</option>
                            )}
                          </Field>
                          {errors.category_id && (touched.category_id || submitCount > 0) && <p className={errorLabel}>{errors.category_id}</p>}
                        </div>
                        <div>
                          <Field name="image" placeholder="URL Imagen" className={`${inputStyle} ${errors.image && (touched.image || submitCount > 0) ? 'border-red-500' : ''}`} />
                          {errors.image && (touched.image || submitCount > 0) && <p className={errorLabel}>{errors.image}</p>}
                        </div>
                      </div>

                      <div className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Field name="height" placeholder="Altura" type="number" className={`${inputStyle} ${errors.height && (touched.height || submitCount > 0) ? 'border-red-500' : ''}`} />
                          {errors.height && (touched.height || submitCount > 0) && <p className={errorLabel}>{errors.height}</p>}
                        </div>
                        <div className="flex-1">
                          <Field name="width" placeholder="Ancho" type="number" className={`${inputStyle} ${errors.width && (touched.width || submitCount > 0) ? 'border-red-500' : ''}`} />
                          {errors.width && (touched.width || submitCount > 0) && <p className={errorLabel}>{errors.width}</p>}
                        </div>
                        <div className="flex-1">
                          <Field name="depth" placeholder="Profundidad" type="number" className={`${inputStyle} ${errors.depth && (touched.depth || submitCount > 0) ? 'border-red-500' : ''}`} />
                          {errors.depth && (touched.depth || submitCount > 0) && <p className={errorLabel}>{errors.depth}</p>}
                        </div>
                        <Field as="select" name="unit" className="h-12.5 rounded-xl border border-border bg-surface-muted px-2 font-bold">
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </Field>
                      </div>

                      <div>
                        <Field name="weight" placeholder="Peso (kg)" type="number" className={`${inputStyle} ${errors.weight && (touched.weight || submitCount > 0) ? 'border-red-500' : ''}`} />
                        {errors.weight && (touched.weight || submitCount > 0) && <p className={errorLabel}>{errors.weight}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                      <h3 className="text-lg font-bold uppercase text-foreground">Trayecto</h3>
                      <button type="button" onClick={() => handleSwapObelisco(setFieldValue)} className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary hover:text-white font-bold transition-all uppercase">
                        ⇅ Intercambiar de lugar Obelisco
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 mb-4">
                      <div>
                        {obeliscoIsOrigin ? (
                          <input readOnly value={OBELISCO_ADDRESS} className={readOnlyStyle} />
                        ) : (
                          <Autocomplete onLoad={(ref) => (originRef.current = ref)} onPlaceChanged={() => onPlaceChanged('origen', setFieldValue)}>
                            <input type="text" placeholder="Origen" className={inputStyle} />
                          </Autocomplete>
                        )}
                        {errors.pickup_direction && submitCount > 0 && <p className={errorLabel}>{errors.pickup_direction}</p>}
                      </div>
                      <div>
                        {!obeliscoIsOrigin ? (
                          <input readOnly value={OBELISCO_ADDRESS} className={readOnlyStyle} />
                        ) : (
                          <Autocomplete onLoad={(ref) => (destinationRef.current = ref)} onPlaceChanged={() => onPlaceChanged('destino', setFieldValue)}>
                            <input type="text" placeholder="Destino" className={inputStyle} />
                          </Autocomplete>
                        )}
                        {errors.delivery_direction && submitCount > 0 && <p className={errorLabel}>{errors.delivery_direction}</p>}
                      </div>
                    </div>

                    <div className="relative h-100 rounded-xl overflow-hidden border border-border shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)]">
                      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1">
                        <button type="button" onClick={() => mapRef?.setZoom((mapRef.getZoom() || 12) + 1)} className="flex h-9 w-9 items-center justify-center rounded-t-lg border-b border-border bg-surface text-xl font-bold text-muted shadow-sm hover:bg-surface-muted active:bg-surface">
                          +
                        </button>
                        <button type="button" onClick={() => mapRef?.setZoom((mapRef.getZoom() || 12) - 1)} className="flex h-9 w-9 items-center justify-center rounded-b-lg border border-border bg-surface text-xl font-bold text-muted shadow-sm hover:bg-surface-muted active:bg-surface">
                          −
                        </button>
                      </div>

                      <GoogleMap onLoad={(map) => setMapRef(map)} mapContainerStyle={mapContainerStyle} center={coords.origen || centerDefault} zoom={12} options={{ disableDefaultUI: true, zoomControl: false }}>
                        {coords.origen && <Marker position={coords.origen} label={{ text: 'A', color: 'white', fontWeight: 'bold' }} />}
                        {coords.destino && <Marker position={coords.destino} label={{ text: 'B', color: 'white', fontWeight: 'bold' }} />}
                        {routePath.length > 0 && <Polyline path={routePath} options={{ strokeColor: '#D96B4A', strokeWeight: 5, strokeOpacity: 0.9 }} />}
                      </GoogleMap>
                    </div>
                  </div>
                </div>

                <div className="lg:w-96 shrink-0">
                  <div className="rounded-2xl bg-surface p-8 shadow-xl text-foreground border border-border h-fit">
                    <h2 className="text-xl font-black mb-6 border-b border-border pb-2 uppercase">Presupuesto</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-muted">
                        <span>Trayecto:</span>
                        <span className="text-foreground font-mono">{distance.toFixed(1)} km</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted">
                        <span>Volumen:</span>
                        <span className="text-foreground font-mono">{volumenM3.toFixed(4)} m³</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted">
                        <span>Peso:</span>
                        <span className="text-foreground font-mono">{pesoNum} kg</span>
                      </div>
                      <div className="pt-4 space-y-3">
                        {['fragile', 'dangerous', 'cooled', 'urgent'].map((serv) => (
                          <label key={serv} className="flex items-center gap-3 cursor-pointer hover:text-primary text-xs font-bold uppercase">
                            <Field type="checkbox" name={serv} className="accent-primary h-4 w-4" />
                            {serv === 'fragile' ? 'Frágil (+15%)' : serv === 'dangerous' ? 'Peligroso (+30%)' : serv === 'cooled' ? 'Refrigerado (+20%)' : 'Urgente (+50%)'}
                          </label>
                        ))}
                      </div>
                      <div className="flex justify-between items-baseline text-3xl border-t border-border pt-6 mt-6">
                        <span className="font-black italic text-lg uppercase">Neto:</span>
                        <span className="font-black text-primary">
                          $
                          {precioFinal.toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="mt-8 w-full rounded-xl bg-primary py-4 font-black text-white hover:bg-primary-hover transition-all active:scale-95 shadow-lg uppercase">
                      {isSubmitting ? 'REGISTRANDO...' : 'CONFIRMAR ENVÍO'}
                    </button>
                    {Object.keys(errors).length > 0 && submitCount > 0 && <p className="text-red-500 text-[10px] mt-4 text-center font-bold animate-pulse uppercase">Corrija los errores resaltados</p>}
                  </div>
                </div>
              </Form>
            </div>
          </main>
        );
      }}
    </Formik>
  );
};

export default OrderView;