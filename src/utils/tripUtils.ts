import { Trip as ScheduleTrip } from '../mockData';
import type { Trip as MapTrip } from '../types';
import { geocodeAddress } from './geocodeAddress';

export async function mapScheduleToTrips(schedule: Record<string, ScheduleTrip[]>): Promise<MapTrip[]> {
  const tasks: Promise<MapTrip>[] = [];
  for (const trips of Object.values(schedule)) {
    for (const trip of trips) {
      tasks.push(
        Promise.all([
          geocodeAddress(trip.pickupAddress),
          geocodeAddress(trip.dropoffAddress),
        ]).then(([pickup, dropoff]) => ({
          id: trip.id,
          driverId: trip.driverId,
          status: trip.status,
          passengerName: trip.passenger,
          pickup,
          dropoff,
        }))
      );
    }
  }
  return Promise.all(tasks);
}
