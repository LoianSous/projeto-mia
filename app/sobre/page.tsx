'use client';

import Image from 'next/image';

export default function SobrePage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    <div className="bg-[#0b0f14] text-white">
      {/* HERO com fundo fixo */}
<section className="relative">
  <div
  className="
    relative h-[320px] sm:h-[420px] md:h-[520px]
    bg-cover bg-center bg-no-repeat bg-fixed
  "
  style={{ backgroundImage: `url(${basePath}/assets/background.jpg)` }}
>

    {/* overlay escuro */}
    <div className="absolute inset-0 bg-black/60" />

    {/* brilho */}
    <div className="absolute inset-0">
      <div className="absolute -top-24 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />
    </div>

    {/* conteúdo */}
    <div className="relative h-full flex items-center justify-center text-center px-4">
      <div>
        <h1
          className="mia-title text-[clamp(3.2rem,10vw,6.8rem)] text-white"
          data-text="M.I.A"
        >
          M.I.A
        </h1>

        <p className="mt-3 text-sm sm:text-base tracking-[0.25em] text-amber-300/90 uppercase">
          Mapeamento de infraestrutura arqueológica
        </p>
      </div>
    </div>
  </div>
</section>



      {/* CONTEÚDO */}
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* BLOCO: O QUE É ARQUEOLOGIA (imagem esquerda + texto direita) */}
          <section className="grid gap-8 lg:grid-cols-[420px_1fr] items-start">
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="relative aspect-[16/10]">
                <Image
                  src={`${basePath}/assets/p7.jpg`}
                  alt="Trabalho arqueológico em campo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-extrabold italic text-amber-300/80">
                O QUE É ARQUEOLOGIA?
              </h2>

              <p className="mt-4 text-white/80 leading-relaxed">
                “Arqueologia é uma ciência social que se preocupa em compreender ou obter informações
                sobre as sociedades e as formas antigas de organização humana por meio do estudo de
                evidências históricas.”
              </p>
            </div>
          </section>

          {/* BLOCO: IMPORTÂNCIA (texto esquerda + imagem direita) */}
          <section className="grid gap-8 lg:grid-cols-[1fr_420px] items-start">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-extrabold italic text-amber-300/80">
                Qual a importância da arqueologia?
              </h3>
              <p className="mt-3 text-white/75 leading-relaxed">
                Ela recupera conhecimentos sobre o passado humano por meio da análise de vestígios materiais,
                como artefatos e sítios, que nos ajudam a entender nossas origens, a evolução das sociedades
                e a relação entre o homem e o meio ambiente.
              </p>

              <div className="mt-8 h-px bg-white/10" />

              <p className="mt-6 text-xs tracking-[0.25em] uppercase text-amber-300/80">
                AGORA NA NOSSA REGIÃO...
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="relative aspect-[16/10]">
                <Image
                  src={`${basePath}/assets/p8.jpg`}
                  alt="Acervo e vestígios arqueológicos"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* DOIS MAPAS LADO A LADO */}
          <section className="grid gap-6 md:grid-cols-2">
            {/* Centro-Oeste */}
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={`${basePath}/assets/p9.png`}
                  alt="Mapa do Centro-Oeste"
                  fill
                  className="object-contain bg-white"
                />
              </div>

              <div className="p-6 md:p-7">
                <h3 className="text-center text-lg md:text-xl font-extrabold text-white">
                  MAPA DO CENTRO-OESTE
                </h3>
                <p className="mt-3 text-white/75 leading-relaxed text-sm md:text-base">
                  A arqueologia no Centro-Oeste do Brasil revela uma rica e antiga presença humana,
                  com sítios que datam de até 25 mil anos, como o sítio Santa Elina no MT. A região abriga
                  sítios de arte rupestre, como o Bisnau em GO, e complexos de grutas, como os de Serranópolis,
                  além de vestígios de grandes aldeias e ocupações de caçadores-coletores no Pantanal,
                  que atestam uma profunda diversidade cultural e temporal.
                </p>
              </div>
            </div>

            {/* Mato Grosso do Sul */}
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={`${basePath}/assets/p10.jpg`}
                  alt="Mapa do Mato Grosso do Sul"
                  fill
                  className="object-contain bg-white"
                />
              </div>

              <div className="p-6 md:p-7">
                <h3 className="text-center text-lg md:text-xl font-extrabold text-white">
                  MAPA DO MATO GROSSO DO SUL
                </h3>
                <p className="mt-3 text-white/75 leading-relaxed text-sm md:text-base">
                  A arqueologia em Mato Grosso do Sul revela ocupações humanas que remontam a mais de 11.000 anos,
                  com mais de 700 sítios catalogados, incluindo as fascinantes gravuras e pinturas rupestres.
                </p>
              </div>
            </div>
          </section>

          {/* O NOSSO PROJETO (mapinha + texto à direita) */}
          <section className="grid gap-8 lg:grid-cols-[420px_1fr] items-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="relative aspect-[16/10]">
                {/* pode ser um print do seu mapa depois; por enquanto reutiliza p7/p8/p9 se quiser */}
                <Image
                  src={`${basePath}/assets/p11.png`}
                  alt="Região do projeto no mapa"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-extrabold italic text-amber-300/80">
                O NOSSO PROJETO
              </h2>
              <p className="mt-4 text-white/75 leading-relaxed">
                Por enquanto, ele abrange a região de Três Lagoas até Brasilândia, por ser a principal área
                onde foram encontrados artefatos e sítios arqueológicos abandonados, mas temos a intenção
                de futuramente estender o nosso projeto para abranger todo o estado do Mato Grosso do Sul.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
