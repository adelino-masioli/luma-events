'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAdvertisementSection } from "@/services/api";
import { AdvertisementSection as AdvertisementSectionType } from "@/types";
import LoadingSpinner from "../ui/loading-spinner";

const AdvertisementSection: React.FC = () => {
  const [adData, setAdData] = useState<AdvertisementSectionType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdvertisementSection();
        setAdData(data);
      } catch (error) {
        console.error("Error fetching advertisement section:", error);
      } finally {
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

  if (!adData) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="ad-section">
          <div className="flex flex-col md:flex-row items-center p-8 md:p-12">
            {/* Texto */}
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {adData.title}
              </h2>
              <p className="text-white/90 mb-6">
                {adData.description}
              </p>
              <Link 
                href={adData.button.link}
                className="inline-block btn-secondary-solid font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300"
              >
                {adData.button.text}
              </Link>
            </div>

            {/* Imagem */}
            <div className="md:w-1/2 w-full relative h-64 md:h-80 rounded-2xl overflow-hidden">
              <Image
                src={adData.image.url}
                alt={adData.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertisementSection;
