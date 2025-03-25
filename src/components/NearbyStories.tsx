'use client';

import { useEffect, useState } from 'react';

// Typedefinities voor een verhaal
interface Story {
  title: string;
  slug: string;
  coordinates: { lat: number; lon: number };
}

// Haversine-formule om afstand in km te berekenen tussen 2 coördinaten
const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Aarde straal in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function NearbyStories({ stories }: { stories: Story[] }) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [sortedStories, setSortedStories] = useState<Story[]>([]);

  useEffect(() => {
    // Vraag de locatie van de gebruiker op
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        setUserLocation({ lat: userLat, lon: userLon });

        // Sorteer de verhalen op afstand tot de gebruiker
        const sorted = [...stories].sort((a, b) => {
          const distA = getDistance(
            userLat,
            userLon,
            a.coordinates.lat,
            a.coordinates.lon
          );
          const distB = getDistance(
            userLat,
            userLon,
            b.coordinates.lat,
            b.coordinates.lon
          );
          return distA - distB; // Sorteert van dichtbij naar ver weg
        });

        setSortedStories(sorted);
      },
      (error) => console.error('Geolocatie niet beschikbaar', error)
    );
  }, [stories]);

  return (
    <div>
      <h2>Dichtstbijzijnde Verhalen</h2>
      {userLocation ? (
        <ul>
          {sortedStories.map((story) => (
            <li key={story.slug}>
              <a href={`/verhalen/${story.slug}`}>{story.title}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Locatie ophalen...</p>
      )}
    </div>
  );
}
