import Link from "next/link";
import PlaceholderImage from "./placeholder-image";

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Texto */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Descubra os Melhores Eventos de Rondônia
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Encontre e compre ingressos para os eventos mais esperados da região Norte do Brasil. Shows, festivais, exposições e muito mais!
            </p>
            <div className="flex flex-col lg:flex-row gap-4 justify-center md:justify-start">
              <Link href="/eventos" className="btn-primary">
                Ver Todos os Eventos
              </Link>
              <Link href="/sobre" className="btn-secondary">
                Saiba Mais
              </Link>
            </div>
          </div>

          {/* Imagem */}
          <div className="flex-1 relative  w-full">
          <PlaceholderImage 
            title="Descubra os Melhores Eventos de Rondônia"
            wrapper="relative w-full  md:h-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100"
            sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Destaque de eventos */}
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">+50 Eventos</p>
                  <p className="text-xs text-gray-500">Este mês</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
