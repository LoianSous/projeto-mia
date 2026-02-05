'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  Route,
  MapPin,
  ScrollText,
  Layers,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { Point } from '@/types/Point';

type TabId = 'rotas' | 'localizacao' | 'caracteristicas' | 'solo' | 'integridade' | 'pesquisa';

interface MapPointModalProps {
  point: Point;
  onClose: () => void;
}

export default function MapPointModal({ point, onClose }: MapPointModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState<TabId>('localizacao');

  useEffect(() => {
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const tabs = useMemo(
    () => [
      { id: 'rotas' as const, label: 'Rotas', Icon: Route },
      { id: 'localizacao' as const, label: 'Localização', Icon: MapPin },
      { id: 'caracteristicas' as const, label: 'Características', Icon: ScrollText },
      { id: 'solo' as const, label: 'Solo', Icon: Layers },
      { id: 'integridade' as const, label: 'Integridade', Icon: AlertTriangle },
      { id: 'pesquisa' as const, label: 'Pesquisa', Icon: Search },
    ],
    []
  );

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
    window.open(url, '_blank');
  };

  const renderContent = () => {
    switch (tab) {
      case 'rotas':
        return (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Obtenha direções para este local usando o Google Maps.
            </p>
            <button
              onClick={openInGoogleMaps}
              className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 font-semibold transition-colors"
            >
              Abrir rota no Google Maps
            </button>
          </div>
        );

      case 'localizacao':
        return (
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{point.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{point.location}</p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">Coordenadas</p>
              <p className="text-sm text-slate-600">
                Lat.: {point.lat.toFixed(6)}, Lng.: {point.lng.toFixed(6)}
              </p>
            </div>

            {(point.categoria || point.periodo) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {point.categoria && (
                  <span className="rounded-full bg-orange-100 text-orange-800 px-3 py-1 text-xs font-semibold">
                    {point.categoria}
                  </span>
                )}
                {point.periodo && (
                  <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-semibold">
                    {point.periodo}
                  </span>
                )}
              </div>
            )}
          </div>
        );

      case 'caracteristicas':
        return (
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">Características</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {point.caracteristicas || 'Sem informações cadastradas no momento.'}
            </p>
          </div>
        );

      case 'solo':
        return (
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">Solo</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {point.soil || 'Sem informações cadastradas no momento.'}
            </p>
          </div>
        );

      case 'integridade':
        return (
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">Integridade</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {point.risks || 'Sem informações cadastradas no momento.'}
            </p>
          </div>
        );

      case 'pesquisa':
        return (
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Responsável</h3>
              <p className="text-sm text-slate-600">
                {point.responsavel || 'Não informado'}
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Referências</h3>
              <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
                <li>Aguardando cadastro</li>
                <li>Documentação em digitalização</li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-[1200] bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes do sítio"
        className="absolute left-1/2 top-1/2 z-[1300] w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200"
      >
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="font-semibold text-slate-900 truncate">{point.title}</div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* imagem (placeholder) */}
        <div className="bg-slate-100 border-b border-slate-200">
          <div className="h-40 sm:h-48 w-full flex items-center justify-center text-slate-500 text-sm">
            Espaço para imagem do sítio
          </div>
        </div>

        {/* conteúdo */}
        <div className="max-h-[52vh] overflow-y-auto px-4 py-4">
          {renderContent()}
        </div>

        {/* tabs embaixo */}
        <div className="border-t border-slate-200 bg-white">
          <div className="flex justify-between gap-1 px-2 py-2 overflow-x-auto">
            {tabs.map(({ id, label, Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="min-w-[92px] flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors"
                  aria-label={`Aba ${label}`}
                >
                  <span
                    className={[
                      'grid place-items-center w-11 h-11 rounded-full border transition-colors',
                      active
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className={active ? 'text-xs font-semibold text-blue-700' : 'text-xs text-slate-600'}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
