import type { Driver, Trip } from '../types';

export type MapFilter = 'none' | 'trip' | 'driver' | 'passenger';

export function getVisibleEntities(
  filterType: MapFilter,
  filterId: string | null,
  activeTripId: string | null,
  drivers: Driver[],
  trips: Trip[],
): { visibleDrivers: Driver[]; visibleTrips: Trip[] } {
  let visibleDrivers = drivers;
  let visibleTrips = trips;

  if (filterType === 'passenger') {
    visibleTrips = trips.filter(t => t.passengerName === filterId);
    const driverIds = new Set(visibleTrips.map(t => t.driverId));
    visibleDrivers = drivers.filter(d => driverIds.has(d.id));

    if (activeTripId) {
      const active = visibleTrips.find(t => t.id === activeTripId);
      if (active) {
        visibleDrivers = visibleDrivers.filter(d => d.id === active.driverId);
      }
    }
  } else if (filterType === 'driver') {
    visibleTrips = trips.filter(t => t.driverId === filterId);
    visibleDrivers = drivers.filter(d => d.id === filterId);
  } else if (filterType === 'trip') {
    const active = trips.find(t => t.id === (activeTripId || filterId));
    if (active) {
      visibleTrips = [active];
      const driver = drivers.find(d => d.id === active.driverId);
      visibleDrivers = driver ? [driver] : [];
    } else {
      visibleDrivers = [];
      visibleTrips = [];
    }
  }

  return { visibleDrivers, visibleTrips };
}
