"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Point } from "@/types/Point";
import { loadPointsFromCsv } from "@/services/loadPointsFromCsv";
import { CSV_URL } from "@/config/appConfig";
import Filters from "@/components/Filters";
import PointsList from "@/components/PointsList";
import PointPanel from "@/components/PointPanel";
import MobileSheet from "@/components/MobileSheet";
import { Loader2, AlertCircle } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategoria, setSelectedCategoria] = useState(
    searchParams.get("cat") || ""
  );
  const [selectedPeriodo, setSelectedPeriodo] = useState(
    searchParams.get("periodo") || ""
  );

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
            : "Erro ao carregar dados. Tente novamente."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategoria) params.set("cat", selectedCategoria);
    if (selectedPeriodo) params.set("periodo", selectedPeriodo);

    const queryString = params.toString();
    const newUrl = queryString ? `/mapa?${queryString}` : "/mapa";
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, selectedCategoria, selectedPeriodo, router]);

  const filteredPoints = useMemo(() => {
    return points.filter((point) => {
      const matchesSearch =
        !searchQuery ||
        point.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (point.responsavel &&
          point.responsavel.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategoria =
        !selectedCategoria || point.categoria === selectedCategoria;

      const matchesPeriodo =
        !selectedPeriodo || point.periodo === selectedPeriodo;

      return matchesSearch && matchesCategoria && matchesPeriodo;
    });
  }, [points, searchQuery, selectedCategoria, selectedPeriodo]);

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

  const handlePointSelect = (point: Point) => {
    setSelectedPoint(point);
  };

  const handlePointClose = () => {
    setSelectedPoint(null);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados do mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Erro ao Carregar Dados
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden">
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

      <div className="flex-1 relative">
        <MapView
          points={filteredPoints}
          selectedPoint={selectedPoint}
          onPointSelect={handlePointSelect}
          center={
            selectedPoint
              ? { lat: selectedPoint.lat, lng: selectedPoint.lng }
              : undefined
          }
        />
      </div>

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
