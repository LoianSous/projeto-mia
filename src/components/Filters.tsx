'use client';

import { Search, Filter } from 'lucide-react';

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategoria: string;
  onCategoriaChange: (value: string) => void;
  selectedPeriodo: string;
  onPeriodoChange: (value: string) => void;
  categorias: string[];
  periodos: string[];
}

export default function Filters({
  searchQuery,
  onSearchChange,
  selectedCategoria,
  onCategoriaChange,
  selectedPeriodo,
  onPeriodoChange,
  categorias,
  periodos,
}: FiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Filter className="w-4 h-4" />
        <span>Filtros</span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome, local..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        />
      </div>

      <div>
        <label htmlFor="categoria" className="block text-xs font-medium text-gray-600 mb-1">
          Categoria
        </label>
        <select
          id="categoria"
          value={selectedCategoria}
          onChange={(e) => onCategoriaChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="periodo" className="block text-xs font-medium text-gray-600 mb-1">
          Período
        </label>
        <select
          id="periodo"
          value={selectedPeriodo}
          onChange={(e) => onPeriodoChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        >
          <option value="">Todos os períodos</option>
          {periodos.map((per) => (
            <option key={per} value={per}>
              {per}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
