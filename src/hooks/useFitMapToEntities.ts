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

  const isValidPoint = (p: EntityPoint | undefined): p is EntityPoint =>
    !!p && Number.isFinite(p.lat) && Number.isFinite(p.lng);

  const extractPoints = () => {
    const list: [number, number][] = [];

    drivers.forEach(d => {
      if (isValidPoint(d)) {
        list.push([d.lng, d.lat]);
      } else {
        console.warn('Invalid driver coordinates ignored', d);
      }
    });

    trips.forEach(t => {
      if (isValidPoint(t.pickup)) list.push([t.pickup.lng, t.pickup.lat]);
      else console.warn('Invalid trip pickup ignored', t);
      if (isValidPoint(t.dropoff)) list.push([t.dropoff.lng, t.dropoff.lat]);
      else console.warn('Invalid trip dropoff ignored', t);
    });

    return list;
  };

  const getHash = (pts: [number, number][]) => pts.map(p => p.join(',')).join('|');

  useEffect(() => {
    if (!map) return;
    const pts = extractPoints();
    if (pts.length === 0) return;

    const hash = getHash(pts);
    const triggerChanged = lastTriggerRef.current !== triggerFit;

    if (!hasFittedRef.current || lastHashRef.current !== hash || triggerChanged) {
      lastHashRef.current = hash;
      lastTriggerRef.current = triggerFit;
      hasFittedRef.current = true;

      const bounds = pts.reduce(
        (b, p) => b.extend(p),
        new maplibregl.LngLatBounds(pts[0], pts[0])
      );

      const timer = setTimeout(() => {
        if (!map) return;
        map.fitBounds(bounds, { padding: 100, maxZoom: 15, linear: false });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [map, drivers, trips, triggerFit]);
}
