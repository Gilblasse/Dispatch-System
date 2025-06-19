import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import MapContainer from '../MapContainer';
import { Trip, Driver } from '../../mockData';

test('renders markers for active trips', () => {
  const drivers: Record<string, Omit<Driver, 'id'>> = {
    d1: {
      name: 'Alice',
      photo: 'a',
      vehicle: 'car',
      lat: 40.7128,
      lng: -74.006,
      status: 'idle',
    },
  };
  const trips: Trip[] = [
    {
      id: 't1',
      driverId: 'd1',
      status: 'en-route',
      passenger: 'P',
      from: 'A',
      to: 'B',
      time: '10:00',
      date: '2024-01-01',
      inTime: '09:45',
      outTime: '10:15',
      miles: 5,
      transportType: 'Ambulatory',
      phone: '555-0000',
      medicaidNumber: 'MC-TEST',
      invoiceNumber: 'INV-TEST',
      pickupAddress: '123 Main St, New York, NY',
      dropoffAddress: '456 Broadway Ave, New York, NY',
      notes: 'n/a',
    },
  ];
  const { container } = render(<MapContainer drivers={drivers} trips={trips} />);
  expect(container.querySelectorAll('.map-driver').length).toBeGreaterThan(0);
});
