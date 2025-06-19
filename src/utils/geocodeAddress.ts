export interface Coordinates {
  lat: number;
  lng: number;
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
          return { lat: Number(first.lat), lng: Number(first.lon) };
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
        return { lat, lng };
      }
    }
  } catch {
    // ignore error
  }

  throw new Error(`Failed to geocode address: ${address}`);
}
