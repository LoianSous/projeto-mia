'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Point } from '@/types/Point';
import { loadPointsFromCsv } from '@/services/loadPointsFromCsv';
import { CSV_URL } from '@/config/appConfig';
import { Loader2, AlertCircle, ArrowLeft, Navigation, MapPin } from 'lucide-react';

export default function PointDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pointId = params.id as string;

  const [point, setPoint] = useState<Point | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPoint = async () => {
      try {
        setLoading(true);
        setError(null);
        const points = await loadPointsFromCsv(CSV_URL);
        const foundPoint = points.find((p) => p.id === pointId);

        if (!foundPoint) {
          setError('Ponto não encontrado');
        } else {
          setPoint(foundPoint);
        }
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

    loadPoint();
  }, [pointId]);

  const openInGoogleMaps = () => {
    if (point) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error || !point) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {error || 'Ponto não encontrado'}
          </h2>
          <p className="text-gray-600 mb-4">
            O sítio arqueológico que você está procurando não foi encontrado.
          </p>
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Mapa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/mapa"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Mapa
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{point.title}</h1>
            <p className="text-orange-100">{point.location}</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
              <MapPin className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Coordenadas</h3>
                <p className="text-gray-700">
                  Latitude: {point.lat.toFixed(6)}
                  <br />
                  Longitude: {point.lng.toFixed(6)}
                </p>
              </div>
            </div>

            {(point.categoria || point.periodo) && (
              <div className="flex flex-wrap gap-2">
                {point.categoria && (
                  <span className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                    {point.categoria}
                  </span>
                )}
                {point.periodo && (
                  <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    {point.periodo}
                  </span>
                )}
              </div>
            )}

            {point.caracteristicas && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Características
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {point.caracteristicas}
                </p>
              </div>
            )}

            {point.soil && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Solo
                </h3>
                <p className="text-gray-700 leading-relaxed">{point.soil}</p>
              </div>
            )}

            {point.risks && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Riscos e Integridade
                </h3>
                <p className="text-gray-700 leading-relaxed">{point.risks}</p>
              </div>
            )}

            {point.responsavel && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Responsável pela Pesquisa
                </h3>
                <p className="text-gray-700">{point.responsavel}</p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={openInGoogleMaps}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors w-full justify-center font-medium"
              >
                <Navigation className="w-5 h-5" />
                Abrir rota no Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
