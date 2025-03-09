export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  thumbnail: string;
  price: number;
  category: string;
  city: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}
