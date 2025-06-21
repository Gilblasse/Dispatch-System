import { TripStatus } from '../mockData';

export interface TripStatusInfo {
  className: string;
  text: string;
}

export function getTripStatusInfo(status: TripStatus): TripStatusInfo {
  switch (status) {
    case 'en-route':
      return { className: 'status-pill-progress', text: 'En-Route' };
    case 'in-transit':
      return { className: 'status-pill-progress', text: 'In-Transit' };
    case 'at-pickup':
      return { className: 'status-pill-arrived', text: 'At Pickup' };
    case 'at-dropoff':
      return { className: 'status-pill-arrived', text: 'At Dropoff' };
    case 'complete':
      return { className: 'status-pill-available', text: 'Complete' };
    case 'pending':
      return { className: 'status-pill-progress', text: 'Pending' };
    case 'cancel':
      return { className: 'status-pill-available', text: 'Cancel' };
    case 'no_show':
      return { className: 'status-pill-available', text: 'No Show' };
    case 'waiting':
      return { className: 'status-pill-progress', text: 'Waiting' };
    case 're-assigned':
      return { className: 'status-pill-progress', text: 'Re-assigned' };
    case 'not-confirmed':
      return { className: 'status-pill-progress', text: 'Not Confirmed' };
    default:
      return { className: 'status-pill-available', text: status };
  }
}
