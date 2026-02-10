'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, AlertCircle, Map as MapIcon } from 'lucide-react';

import { Point } from '@/types/Point';
import MapPointModal from '@/components/MapPointModal';
import { loadPointsFromIphanBbox } from '@/services/loadPointsFromIphan';

type BoundsPayload = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
  zoom: number;
};

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
    </div>
  ),
});

export default function MapSection() {
  const [mounted, setMounted] = useState(false);

  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false); // agora é loading por bbox
  const [error, setError] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  // debounce + evitar re-fetch do mesmo bbox
  const debounceRef = useRef<number | null>(null);
  const lastKeyRef = useRef<string>('');

  // ajuste aqui se quiser carregar com zoom mais afastado
  const MIN_ZOOM_TO_LOAD = 7;

  useEffect(() => setMounted(true), []);

  const filteredPoints = useMemo(() => points, [points]);

  const handlePointSelect = (point: Point) => setSelectedPoint(point);
  const handlePointClose = () => setSelectedPoint(null);

  const handleBoundsChange = (b: BoundsPayload) => {
    if (!mounted) return;

    // evita puxar o "Brasil inteiro" e travar
    if (b.zoom < MIN_ZOOM_TO_LOAD) {
      setPoints([]);
      setError(null);
      setLoading(false);
      return;
    }

    // chave simples para evitar bater na API com mudanças mínimas
    const key = [
      b.zoom,
      b.minLat.toFixed(3),
      b.minLng.toFixed(3),
      b.maxLat.toFixed(3),
      b.maxLng.toFixed(3),
    ].join('|');

    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;

    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await loadPointsFromIphanBbox({
          minLat: b.minLat,
          minLng: b.minLng,
          maxLat: b.maxLat,
          maxLng: b.maxLng,
        });

        setPoints(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados do IPHAN.');
      } finally {
        setLoading(false);
      }
    }, 450);
  };

  // UI inicial: enquanto não montou (SSR off do mapa)
  if (!mounted) {
    return (
      <section id="mapa" className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
              <MapIcon className="w-7 h-7 text-orange-600" />
              Mapa Interativo
            </h2>
            <p className="text-gray-700 mt-2 max-w-2xl">
              Clique em um marcador para abrir as informações do sítio.
            </p>
          </div>
        </div>

        <div className="h-[70vh] md:h-[640px] flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-200">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600">Preparando mapa...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="mapa" className="container mx-auto px-4 py-16">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
            <MapIcon className="w-7 h-7 text-orange-600" />
            Mapa Interativo
          </h2>
          <p className="text-gray-700 mt-2 max-w-2xl">
            Clique em um marcador para abrir as informações do sítio.
          </p>
        </div>
      </div>

      <div className="relative rounded-2xl border border-gray-200 overflow-hidden bg-white h-[70vh] md:h-[640px]">
        <MapView
          mapKey="map-home"
          points={filteredPoints}
          selectedPoint={selectedPoint}
          onPointSelect={handlePointSelect}
          onMapClick={handlePointClose}
          center={selectedPoint ? { lat: selectedPoint.lat, lng: selectedPoint.lng } : undefined}
          onBoundsChange={handleBoundsChange}
        />

        {/* overlays */}
        {loading && (
          <div className="absolute top-4 left-4 z-[1200] bg-white/90 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 shadow">
            Carregando sítios do IPHAN...
          </div>
        )}

        {!loading && !error && points.length === 0 && (
          <div className="absolute bottom-4 left-4 z-[1200] bg-white/90 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 shadow">
            Aproxime o zoom para carregar os sítios (zoom ≥ {MIN_ZOOM_TO_LOAD}).
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-4 z-[1200] bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 shadow">
            {error}
          </div>
        )}

        {selectedPoint && <MapPointModal point={selectedPoint} onClose={handlePointClose} />}
      </div>
    </section>
  );
}
