import { Trip } from './mockData';

export function getDateKey(date: Date) {
  return date.toISOString().split('T')[0];
}

export function formatDateForDisplay(date: Date) {
  return new Date().toDateString() === date.toDateString()
    ? 'Today'
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export interface DriverStatus {
  className: string;
  text: string;
}

export function getDriverStatus(driverId: string, trips: Trip[]): DriverStatus {
  const active = trips.find(
    t => t.driverId === driverId && !['complete', 'pending'].includes(t.status)
  );
  if (active) {
    switch (active.status) {
      case 'en-route':
        return { className: 'status-pill-progress', text: 'En-Route' };
      case 'at-pickup':
        return { className: 'status-pill-arrived', text: 'At Pickup' };
      case 'in-transit':
        return { className: 'status-pill-progress', text: 'In-Transit' };
    }
  }
  return { className: 'status-pill-available', text: 'Available' };
}
