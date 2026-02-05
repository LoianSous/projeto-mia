import Link from "next/link";
import { notFound } from "next/navigation";
import Papa from "papaparse";
import { ArrowLeft, Navigation, MapPin, AlertCircle } from "lucide-react";
import { CSV_URL } from "@/config/appConfig";
import type { Point } from "@/types/Point";

type CsvRow = Record<string, any>;

function toPoint(row: CsvRow, index: number): Point | null {
  const lat = parseFloat(row.lat);
  const lng = parseFloat(row.lng);

  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return {
    id: row.id || `csv-${index}`,
    lat,
    lng,
    title: row.title || "Sem título",
    location: row.location || "Localização não especificada",
    caracteristicas: row.caracteristicas || row.characteristics,
    soil: row.soil || row.solo,
    risks: row.risks || row.riscos,
    responsavel: row.responsavel || row.responsible,
    categoria: row.categoria || row.category,
    periodo: row.periodo || row.period,
  };
}

async function getAllPoints(): Promise<Point[]> {
  // Em build/export, isso roda no build do GitHub Actions
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`Falha ao buscar CSV (${res.status})`);

  const csvText = await res.text();
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

  const rows = (parsed.data as CsvRow[]) || [];
  const points: Point[] = [];

  rows.forEach((row, idx) => {
    const p = toPoint(row, idx);
    if (p) points.push(p);
  });

  return points;
}

export async function generateStaticParams() {
  const points = await getAllPoints();
  return points.map((p) => ({ id: String(p.id) }));
}

export default async function PointDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const points = await getAllPoints();
  const point = points.find((p) => String(p.id) === String(params.id));

  if (!point) notFound();

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
                rel="noreferrer"
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors w-full justify-center font-medium"
              >
                <Navigation className="w-5 h-5" />
                Abrir rota no Google Maps
              </a>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4">
              <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5" />
              <p className="text-sm text-amber-900">
                Observação: no GitHub Pages (static export), esta página “/mapa/[id]”
                é gerada no momento do deploy. Se a planilha mudar, você precisa
                redeployar para atualizar estas páginas de detalhe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
