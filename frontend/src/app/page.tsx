import Link from "next/link";
import { Event } from "../types";
import {  getEvents } from "@/services/api";
import EventCard from "@/components/events/event-card";
import HeroSection from "@/components/layout/hero-section";
import AdvertisementSection from "@/components/layout/advertisement-section";
import CityFilters from "@/components/layout/city-filter";



export default async function Home() {
  const events: Event[] = await getEvents();
  const latestEvents = events.slice(0, 8);
  
  // Get unique cities from events
  const cities = Array.from(new Set(events.map(event => event.city))).sort();

  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* City Filters */}
      <CityFilters cities={cities} />

      {/* Latest Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="section-title">Próximos Eventos</h2>
              <p className="section-subtitle">Não perca os eventos mais aguardados da região</p>
            </div>
            <Link 
              href="/eventos" 
              className="btn-secondary inline-flex items-center gap-2"
            >
              Ver todos
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {latestEvents.map((event) => (
              <EventCard key={event.id} event={event}  />
            ))}
          </div>
        </div>
      </section>

      {/* Advertisement Section */}
      <AdvertisementSection />
    </div>
  );
}