import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import DriverRoster from '../DriverRoster';
import { Driver, Trip } from '../../mockData';

test('renders driver names', () => {
  const drivers: Driver[] = [
    { id: 'd1', name: 'Alice', photo: 'a', vehicle: 'car' },
    { id: 'd2', name: 'Bob', photo: 'b', vehicle: 'van' },
  ];
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
      pickupAddress: '123 A St',
      dropoffAddress: '456 B Ave',
      notes: 'n/a',
    },
  ];
  render(
    <DriverRoster
      drivers={drivers}
      trips={trips}
      activeDriverId={null}
      onSelectDriver={() => {}}
      collapsed={false}
      onToggleCollapse={() => {}}
    />
  );

  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Bob')).toBeInTheDocument();
});

test('wheel event scrolls roster', () => {
  const drivers: Driver[] = [
    { id: 'd1', name: 'Alice', photo: 'a', vehicle: 'car' },
  ];
  const trips: Trip[] = [];
  const { container } = render(
    <DriverRoster
      drivers={drivers}
      trips={trips}
      activeDriverId={null}
      onSelectDriver={() => {}}
      collapsed={false}
      onToggleCollapse={() => {}}
    />
  );

  const roster = container.querySelector('#driver-roster-container') as HTMLElement;
  roster.scrollLeft = 0;
  fireEvent.wheel(roster, { deltaY: 30 });
  expect(roster.scrollLeft).toBe(30);
});

test('collapse button toggles roster visibility', () => {
  const drivers: Driver[] = [
    { id: 'd1', name: 'Alice', photo: 'a', vehicle: 'car' },
  ];
  const trips: Trip[] = [];

  function Wrapper() {
    const [collapsed, setCollapsed] = React.useState(false);
    return (
      <div className={`dashboard-container${collapsed ? ' roster-collapsed' : ''}`}>
        <DriverRoster
          drivers={drivers}
          trips={trips}
          activeDriverId={null}
          onSelectDriver={() => {}}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(c => !c)}
        />
      </div>
    );
  }

  const { container } = render(<Wrapper />);

  const button = screen.getByRole('button');
  const dashboard = container.querySelector('.dashboard-container') as HTMLElement;

  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(dashboard.classList.contains('roster-collapsed')).toBe(false);
  fireEvent.click(button);
  expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  expect(dashboard.classList.contains('roster-collapsed')).toBe(true);
  fireEvent.click(button);
  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(dashboard.classList.contains('roster-collapsed')).toBe(false);
});