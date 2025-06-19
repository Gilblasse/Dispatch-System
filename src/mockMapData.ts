import { Driver, Trip } from './types';

export const MOCK_DRIVERS_MAP: Driver[] = [
  { id: 'd1', lat: 40.7128, lng: -74.006, status: 'idle' },
  { id: 'd2', lat: 40.71, lng: -74.015, status: 'idle' },
  { id: 'd3', lat: 40.715, lng: -74.0, status: 'idle' },
  { id: 'd4', lat: 40.718, lng: -74.011, status: 'idle' },
];

export const MOCK_TRIPS_MAP: Trip[] = [
  {
    id: 't1',
    passengerName: 'Alice',
    pickup: { lat: 40.7127, lng: -74.0059 },
    dropoff: { lat: 40.721, lng: -74.01 },
  },
  {
    id: 't2',
    passengerName: 'Bob',
    pickup: { lat: 40.718, lng: -74.012 },
    dropoff: { lat: 40.722, lng: -74.003 },
  },
  {
    id: 't3',
    passengerName: 'Charlie',
    pickup: { lat: 40.709, lng: -74.01 },
    dropoff: { lat: 40.714, lng: -74.016 },
  },
];
