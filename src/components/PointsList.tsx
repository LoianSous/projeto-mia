'use client';

import { Point } from '@/types/Point';
import { MapPin } from 'lucide-react';

interface PointsListProps {
  points: Point[];
  selectedPoint: Point | null;
  onPointClick: (point: Point) => void;
}

export default function PointsList({
  points,
  selectedPoint,
  onPointClick,
}: PointsListProps) {
  if (points.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">Nenhum sítio encontrado com os filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-600 mb-3">
        {points.length} {points.length === 1 ? 'sítio encontrado' : 'sítios encontrados'}
      </div>

      {points.map((point) => (
        <button
          key={point.id}
          onClick={() => onPointClick(point)}
          className={`w-full text-left p-3 rounded-lg border transition-all ${
            selectedPoint?.id === point.id
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/50'
          }`}
        >
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-gray-900 truncate">
                {point.title}
              </h3>
              <p className="text-xs text-gray-600 truncate mt-0.5">
                {point.location}
              </p>
              {point.categoria && (
                <span className="inline-block mt-2 bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">
                  {point.categoria}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
