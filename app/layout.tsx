import './globals.css';
import type { Metadata } from 'next';
import { Inter, Black_Ops_One  } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ['latin'] });

const blackOps = Black_Ops_One({
  subsets: ['latin'],
  weight: '400', // essa fonte só tem 400
  variable: '--font-black-ops',
});


export const metadata: Metadata = {
  title: 'Patrimônio Arqueológico | Mapeamento Cultural',
  description: 'Explore e conheça o patrimônio arqueológico e cultural brasileiro através de um mapa interativo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} ${blackOps.variable}`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
