export interface Coordinates {
  lat: number;
  lng: number;
}

const NY_BOUNDS = {
  minLat: 40.4774,
  maxLat: 45.0159,
  minLng: -79.7624,
  maxLng: -71.7517,
};

function clampToNY({ lat, lng }: Coordinates): Coordinates {
  return {
    lat: Math.min(Math.max(lat, NY_BOUNDS.minLat), NY_BOUNDS.maxLat),
    lng: Math.min(Math.max(lng, NY_BOUNDS.minLng), NY_BOUNDS.maxLng),
  };
}

export async function geocodeAddress(address: string): Promise<Coordinates> {
  const encoded = encodeURIComponent(address);

  try {
    const nominatim = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`
    );
    if (nominatim.ok) {
      const data: Array<{ lat: string; lon: string }> = await nominatim.json();
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        if (first.lat && first.lon) {
          return clampToNY({ lat: Number(first.lat), lng: Number(first.lon) });
        }
      }
    }
  } catch {
    // ignore error and fall back
  }

  const key =
    (typeof process !== 'undefined' &&
      (process.env.OPENCAGE_API_KEY || process.env.VITE_OPENCAGE_API_KEY)) ||
    'YOUR_OPENCAGE_API_KEY';
  try {
    const opencage = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encoded}&key=${key}`
    );
    if (opencage.ok) {
      const data: { results: Array<{ geometry: { lat: number; lng: number } }> } =
        await opencage.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return clampToNY({ lat, lng });
      }
    }
  } catch {
    // ignore error
  }

  throw new Error(`Failed to geocode address: ${address}`);
}
