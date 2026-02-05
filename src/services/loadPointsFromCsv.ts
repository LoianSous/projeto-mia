import Papa from 'papaparse';
import { Point } from '@/types/Point';

export async function loadPointsFromCsv(csvUrl: string): Promise<Point[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const points: Point[] = [];

          results.data.forEach((row: any, index: number) => {
            const lat = parseFloat(row.lat);
            const lng = parseFloat(row.lng);

            if (isNaN(lat) || isNaN(lng)) {
              return;
            }

            if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
              return;
            }

            const point: Point = {
              id: row.id || `csv-${index}`,
              lat,
              lng,
              title: row.title || 'Sem título',
              location: row.location || 'Localização não especificada',
              caracteristicas: row.caracteristicas || row.characteristics,
              soil: row.soil || row.solo,
              risks: row.risks || row.riscos,
              responsavel: row.responsavel || row.responsible,
              categoria: row.categoria || row.category,
              periodo: row.periodo || row.period,
            };

            points.push(point);
          });

          resolve(points);
        } catch (error) {
          reject(new Error('Erro ao processar dados do CSV'));
        }
      },
      error: (error) => {
        reject(new Error(`Erro ao carregar CSV: ${error.message}`));
      },
    });
  });
}
