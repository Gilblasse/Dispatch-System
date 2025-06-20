import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TripCard from '../TripCard';
import { Trip } from '../../mockData';

test('calls onSelect when card is clicked', () => {
  const trip: Trip = {
    id: 't1',
    driverId: 'd1',
    status: 'pending',
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
  const onSelect = jest.fn();
  render(
    <TripCard
      trip={trip}
      isActive={false}
      onSelect={onSelect}
      onPassengerFilter={() => {}}
      onShowPassengerPage={() => {}}
      onShowDetails={() => {}}
    />
  );

  const card = screen.getByText('John Doe').closest('.trip-card')!;
  fireEvent.click(card);
  expect(onSelect).toHaveBeenCalled();
});

test('does not show pickup time when card is inactive', () => {
  const trip: Trip = {
    id: 't1',
    driverId: 'd1',
    status: 'pending',
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
  render(
    <TripCard
      trip={trip}
      isActive={false}
      onSelect={() => {}}
      onPassengerFilter={() => {}}
      onShowPassengerPage={() => {}}
      onShowDetails={() => {}}
    />
  );

  expect(screen.queryByText(/Pickup at/)).not.toBeInTheDocument();
});

test('shows pickup time when card is active', () => {
  const trip: Trip = {
    id: 't1',
    driverId: 'd1',
    status: 'pending',
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
  render(
    <TripCard
      trip={trip}
      isActive={true}
      onSelect={() => {}}
      onPassengerFilter={() => {}}
      onShowPassengerPage={() => {}}
      onShowDetails={() => {}}
    />
  );

  expect(screen.getByText(/Pickup at 10:00/)).toBeInTheDocument();
});

test('shows transport icon when card is active', () => {
  const trip: Trip = {
    id: 't1',
    driverId: 'd1',
    status: 'pending',
    passenger: 'John Doe',
    from: 'A',
    to: 'B',
    time: '10:00',
    date: '2024-01-01',
    inTime: '09:45',
    outTime: '10:15',
    miles: 5,
    transportType: 'Wheelchair',
    phone: '555-0000',
    medicaidNumber: 'MC-TEST',
    invoiceNumber: 'INV-TEST',
    pickupAddress: '123 Main St, New York, NY',
    dropoffAddress: '456 Broadway Ave, New York, NY',
    notes: 'n/a',
  };
  render(
    <TripCard
      trip={trip}
      isActive={true}
      onSelect={() => {}}
      onPassengerFilter={() => {}}
      onShowPassengerPage={() => {}}
      onShowDetails={() => {}}
    />
  );

  const icon = screen.getByLabelText('Wheelchair');
  expect(icon).toBeInTheDocument();
  expect(icon.querySelector('i')).toHaveClass('fa-wheelchair');
  expect(icon).toHaveAttribute('title', 'Wheelchair');
});
