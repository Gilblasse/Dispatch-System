import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import MapContainer from '../MapContainer';
import { Trip, Driver } from '../../mockData';

test('renders markers for active trips', () => {
  const drivers: Record<string, Omit<Driver, 'id'>> = {
    d1: { name: 'Alice', photo: 'a', vehicle: 'car' },
  };
  const trips: Trip[] = [
    { id: 't1', driverId: 'd1', status: 'en-route', passenger: 'P', from: 'A', to: 'B', time: '10:00', lat: 50, lng: 40 },
  ];
  const { container } = render(<MapContainer drivers={drivers} trips={trips} />);
  expect(container.querySelectorAll('.map-driver').length).toBeGreaterThan(0);
});
