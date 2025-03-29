'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Event, HeroSection as HeroSectionType } from "@/types";
import { getEvents, getHeroSection } from "@/services/api";
import LoadingSpinner from "../ui/loading-spinner";

const HeroSection: React.FC = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    thisMonthEvents: 0,
    cities: new Set<string>(),
    categories: new Set<string>()
  });

  const [heroData, setHeroData] = useState<HeroSectionType | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados do Hero
        const hero = await getHeroSection();
        setHeroData(hero);

        // Buscar estatísticas dos eventos
        const events: Event[] = await getEvents();
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const thisMonthEvents = events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= firstDayOfMonth && eventDate <= lastDayOfMonth;
        });

        setStats({
          totalEvents: events.length,
          thisMonthEvents: thisMonthEvents.length,
          cities: new Set(events.map(event => event.city)),
          categories: new Set(events.map(event => event.category))
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (!heroData) return null;

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Texto */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {heroData.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              {heroData.description.replace('{cities}', String(stats.cities.size))
                                 .replace('{categories}', String(stats.categories.size))}
            </p>
            <div className="flex flex-col lg:flex-row gap-4 justify-center md:justify-start">
              <Link href={heroData.primaryButton.link} className="btn-secondary-solid">
                {heroData.primaryButton.text}
              </Link>
              <Link href={heroData.secondaryButton.link} className="btn-secondary">
                {heroData.secondaryButton.text}
              </Link>
            </div>
          </div>

          {/* Imagem */}
          <div className="flex-1 relative w-full">
            <div className="relative w-full md:h-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              {imageError ? (
                // Fallback para imagem local se a imagem remota falhar
                <Image
                  src="/images/placeholder.png"
                  alt={heroData.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <Image
                  src={heroData.image.url}
                  alt={heroData.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            {/* Destaque de eventos */}
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">+{stats.thisMonthEvents} Eventos</p>
                  <p className="text-xs text-gray-500">Este mês</p>
                </div>
              </div>
            </div>

            {/* Stats flutuantes */}
            <div className="absolute -top-2 -left-2 bg-white p-3 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{stats.cities.size} Cidades</p>
                  <p className="text-xs text-gray-500">Disponíveis</p>
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
