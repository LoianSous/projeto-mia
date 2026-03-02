import "./globals.css";
import type { Metadata } from "next";
import { Inter, Black_Ops_One } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "leaflet/dist/leaflet.css";
import PWARegister from "./PWARegister";

const inter = Inter({ subsets: ["latin"] });
const blackOps = Black_Ops_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-black-ops",
});

export const metadata: Metadata = {
  title: "Patrimônio Arqueológico | Mapeamento Cultural",
  description:
    "Explore e conheça o patrimônio arqueológico e cultural brasileiro através de um mapa interativo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Relativos: funcionam em / e em /projeto-mia/ */}
        <link rel="manifest" href="manifest.webmanifest" />
        <meta name="theme-color" content="#ea580c" />
        <link rel="apple-touch-icon" href="icons/icon-192.png" />

        {/* opcional: favicon */}
        <link rel="icon" href="favicon.ico" />
      </head>

      <body className={`${inter.className} ${blackOps.variable}`}>
        <PWARegister />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}