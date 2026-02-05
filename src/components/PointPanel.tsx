'use client';

import { useState } from 'react';
import { Point } from '@/types/Point';
import { X, MapPin, Navigation } from 'lucide-react';

interface PointPanelProps {
  point: Point;
  onClose: () => void;
  hideHeader?: boolean;
}

type TabType = 'rotas' | 'localizacao' | 'caracteristicas' | 'solo' | 'integridade' | 'pesquisa';

export default function PointPanel({ point, onClose, hideHeader }: PointPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('localizacao');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'rotas', label: 'Rotas' },
    { id: 'localizacao', label: 'Localização' },
    { id: 'caracteristicas', label: 'Características' },
    { id: 'solo', label: 'Solo' },
    { id: 'integridade', label: 'Integridade' },
    { id: 'pesquisa', label: 'Pesquisa' },
  ];

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
    window.open(url, '_blank');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'rotas':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Obtenha direções para este local usando o Google Maps.
            </p>
            <button
              onClick={openInGoogleMaps}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors w-full justify-center"
            >
              <Navigation className="w-4 h-4" />
              Abrir rota no Google Maps
            </button>
          </div>
        );

      case 'localizacao':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {point.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{point.location}</p>
            </div>
            <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
              <MapPin className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">Coordenadas</p>
                <p className="text-gray-600">
                  Lat: {point.lat.toFixed(6)}, Lng: {point.lng.toFixed(6)}
                </p>
              </div>
            </div>
            {point.categoria && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Categoria
                </p>
                <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  {point.categoria}
                </span>
              </div>
            )}
            {point.periodo && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Período
                </p>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {point.periodo}
                </span>
              </div>
            )}
          </div>
        );

      case 'caracteristicas':
        return (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900">
              Características do Sítio
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {point.caracteristicas || 'Informações sobre características não disponíveis no momento.'}
            </p>
          </div>
        );

      case 'solo':
        return (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900">
              Informações sobre o Solo
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {point.soil || 'Informações sobre o solo não disponíveis no momento.'}
            </p>
          </div>
        );

      case 'integridade':
        return (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900">
              Riscos e Integridade
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {point.risks || 'Informações sobre riscos e integridade não disponíveis no momento.'}
            </p>
          </div>
        );

      case 'pesquisa':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Responsável pela Pesquisa
              </h3>
              <p className="text-sm text-gray-700">
                {point.responsavel || 'Informação não disponível'}
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Referências
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Aguardando cadastro de referências bibliográficas</li>
                <li>• Documentação em processo de digitalização</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {!hideHeader && (
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Detalhes do Sítio</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Fechar painel"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      )}
      <div className="flex-shrink-0 border-b border-gray-200 overflow-x-auto">
        <div className="flex min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              aria-label={`Aba ${tab.label}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
    </div>
  );
}
