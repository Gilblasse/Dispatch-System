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
    pickupAddress: '123 A St',
    dropoffAddress: '456 B Ave',
    notes: 'n/a',
    lat: 30,
    lng: 60,
  };
  const driver: Driver = { id: 'd1', name: 'Driver', photo: 'a', vehicle: 'car' };
  const onClose = jest.fn();
  render(<TripDetails trip={trip} driver={driver} onClose={onClose} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onClose).toHaveBeenCalled();
});
