import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import DriverCard from '../DriverCard';
import { Driver } from '../../mockData';
import { DriverStatus } from '../../utils/driverUtils';

test('calls onSelect and displays status', () => {
  const driver: Driver = { id: 'd1', name: 'Alice', photo: 'a', vehicle: 'car' };
  const status: DriverStatus = { className: 'status-pill-progress', text: 'En-Route' };
  const onSelect = jest.fn();
  render(<DriverCard driver={driver} status={status} isActive={false} onSelect={onSelect} />);

  fireEvent.click(screen.getByText('Alice'));
  expect(onSelect).toHaveBeenCalled();
  expect(screen.getByText('En-Route')).toBeInTheDocument();
});
