import Link from "next/link";
import PlaceholderImage from "./placeholder-image";

const AdvertisementSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="ad-section">
          <div className="flex flex-col md:flex-row items-center p-8 md:p-12">
            {/* Texto */}
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Patrocine Seus Eventos
              </h2>
              <p className="text-white/90 mb-6">
                Aumente a visibilidade do seu evento alcançando milhares de pessoas interessadas em Rondônia.
              </p>
              <Link 
                href="/contato" 
                className="inline-block btn-secondary-solid font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300"
              >
                Saiba Mais
              </Link>
            </div>

            {/* Imagem */}
            <PlaceholderImage 
              title="Patrocine Seus Eventos"
              wrapper="md:w-1/2 w-full relative h-64 md:h-80 rounded-2xl overflow-hidden"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertisementSection;
