"use client";

import { useCallback, useRef, useState } from "react";
import {
  Autocomplete,
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];
const mapContainerStyle = { width: "100%", height: "100%" };
const centerDefault = { lat: -34.5997, lng: -58.3819 };

interface RouteMapFieldsProps {
  pickupDirection: string;
  deliveryDirection: string;
  setFieldValue: (field: string, value: unknown) => void;
  fixedAddress?: string;
  fixedCoords?: google.maps.LatLngLiteral;
  fixedStartsAsOrigin?: boolean;
  fixedLocationName?: string;
}

const inputClassName =
  "w-full rounded-lg border border-border bg-surface-muted text-foreground placeholder-muted px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

const readOnlyClassName =
  "w-full rounded-lg border border-border bg-surface-muted text-foreground px-2 py-1.5 text-sm outline-none opacity-80";

const RouteMapFields = ({
  pickupDirection,
  deliveryDirection,
  setFieldValue,
  fixedAddress,
  fixedCoords,
  fixedStartsAsOrigin = true,
  fixedLocationName = "sede fija",
}: RouteMapFieldsProps) => {
  const [fixedIsOrigin, setFixedIsOrigin] = useState(fixedStartsAsOrigin);
  const [coords, setCoords] = useState<{
    origen: google.maps.LatLngLiteral | null;
    destino: google.maps.LatLngLiteral | null;
  }>({
    origen: fixedCoords && fixedStartsAsOrigin ? fixedCoords : null,
    destino: fixedCoords && !fixedStartsAsOrigin ? fixedCoords : null,
  });
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  const originRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

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

            if (mapRef && result.routes[0].bounds) {
              mapRef.fitBounds(result.routes[0].bounds);
            }
          }
        },
      );
    },
    [mapRef, setFieldValue],
  );

  const handleSwapFixedLocation = () => {
    if (!fixedAddress || !fixedCoords) return;

    const nextIsOrigin = !fixedIsOrigin;
    setFixedIsOrigin(nextIsOrigin);
    setFieldValue("distance", 0);
    setRoutePath([]);

    if (nextIsOrigin) {
      setFieldValue("pickup_direction", fixedAddress);
      setFieldValue("delivery_direction", "");
      setCoords({ origen: fixedCoords, destino: null });
      return;
    }

    setFieldValue("pickup_direction", "");
    setFieldValue("delivery_direction", fixedAddress);
    setCoords({ origen: null, destino: fixedCoords });
  };

  const onPlaceChanged = (type: "origen" | "destino") => {
    const autocomplete =
      type === "origen" ? originRef.current : destinationRef.current;

    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const newCoord = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    const fieldName =
      type === "origen" ? "pickup_direction" : "delivery_direction";
    setFieldValue(fieldName, place.formatted_address ?? "");

    setCoords((prev) => {
      const newCoords = { ...prev, [type]: newCoord };

      if (newCoords.origen && newCoords.destino) {
        calcularRutaReal(newCoords.origen, newCoords.destino);
      }

      return newCoords;
    });
  };

  if (!isLoaded) {
    return <div className="text-sm text-muted">Cargando mapa...</div>;
  }

  return (
    <div className="space-y-3">
      {fixedAddress && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSwapFixedLocation}
            className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary hover:text-white font-bold transition-all uppercase"
          >
            {`Intercambiar de lugar ${fixedLocationName}`}
          </button>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          {fixedAddress && fixedIsOrigin ? (
            <input
              type="text"
              readOnly
              value={fixedAddress}
              className={readOnlyClassName}
            />
          ) : (
            <Autocomplete
              onLoad={(ref) => (originRef.current = ref)}
              onPlaceChanged={() => onPlaceChanged("origen")}
            >
              <input
                type="text"
                placeholder="Punto de origen"
                defaultValue={pickupDirection}
                className={inputClassName}
              />
            </Autocomplete>
          )}
        </div>

        <div>
          {fixedAddress && !fixedIsOrigin ? (
            <input
              type="text"
              readOnly
              value={fixedAddress}
              className={readOnlyClassName}
            />
          ) : (
            <Autocomplete
              onLoad={(ref) => (destinationRef.current = ref)}
              onPlaceChanged={() => onPlaceChanged("destino")}
            >
              <input
                type="text"
                placeholder="Punto de entrega"
                defaultValue={deliveryDirection}
                className={inputClassName}
              />
            </Autocomplete>
          )}
        </div>
      </div>

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
    </div>
  );
};

export default RouteMapFields;
