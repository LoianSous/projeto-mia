import { Map } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Map className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-white">Patrimônio Arqueológico</span>
            </div>
            <p className="text-sm">
              Mapeamento e preservação do patrimônio cultural e arqueológico brasileiro.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-orange-400 transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="/mapa" className="hover:text-orange-400 transition-colors">
                  Explorar Mapa
                </a>
              </li>
              <li>
                <a href="/sobre" className="hover:text-orange-400 transition-colors">
                  Sobre o Projeto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contato</h3>
            <p className="text-sm">
              Para mais informações sobre o projeto ou contribuições, entre em contato através da página Sobre.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Patrimônio Arqueológico. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
