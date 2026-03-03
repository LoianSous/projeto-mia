"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Point } from "@/types/Point";
import Filters from "@/components/Filters";
import PointsList from "@/components/PointsList";
import PointPanel from "@/components/PointPanel";
import MobileSheet from "@/components/MobileSheet";
import { Loader2, AlertCircle } from "lucide-react";
import { loadPointsFromIphanBbox } from "@/services/loadPointsFromIphan";

type BoundsPayload = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
  zoom: number;
};

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
    </div>
  ),
});

export default function MapaClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false); // agora loading por bbox
  const [error, setError] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategoria, setSelectedCategoria] = useState(
    searchParams.get("cat") || ""
  );
  const [selectedPeriodo, setSelectedPeriodo] = useState(
    searchParams.get("periodo") || ""
  );

  // ====== Controle de re-fetch por bbox (igual sua Home) ======
  const mountedRef = useRef(false);
  const debounceRef = useRef<number | null>(null);
  const lastKeyRef = useRef<string>("");

  const MIN_ZOOM_TO_LOAD = 7;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  const handleBoundsChange = (b: BoundsPayload) => {
    if (!mountedRef.current) return;

    // Evita puxar o "Brasil inteiro"
    if (b.zoom < MIN_ZOOM_TO_LOAD) {
      setPoints([]);
      setError(null);
      setLoading(false);
      return;
    }

    const key = [
      b.zoom,
      b.minLat.toFixed(3),
      b.minLng.toFixed(3),
      b.maxLat.toFixed(3),
      b.maxLng.toFixed(3),
    ].join("|");

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
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar dados do IPHAN."
        );
      } finally {
        setLoading(false);
      }
    }, 450);
  };

  // Atualiza querystring (mesmo comportamento que você já tinha)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategoria) params.set("cat", selectedCategoria);
    if (selectedPeriodo) params.set("periodo", selectedPeriodo);

    const queryString = params.toString();
    const newUrl = queryString ? `/mapa?${queryString}` : "/mapa";
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, selectedCategoria, selectedPeriodo, router]);

  // Filtra os pontos carregados na área atual
  const filteredPoints = useMemo(() => {
    return points.filter((point) => {
      const title = (point.title || "").toLowerCase();
      const location = (point.location || "").toLowerCase();
      const resp = (point.responsavel || "").toLowerCase();

      const q = searchQuery.toLowerCase();

      const matchesSearch =
        !searchQuery || title.includes(q) || location.includes(q) || resp.includes(q);

      const matchesCategoria =
        !selectedCategoria || point.categoria === selectedCategoria;

      const matchesPeriodo =
        !selectedPeriodo || point.periodo === selectedPeriodo;

      return matchesSearch && matchesCategoria && matchesPeriodo;
    });
  }, [points, searchQuery, selectedCategoria, selectedPeriodo]);

  // Listas de filtros (podem ficar vazias se IPHAN não trouxer esses campos)
  const availableCategorias = useMemo(() => {
    const cats = new Set(
      points.map((p) => p.categoria).filter((c): c is string => !!c)
    );
    return Array.from(cats).sort();
  }, [points]);

  const availablePeriodos = useMemo(() => {
    const pers = new Set(
      points.map((p) => p.periodo).filter((p): p is string => !!p)
    );
    return Array.from(pers).sort();
  }, [points]);

  const handlePointSelect = (point: Point) => setSelectedPoint(point);
  const handlePointClose = () => setSelectedPoint(null);

  // UI de erro “geral” (mas mantém o mapa visível também)
  // Aqui não travo a tela inteira porque o carregamento depende do zoom/bounds.
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Sítios Arqueológicos
            </h2>

            <Filters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategoria={selectedCategoria}
              onCategoriaChange={setSelectedCategoria}
              selectedPeriodo={selectedPeriodo}
              onPeriodoChange={setSelectedPeriodo}
              categorias={availableCategorias}
              periodos={availablePeriodos}
            />

            {/* avisos */}
            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!error && points.length === 0 && (
              <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                Aproxime o zoom para carregar os sítios (zoom ≥ {MIN_ZOOM_TO_LOAD}).
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <PointsList
              points={filteredPoints}
              selectedPoint={selectedPoint}
              onPointClick={handlePointSelect}
            />
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        <MapView
          key="map-page"
          mapKey="map-page"
          points={filteredPoints}
          selectedPoint={selectedPoint}
          onPointSelect={handlePointSelect}
          onMapClick={handlePointClose}
          center={
            selectedPoint
              ? { lat: selectedPoint.lat, lng: selectedPoint.lng }
              : undefined
          }
          onBoundsChange={handleBoundsChange}
        />

        {/* overlay loading */}
        {loading && (
          <div className="absolute top-4 left-4 z-[1200] bg-white/90 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 shadow">
            Carregando sítios do IPHAN...
          </div>
        )}
      </div>

      {/* Painel do ponto */}
      {selectedPoint && (
        <>
          <div className="hidden md:block md:w-80 lg:w-96 bg-white border-l border-gray-200 flex-shrink-0">
            <PointPanel point={selectedPoint} onClose={handlePointClose} />
          </div>

          <MobileSheet isOpen={!!selectedPoint} onClose={handlePointClose}>
            <PointPanel point={selectedPoint} onClose={handlePointClose} />
          </MobileSheet>
        </>
      )}
    </div>
  );
}