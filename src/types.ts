export interface Driver {
  id: string;
  lat: number;
  lng: number;
  status: string;
}

import type { TripStatus } from './mockData';

export interface Trip {
  id: string;
  driverId: string;
  status: TripStatus;
  passengerName: string;
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
}
