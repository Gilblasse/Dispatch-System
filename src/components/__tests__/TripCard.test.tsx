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
  };
  const onSelect = jest.fn();
  render(
    <TripCard
      trip={trip}
      isActive={false}
      onSelect={onSelect}
      onPassengerFilter={() => {}}
      onShowDetails={() => {}}
    />
  );

  const card = screen.getByText('John Doe').closest('.trip-card')!;
  fireEvent.click(card);
  expect(onSelect).toHaveBeenCalled();
});
