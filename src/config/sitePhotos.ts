// src/config/sitePhotos.ts

// Chave = co_iphan (código do IPHAN)
// Valor = caminho dentro da pasta /public
export const SITE_PHOTOS_BY_CODE: Record<string, string> = {
  // EXEMPLO (Alto Paraná 34)
  MS5008305BAST00014: "/fotos/MS5008305BAST00014.jpeg",
  // EXEMPLO
  MS5008305BAST00012: "/fotos/MS5008305BAST00012.jpeg",
  MS5008305BAST00011: "/fotos/MS5008305BAST00011.jpeg",
  MS5008305BAST00006: "/fotos/MS5008305BAST00006.jpeg",
  // adicione os outros:
  // MS5008305BAST000XX: "/fotos/MS5008305BAST000XX.jpg",
};

export function getPhotoByIphanCode(code?: string | null) {
  if (!code) return null;
  const key = String(code).trim();
  return SITE_PHOTOS_BY_CODE[key] ?? null;
}