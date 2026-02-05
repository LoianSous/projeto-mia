'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, AlertCircle, Map as MapIcon } from 'lucide-react';

import { Point } from '@/types/Point';
import { loadPointsFromCsv } from '@/services/loadPointsFromCsv';
import { CSV_URL } from '@/config/appConfig';
import MapPointModal from '@/components/MapPointModal';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
    </div>
  ),
});

export default function MapSection() {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await loadPointsFromCsv(CSV_URL);
        setPoints(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar dados. Tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // (deixa pronto pra você reativar filtros depois, se quiser)
  const filteredPoints = useMemo(() => points, [points]);

  const handlePointSelect = (point: Point) => setSelectedPoint(point);
  const handlePointClose = () => setSelectedPoint(null);

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

      {loading && (
        <div className="h-[70vh] md:h-[640px] flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-200">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando dados do mapa...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="h-[70vh] md:h-[640px] flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-200">
          <div className="text-center max-w-md p-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Erro ao Carregar Dados
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="relative rounded-2xl border border-gray-200 overflow-hidden bg-white h-[70vh] md:h-[640px]">
          <MapView
            points={filteredPoints}
            selectedPoint={selectedPoint}
            onPointSelect={handlePointSelect}
            onMapClick={handlePointClose} // ✅ vamos adicionar isso no MapView
            center={
              selectedPoint
                ? { lat: selectedPoint.lat, lng: selectedPoint.lng }
                : undefined
            }
          />

          {selectedPoint && (
            <MapPointModal point={selectedPoint} onClose={handlePointClose} />
          )}
        </div>
      )}
    </section>
  );
}
