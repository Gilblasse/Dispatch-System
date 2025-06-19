import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TripDetails from '../TripDetails';
import { Trip, Driver } from '../../mockData';

test('close button triggers callback', () => {
  const trip: Trip = {
    id: 't1',
    driverId: 'd1',
    status: 'en-route',
    passenger: 'John Doe',
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
  };
  const driver: Driver = {
    id: 'd1',
    name: 'Driver',
    photo: 'a',
    vehicle: 'car',
    lat: 40.7128,
    lng: -74.006,
    status: 'idle',
  };
  const onClose = jest.fn();
  render(<TripDetails trip={trip} driver={driver} onClose={onClose} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onClose).toHaveBeenCalled();
});
