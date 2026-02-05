import Link from "next/link";
import { notFound } from "next/navigation";
import Papa from "papaparse";
import { AlertCircle, ArrowLeft, Navigation, MapPin } from "lucide-react";

import { CSV_URL } from "@/config/appConfig";
import { Point } from "@/types/Point";

// --- helper: baixa e converte CSV -> Point[]
async function fetchPointsFromCsv(url: string): Promise<Point[]> {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Falha ao carregar CSV (${res.status})`);
  }

  const csvText = await res.text();

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = (parsed.data as any[]) ?? [];

  // Ajuste aqui se seus nomes de colunas forem diferentes
  const points: Point[] = rows
    .map((row) => {
      const id = row.id ?? row.ID ?? row.Id;
      const title = row.title ?? row.titulo ?? row.nome ?? "";
      const location = row.location ?? row.localizacao ?? row.local ?? "";
      const latRaw = row.lat ?? row.latitude;
      const lngRaw = row.lng ?? row.lon ?? row.longitude;

      const lat = Number(latRaw);
      const lng = Number(lngRaw);

      if (!id || !title || !location || Number.isNaN(lat) || Number.isNaN(lng)) {
        return null;
      }

      const point: Point = {
        id: String(id),
        title: String(title),
        location: String(location),
        lat,
        lng,
        categoria: row.categoria ? String(row.categoria) : "",
        periodo: row.periodo ? String(row.periodo) : "",
        caracteristicas: row.caracteristicas ? String(row.caracteristicas) : "",
        soil: row.soil ? String(row.soil) : "",
        risks: row.risks ? String(row.risks) : "",
        responsavel: row.responsavel ? String(row.responsavel) : "",
      };

      return point;
    })
    .filter(Boolean) as Point[];

  return points;
}

// ✅ obrigatório para rotas dinâmicas com output: "export"
export async function generateStaticParams() {
  const points = await fetchPointsFromCsv(CSV_URL);
  return points.map((p) => ({ id: String(p.id) }));
}

export default async function PointDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let points: Point[] = [];

  try {
    points = await fetchPointsFromCsv(CSV_URL);
  } catch (e) {
    // Em export estático, se isso falhar no build, o job falha.
    // Aqui é mais para caso rode em dev.
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Erro ao carregar dados
          </h2>
          <p className="text-gray-600 mb-4">
            Não foi possível carregar o CSV agora.
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

  const point = points.find((p) => String(p.id) === String(params.id));

  if (!point) {
    // Você pode usar notFound(); mas vou manter seu layout de erro.
    // notFound(); // alternativa
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Ponto não encontrado
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

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;

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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Solo</h3>
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
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors w-full justify-center font-medium"
              >
                <Navigation className="w-5 h-5" />
                Abrir rota no Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
