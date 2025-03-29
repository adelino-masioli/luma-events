export interface Ticket {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity_available: number;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  thumbnail: string;
  price: number;
  category: string;
  state: string;
  city: string;
  organizer: string;
  tickets: Ticket[];
}

export interface CartItem {
  id: string;
  eventId: number;
  eventTitle: string;
  eventThumbnail: string;
  eventDate: string;
  ticketId: number;
  ticketName: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  platformFee: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface State {
  id: number;
  name: string;
  uf: string;
}

export interface City {
  id: number;
  name: string;
  state: number;
}

export interface HeroSection {
  title: string;
  description: string;
  primaryButton: {
    text: string;
    link: string;
  };
  secondaryButton: {
    text: string;
    link: string;
  };
  image: {
    url: string;
    alt: string;
  };
}
