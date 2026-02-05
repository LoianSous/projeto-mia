import { Suspense } from "react";
import MapaClient from "./MapaClient";

export default function MapaPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      }
    >
      <MapaClient />
    </Suspense>
  );
}
