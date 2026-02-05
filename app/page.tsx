import Image from "next/image";
import Link from "next/link";
import { Map, BookOpen } from "lucide-react";
import MapSection from "@/components/MapSection";

export default function Home() {
  return (
    <div className="bg-[#0b0f14] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-5xl mx-auto">

           <h1
  className="mia-title text-[clamp(3.2rem,9vw,7rem)] text-white"
  data-text="O Projeto M.I.A"
>
  O Projeto M.I.A
</h1>

            <p className="text-xs md:text-sm tracking-[0.25em] text-amber-300/90 uppercase mb-4">
              MAPEAMENTO DE INSFRAESTRUTURA ARQUEOLÓGICA
            </p>

            <p className="mt-6 text-base md:text-lg text-white/75 leading-relaxed max-w-3xl">
              É uma iniciativa que visa organizar, catalogar e disponibilizar informações
              sobre os sítios arqueológicos localizados entre as cidades de Três Lagoas e
              Brasilândia, nas margens do Rio Paraná.
            </p>

            <p className="mt-4 text-base md:text-lg text-white/75 leading-relaxed max-w-3xl">
              Nosso objetivo é criar uma plataforma digital interativa que funcione como um mapa,
              semelhante ao Google Maps, onde qualquer pessoa possa explorar e aprender sobre o rico
              patrimônio arqueológico da nossa região.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/#mapa"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 px-6 py-3 font-semibold transition-colors"
              >
                <Map className="w-5 h-5" />
                Explorar no Mapa
              </Link>

              <Link
                href="/sobre"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-6 py-3 font-semibold transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Sobre o Projeto
              </Link>
            </div>

            {/* Imagem + texto (como na referência) */}
            <div className="mt-12 grid gap-6 lg:grid-cols-2 items-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="relative aspect-[16/9]">
                  <Image
                    src="/assets/p1.png"
                    alt="Mapa ilustrativo do projeto"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Plataforma digital interativa
                </h2>
                <p className="text-white/75 leading-relaxed">
                  Explore os sítios em um mapa, clique nos marcadores e acesse as informações detalhadas.
                  O foco é deixar os dados organizados e acessíveis para pesquisa, educação e preservação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que faz */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold italic mb-10">
            O que o Projeto M.I.A faz?
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/assets/p2.png"
                  alt="Explorar sítios arqueológicos"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold text-amber-300 mb-3">
                  Explorar Sítios Arqueológicos
                </h3>
                <p className="text-white/75 leading-relaxed">
                  Navegar por um mapa interativo para encontrar a localização exata dos sítios
                  arqueológicos, com coordenadas geográficas precisas.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/assets/p3.png"
                  alt="Acessar informações detalhadas"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold text-amber-300 mb-3">
                  Acessar Informações Detalhadas
                </h3>
                <p className="text-white/75 leading-relaxed">
                  Clicar em cada ponto do mapa para ver informações detalhadas, incluindo descrições,
                  imagens, descobertas importantes e dados históricos.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-amber-300 mb-3">
              Facilitar a Pesquisa
            </h3>
            <p className="text-white/75 leading-relaxed">
              A plataforma servirá como um banco de dados unificado, facilitando o trabalho de pesquisadores
              e estudantes que precisam de informações organizadas e atualizadas sobre os vestígios arqueológicos
              da bacia do Rio Paraná.
            </p>
          </div>
        </div>
      </section>

      {/* Por que é importante */}
      <section className="container mx-auto px-4 pb-14 md:pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold italic text-amber-300/80 mb-5">
                Por que o Projeto M.I.A é importante?
              </h2>
              <p className="text-white/75 leading-relaxed">
                A arqueologia é uma ferramenta fundamental para entender o passado pré-colonial e a história
                das populações indígenas que viveram aqui. Infelizmente, muitas informações sobre esses sítios
                arqueológicos estão espalhadas e de difícil acesso. O Projeto M.I.A foi criado para mudar isso.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="relative aspect-[16/11]">
                <Image
                  src="/assets/p1.png"
                  alt="Registro cultural"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-bold text-amber-300 mb-3">Preservação</h3>
              <p className="text-white/75 leading-relaxed">
                Utilizamos tecnologias avançadas e não invasivas para mapear os sítios. Isso nos permite coletar
                dados precisos sem causar danos, garantindo a preservação desses locais para as futuras gerações.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-bold text-amber-300 mb-3">Valorização Cultural</h3>
              <p className="text-white/75 leading-relaxed">
                Ao disponibilizar esses dados de forma organizada e fácil de usar, queremos promover o reconhecimento
                da importância histórica e antropológica da nossa região. Acreditamos que, ao conhecer o passado,
                a comunidade se engaja mais na conservação do seu patrimônio.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-bold text-amber-300 mb-3">Acesso e Educação</h3>
              <p className="text-white/75 leading-relaxed">
                A plataforma digital tornará o conhecimento sobre a arqueologia local acessível a todos – estudantes,
                professores, pesquisadores e a comunidade em geral. Nossa meta é democratizar o acesso à informação
                e incentivar a pesquisa e a valorização da nossa história.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAPA */}
      <div className="bg-white">
        <MapSection />
      </div>
    </div>
  );
}
