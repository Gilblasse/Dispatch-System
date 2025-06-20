export interface Coordinates {
  lat: number;
  lng: number;
}

export async function geocodeAddress(address: string): Promise<Coordinates> {
  const encoded = encodeURIComponent(address);
  const key = process.env.VITE_OPENCAGE_API_KEY || 'YOUR_OPENCAGE_API_KEY';
  const email = process.env.VITE_NOMINATIM_EMAIL || 'your-email@example.com';

  const nominatim = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`,
    {
      headers: {
        "User-Agent": `DispatchSystem/1.0 (${email})`,
      },
    }
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

  throw new Error(`Failed to geocode address: ${address}`);
}
