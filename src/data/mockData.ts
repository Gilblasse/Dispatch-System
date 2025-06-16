import { Passenger, Driver, Vehicle, Trip } from '../types';

export const passengers: Passenger[] = [
  {
    id: 'p1',
    name: 'John Doe',
    phone: ['555-0101'],
    medicaid: 'M123456',
    lastPickup: '123 Main St',
    lastDropoff: '456 Oak Ave',
  },
  {
    id: 'p2',
    name: 'Jane Smith',
    phone: ['555-0202'],
    medicaid: 'M654321',
    lastPickup: '789 Pine Rd',
    lastDropoff: '321 Elm St',
  },
];

export const drivers: Driver[] = [
  { id: 'd1', name: 'Alice Johnson', phone: '555-1111', email: 'alice@example.com' },
  { id: 'd2', name: 'Bob Lee', phone: '555-2222', email: 'bob@example.com' },
];

export const vehicles: Vehicle[] = [
  { id: 'v1', label: 'Van 1' },
  { id: 'v2', label: 'Sedan 1' },
];

export const trips: Trip[] = [
  {
    id: 't1',
    date: '2023-09-12',
    time: '09:00',
    passengerId: 'p1',
    driverId: 'd1',
    pickup: '123 Main St',
    dropoff: '456 Oak Ave',
    payer: 'Medicaid',
    vehicleId: 'v1',
    transport: 'Ambulatory',
    phone: '555-0101',
    medicaid: 'M123456',
    invoice: 'INV-001',
    status: 'scheduled',
  },
];

