import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import type { Trip } from '../types';

export interface ProjectedTripPositions {
  [tripId: string]: {
    pickup: { x: number; y: number };
    dropoff: { x: number; y: number };
  };
}

/**
 * React hook that projects trip pickup and dropoff coordinates to screen
 * positions using a MapLibre map instance.
 *
 * The result is memoized and updates only when the projected positions change
 * to help prevent React component flicker.
 */
export default function useProjectedTrips(
  map: maplibregl.Map | null,
  trips: Trip[],
  delay = 20
): ProjectedTripPositions {
  const [positions, setPositions] = useState<ProjectedTripPositions>({});
  const lastHashRef = useRef<string>('');
  const timerRef = useRef<number>();

  const projectTrips = () => {
    if (!map) return;

    const next: ProjectedTripPositions = {};
    const hashParts: string[] = [];

    trips.forEach(trip => {
      const pickup = map.project([trip.pickup.lng, trip.pickup.lat]);
      const dropoff = map.project([trip.dropoff.lng, trip.dropoff.lat]);
      next[trip.id] = {
        pickup: { x: pickup.x, y: pickup.y },
        dropoff: { x: dropoff.x, y: dropoff.y },
      };
      hashParts.push(
        `${trip.id}:${pickup.x.toFixed(2)},${pickup.y.toFixed(2)},${dropoff.x.toFixed(2)},${dropoff.y.toFixed(2)}`
      );
    });

    const hash = hashParts.join('|');
    if (hash !== lastHashRef.current) {
      lastHashRef.current = hash;
      setPositions(next);
    }
  };

  const scheduleProject = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(projectTrips, delay);
  };

  useEffect(() => {
    if (!map) return;

    scheduleProject();
    map.on('move', scheduleProject);
    map.on('zoom', scheduleProject);
    map.on('resize', scheduleProject);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      map.off('move', scheduleProject);
      map.off('zoom', scheduleProject);
      map.off('resize', scheduleProject);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, trips]);

  return positions;
}
