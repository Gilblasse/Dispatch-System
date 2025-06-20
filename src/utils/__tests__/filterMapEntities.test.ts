import { getVisibleEntities } from '../filterMapEntities';
import type { Driver, Trip } from '../../types';

describe('getVisibleEntities', () => {
  const drivers: Driver[] = [
    { id: 'd1', lat: 0, lng: 0, status: 'idle' },
    { id: 'd2', lat: 2, lng: 2, status: 'idle' },
  ];

  const trips: Trip[] = [
    { id: 't1', driverId: 'd1', status: 'pending' as any, passengerName: 'Alice', pickup: { lat: 0, lng: 0 }, dropoff: { lat: 1, lng: 1 } },
    { id: 't2', driverId: 'd2', status: 'pending' as any, passengerName: 'Alice', pickup: { lat: 2, lng: 2 }, dropoff: { lat: 3, lng: 3 } },
    { id: 't3', driverId: 'd1', status: 'pending' as any, passengerName: 'Bob', pickup: { lat: 4, lng: 4 }, dropoff: { lat: 5, lng: 5 } },
  ];

  test('returns all entities when no filter is applied', () => {
    const { visibleDrivers, visibleTrips } = getVisibleEntities(
      'none',
      null,
      null,
      drivers,
      trips,
    );
    expect(visibleDrivers).toEqual(drivers);
    expect(visibleTrips).toEqual(trips);
  });

  test('filters by driver id', () => {
    const { visibleDrivers, visibleTrips } = getVisibleEntities(
      'driver',
      'd1',
      null,
      drivers,
      trips,
    );
    expect(visibleDrivers).toEqual([drivers[0]]);
    expect(visibleTrips).toEqual([trips[0], trips[2]]);
  });

  test('filters by passenger id and active trip', () => {
    const result = getVisibleEntities('passenger', 'Alice', null, drivers, trips);
    expect(result.visibleDrivers).toEqual(drivers);
    expect(result.visibleTrips).toEqual([trips[0], trips[1]]);

    const active = getVisibleEntities('passenger', 'Alice', 't1', drivers, trips);
    expect(active.visibleDrivers).toEqual([drivers[0]]);
    expect(active.visibleTrips).toEqual([trips[0], trips[1]]);
  });

  test('filters by trip id and active trip override', () => {
    const basic = getVisibleEntities('trip', 't1', null, drivers, trips);
    expect(basic.visibleDrivers).toEqual([drivers[0]]);
    expect(basic.visibleTrips).toEqual([trips[0]]);

    const override = getVisibleEntities('trip', 't1', 't2', drivers, trips);
    expect(override.visibleDrivers).toEqual([drivers[1]]);
    expect(override.visibleTrips).toEqual([trips[1]]);
  });
});
