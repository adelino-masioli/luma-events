// components/EventCard.tsx

import Image from "next/image";
import Link from "next/link";
import { Event } from "../../types";
import { formatDate, formatPrice } from "../../utils"; 

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {


  return (
    <Link href={`/eventos/${event.id}/${event.slug}`} key={event.id} className="group">
      <article className="event-card h-full flex flex-col">
        <div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-100">
          <Image
            src={event.thumbnail || 'https://placehold.co/600x400/png'}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="event-image object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs px-2 py-1 rounded-full">
              {event.category}
            </span>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {event.title}
          </h3>
          <div className="space-y-2 mb-4 flex-1">
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">{event.city} - {event.location}</span>
            </div>
          </div>
          <div className="font-bold text-lg text-primary">
            {formatPrice(event.price)}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default EventCard;
