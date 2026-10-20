
import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";

const DEFAULT_CENTER = {
  lat: 28.6139,
  lng: 77.209,
};

function LocationTracker() {
  const map = useMap();
  const [position, setPosition] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (result) => {
        const coords = {
          lat: result.coords.latitude,
          lng: result.coords.longitude,
        };

        setPosition(coords);
        setError("");

        if (map) {
          map.panTo(coords);
        }
      },
      (err) => {
        const messages = {
          1: "Location permission denied. Allow location access.",
          2: "Your current location is unavailable.",
          3: "Location request timed out. Try again.",
        };

        setError(messages[err.code] || err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 15000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [map]);

  return (
    <>
      {error && <p role="alert">{error}</p>}

      {!position && !error && (
        <p>Detecting your location...</p>
      )}

      <Map
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={15}
        mapId="DEMO_MAP_ID"
        style={{ width: "100%", height: "500px" }}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
      >
        {position && (
          <AdvancedMarker position={position}>
            <Pin
              background="#4285F4"
              borderColor="#1A73E8"
              glyphColor="#FFFFFF"
            />
          </AdvancedMarker>
        )}
      </Map>
    </>
  );
}

export default function LiveLocationMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <p>Google Maps API key is missing from .env</p>;
  }

  return (
    <APIProvider apiKey={apiKey}>
      <LocationTracker />
    </APIProvider>
  );
}
