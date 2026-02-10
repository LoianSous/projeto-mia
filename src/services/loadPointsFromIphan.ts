import type { Point } from "@/types/Point";

type Feature = {
  type: "Feature";
  id?: string;
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: Record<string, any>;
};

type FC = { type: "FeatureCollection"; features: Feature[] };

const IPHAN_PROXY = "https://iphan-proxy.loian-araujo.workers.dev/";

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
    `&maxFeatures=5000`; // limite razoável por tela

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Proxy IPHAN erro: ${res.status}`);

  const data = (await res.json()) as FC;

  return (data.features ?? []).map((f, i) => {
    const [lng, lat] = f.geometry.coordinates;
    const p = f.properties ?? {};

    return {
      id: String(p.id_bem ?? f.id ?? `iphan-${i}`),
      lat,
      lng,
      title: p.identificacao_bem ?? "Sítio arqueológico",
      location: p.co_iphan ? `Código: ${p.co_iphan}` : "",
      categoria: p.ds_tipo_bem ?? "",
      periodo: p.ds_classificacao ?? "",
      responsavel: "",
      caracteristicas: p.sintese_bem ?? "",
      soil: "",
      risks: "",
    };
  });
}
