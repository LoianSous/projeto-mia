'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Info, Home } from 'lucide-react';
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <span className="relative w-12 h-12">
  <Image
    src={`${basePath}/assets/logoterabotics.png`}
    alt="Ícone Tera Robotics"
    fill
    className="object-contain rounded-full"
  />
</span>

            <span className="hidden sm:inline">M.I.A</span>
            <span className="sm:hidden">M.I.A</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Início</span>
            </Link>
            <Link
              href="/mapa"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/mapa')
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Explorar</span>
            </Link>
            <Link
              href="/sobre"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/sobre')
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Sobre</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
