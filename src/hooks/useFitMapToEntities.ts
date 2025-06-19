import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

export interface EntityPoint {
  lat: number;
  lng: number;
}

export interface TripCoordinates {
  pickup: EntityPoint;
  dropoff: EntityPoint;
}

/**
 * React hook that fits a MapLibre map to all provided drivers and trip points.
 *
 * @param map MapLibre map instance
 * @param drivers Array of driver locations
 * @param trips Array of trips with pickup and dropoff locations
 * @param triggerFit Optional external value to force refitting
 */
export default function useFitMapToEntities(
  map: maplibregl.Map | null,
  drivers: EntityPoint[],
  trips: TripCoordinates[],
  triggerFit?: number | boolean | string
): void {
  const lastHashRef = useRef<string>('');
  const lastTriggerRef = useRef<number | boolean | string | undefined>(undefined);
  const hasFittedRef = useRef(false);

  useEffect(() => {
    if (!map) return;

    const points: [number, number][] = [];
    drivers.forEach(d => points.push([d.lng, d.lat]));
    trips.forEach(t => {
      points.push([t.pickup.lng, t.pickup.lat]);
      points.push([t.dropoff.lng, t.dropoff.lat]);
    });

    if (points.length === 0) return;

    const hash = points.map(p => p.join(',')).join('|');
    const triggerChanged = lastTriggerRef.current !== triggerFit;

    if (!hasFittedRef.current || lastHashRef.current !== hash || triggerChanged) {
      lastHashRef.current = hash;
      lastTriggerRef.current = triggerFit;
      hasFittedRef.current = true;

      const bounds = points.reduce(
        (b, p) => b.extend(p),
        new maplibregl.LngLatBounds(points[0], points[0])
      );

      const timer = setTimeout(() => {
        if (!map) return;
        map.fitBounds(bounds, { padding: 100, maxZoom: 15, linear: false });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [map, drivers, trips, triggerFit]);
}
