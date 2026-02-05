'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Point } from '@/types/Point';
import { MAP_CONFIG } from '@/config/appConfig';

const customIcon = new L.Icon({
  iconUrl: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/iconlocmap.png`,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
});



interface MapViewProps {
  points: Point[];
  selectedPoint: Point | null;
  onPointSelect: (point: Point) => void;
  center?: { lat: number; lng: number };
  onMapClick?: () => void;
}

function MapController({ center }: { center?: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 12, { animate: true });
    }
  }, [center, map]);

  return null;
}

function MapClickCatcher({ onMapClick }: { onMapClick?: () => void }) {
  useMapEvents({
    click: () => onMapClick?.(),
  });
  return null;
}

export default function MapView({ points, selectedPoint, onPointSelect, center, onMapClick }: MapViewProps) {

  const mapRef = useRef<L.Map | null>(null);

useEffect(() => {
  return () => {
    // IMPORTANT: limpa o container do Leaflet entre mounts (dev/fast refresh)
    mapRef.current?.remove();
    mapRef.current = null;
  };
}, []);


  const recenter = () => {
    if (mapRef.current) {
      mapRef.current.setView(
        [MAP_CONFIG.center.lat, MAP_CONFIG.center.lng],
        MAP_CONFIG.zoom
      );
    }
  };

  const goToMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mapRef.current) {
            mapRef.current.setView(
              [position.coords.latitude, position.coords.longitude],
              12
            );
          }
        },
        (error) => {
          alert('Não foi possível obter sua localização');
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[MAP_CONFIG.center.lat, MAP_CONFIG.center.lng]}
        zoom={MAP_CONFIG.zoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        className="w-full h-full"
        ref={mapRef as any}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickCatcher onMapClick={onMapClick} />

        <MapController center={center} />

        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onPointSelect(point),
            }}
          >
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={recenter}
          className="bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 transition-colors"
          aria-label="Recentrar mapa"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </button>
        <button
          onClick={goToMyLocation}
          className="bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 transition-colors"
          aria-label="Minha localização"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
