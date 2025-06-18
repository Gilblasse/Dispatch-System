import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DriverRoster from '../DriverRoster';
import { Driver, Trip } from '../../mockData';

test('renders driver names', () => {
  const drivers: Driver[] = [
    { id: 'd1', name: 'Alice', photo: 'a', vehicle: 'car' },
    { id: 'd2', name: 'Bob', photo: 'b', vehicle: 'van' },
  ];
  const trips: Trip[] = [
    { id: 't1', driverId: 'd1', status: 'en-route', passenger: 'P', from: 'A', to: 'B', time: '10:00' },
  ];
  render(
    <DriverRoster
      drivers={drivers}
      trips={trips}
      activeDriverId={null}
      onSelectDriver={() => {}}
    />
  );

  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Bob')).toBeInTheDocument();
});
