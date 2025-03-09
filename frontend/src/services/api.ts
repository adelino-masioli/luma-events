import { Event, Category } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getEvents(): Promise<Event[]> {
  const response = await fetch(`${API_BASE_URL}/events/`);

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  const events = await response.json();

  return events;
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories/`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}
