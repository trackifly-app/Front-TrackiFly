'use client'
import { useState, useRef, useCallback } from "react";
import {GoogleMap, useJsApiLoader, Marker, Polyline, Autocomplete } from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];
const mapContainerStyle = { width: "100%", height: "100%" };
const centerDefault = { lat: -34.5997, lng: -58.3819 };

interface RouteMapFieldsProps {
  pickupDirection: string;
  deliveryDirection: string;
  setFieldValue: (field: string, value: unknown) => void;
}

const RouteMapFields = ({
  pickupDirection,
  deliveryDirection,
  setFieldValue,
}: RouteMapFieldsProps) => {
    const [coords, setCoords] = useState<{
        origen: google.maps.LatLngLiteral | null;
        destino: google.maps.LatLngLiteral | null;
    }>({ origen: null, destino: null });

    const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([]);

    // Referencia al mapa para controlar el zoom y encuadre manualmente
    const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

    // Referencias para los inputs de autocompletado de Google Maps
    const originRef = useRef<google.maps.places.Autocomplete | null>(null);
    const destinationRef = useRef<google.maps.places.Autocomplete | null>(null);
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });
    //========================FUNCION QUE CALCULA RUTA REAL=======================
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
            if (status === "OK" && result) {
                const distKm =
                (result.routes[0].legs[0].distance?.value || 0) / 1000;
                setFieldValue("distance", distKm);
                const path = result.routes[0].overview_path.map((p) => ({
                lat: p.lat(),
                lng: p.lng(),
                }));
                setRoutePath(path);

                // Ajuste automático del mapa para mostrar toda la ruta
                if (mapRef && result.routes[0].bounds) {
                mapRef.fitBounds(result.routes[0].bounds);
                }
            }
            },
        );
        },
        [mapRef, setFieldValue],
    );
    //========================FIN FUNCION QUE CALCULA RUTA REAL=======================
      // ========================================
    // FUNCIÓN: onPlaceChanged
    // Maneja el cambio de ubicación en los inputs de autocompletado
    // Actualiza coordenadas y calcula la ruta cuando ambas se seleccionan
    // ========================================
    const onPlaceChanged = (type: "origen" | "destino") => {
        const autocomplete =
        type === "origen" ? originRef.current : destinationRef.current;
        if (autocomplete) {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        const newCoord = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };

        const fieldName =
            type === "origen" ? "pickup_direction" : "delivery_direction";
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
    if(!isLoaded){
        return(
             <div className="text-sm text-muted">Cargando mapa...</div>
        );
    }
    return (
        
        <div className="space-y-3">
            {/* =======================INPUTS========================== */}
            <Autocomplete
                onLoad={(ref) => (originRef.current = ref)}
                onPlaceChanged={() => onPlaceChanged("origen")}
                >
                <input
                    type="text"
                    placeholder="Punto de origen"
                    defaultValue={pickupDirection}
                    className="w-full rounded-lg border border-border bg-surface-muted text-foreground placeholder-muted px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
            </Autocomplete>                    
            <Autocomplete
                onLoad={(ref) => (destinationRef.current = ref)}
                onPlaceChanged={() => onPlaceChanged("destino")}
                >
                <input
                    type="text"
                    placeholder="Punto de entrega"
                    defaultValue={deliveryDirection}
                    className="w-full rounded-lg border border-border bg-surface-muted text-foreground placeholder-muted px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
            </Autocomplete>
            {/* ======================= FIN INPUTS========================== */}
            {/* ======================= GOOGLE MAPS ========================== */}
            <div className="relative h-52 rounded-xl overflow-hidden border border-border">
                <GoogleMap
                    onLoad={(map) => setMapRef(map)}
                    mapContainerStyle={mapContainerStyle}
                    center={coords.origen || centerDefault}
                    zoom={12}
                    options={{
                        disableDefaultUI: true,
                        zoomControl: false,
                    }}
                    >
                    {coords.origen && (
                        <Marker
                        position={coords.origen}
                        label={{
                            text: "A",
                            color: "white",
                            fontWeight: "bold",
                        }}
                        />
                    )}
                    {coords.destino && (
                        <Marker
                        position={coords.destino}
                        label={{
                            text: "B",
                            color: "white",
                            fontWeight: "bold",
                        }}
                        />
                    )}
                    {routePath.length > 0 && (
                        <Polyline
                        path={routePath}
                        options={{
                            strokeColor: "#D96B4A",
                            strokeWeight: 5,
                            strokeOpacity: 0.9,
                        }}
                        />
                    )}
                </GoogleMap>
            </div>
            {/* ======================= FIN GOOGLE MAPS ========================== */}
        </div>
    );
    
};
export default RouteMapFields;
