import { useState, useEffect } from 'react';
import { getDistance } from 'geolib';

// Interface voor een verhaal-item
interface Verhaal {
  title: string;
  location: { lat: number; lng: number };
  audio: string;
  slug: string;
}

// Props voor de component (verhalen worden via Astro meegegeven)
interface VerhalenLijstProps {
  verhalen: Verhaal[];
}

export default function VerhalenLijst({ verhalen }: VerhalenLijstProps) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [sortedVerhalen, setSortedVerhalen] = useState<Verhaal[]>([]);

  // GPS-locatie van de gebruiker ophalen
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
        },
        (error) => console.error('Fout bij GPS ophalen:', error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Verhalen sorteren op afstand zodra we de GPS-locatie hebben
  useEffect(() => {
    if (userLocation) {
      const sorted = [...verhalen].sort((a, b) => {
        const distanceA = getDistance(userLocation, a.location);
        const distanceB = getDistance(userLocation, b.location);
        return distanceA - distanceB;
      });
      setSortedVerhalen(sorted);
    }
  }, [userLocation, verhalen]);
  return (
    <div>
      <h2>Dichtstbijzijnde verhalen</h2>
      {!userLocation ? (
        <p>Locatie ophalen...</p>
      ) : (
        <ul>
          {sortedVerhalen.map((verhaal) => (
            <li key={verhaal.slug}>
              <a href={`/verhalen/${verhaal.slug}`}>
                {verhaal.title} - 🎧 Beluister audio
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
