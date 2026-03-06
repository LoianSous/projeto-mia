import type { Point } from "@/types/Point";
import { getPhotoByIphanCode } from "@/config/sitePhotos";

type Feature = {
  type: "Feature";
  id?: string;
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: Record<string, any>;
};

type FC = { type: "FeatureCollection"; features: Feature[] };

type ComplementarySiteData = {
  caracteristicas?: string;
  solo?: string;
  integridade?: string;
  pesquisa?: string;
  responsavel?: string;
};

type ComplementaryDataMap = Record<string, ComplementarySiteData>;

const IPHAN_PROXY = "https://iphan-proxy.loian-araujo.workers.dev/";

async function loadComplementaryData(): Promise<ComplementaryDataMap> {
  try {
    const res = await fetch("/dados-complementares.json");

    if (!res.ok) {
      console.warn("Não foi possível carregar dados complementares.", res.status);
      return {};
    }

    const json = (await res.json()) as ComplementaryDataMap;
    console.log("JSON carregado:", json);
    return json;
  } catch (error) {
    console.warn("Erro ao carregar dados complementares:", error);
    return {};
  }
}

function extractShortCode(title: string): string {
  const match = title.match(/\(([A-Z]+[0-9]+)\)/i);
  return match?.[1]?.toUpperCase() ?? "";
}

export async function loadPointsFromIphanBbox(bbox: {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}): Promise<Point[]> {
  const { minLat, minLng, maxLat, maxLng } = bbox;

  const url =
    `${IPHAN_PROXY}?service=WFS&version=1.0.0&request=GetFeature` +
    `&typeName=SICG:sitios&outputFormat=application/json&srsName=EPSG:4326` +
    `&bbox=${minLng},${minLat},${maxLng},${maxLat},EPSG:4326` +
    `&maxFeatures=5000`;

  const [iphanRes, complementaryData] = await Promise.all([
    fetch(url),
    loadComplementaryData(),
  ]);

  if (!iphanRes.ok) {
    throw new Error(`Proxy IPHAN erro: ${iphanRes.status}`);
  }

  const data = (await iphanRes.json()) as FC;

  return (data.features ?? []).map((f, i) => {
    const [lng, lat] = f.geometry.coordinates;
    const p = f.properties ?? {};

    const code = p.co_iphan ? String(p.co_iphan) : "";
    const title = p.identificacao_bem ?? "Sítio arqueológico";
    const shortCode = extractShortCode(title);

    const extra =
      complementaryData[shortCode] ??
      complementaryData[title] ??
      complementaryData[code] ??
      {};

    console.log("TITLE:", title);
    console.log("co_iphan:", code);
    console.log("shortCode:", shortCode);
    console.log("extra encontrado:", extra);

    return {
      id: String(p.id_bem ?? f.id ?? `iphan-${i}`),
      lat,
      lng,

      title,
      location: code ? `Código: ${code}` : "",

      categoria: p.ds_tipo_bem ?? "",
      periodo: p.ds_classificacao ?? "",

      responsavel: extra.responsavel ?? "",
      caracteristicas: extra.caracteristicas ?? p.sintese_bem ?? "",
      soil: extra.solo ?? "",
      risks: extra.integridade ?? "",
      pesquisa: extra.pesquisa ?? "",

      imageUrl: getPhotoByIphanCode(code) ?? undefined,
    } as Point;
  });
}