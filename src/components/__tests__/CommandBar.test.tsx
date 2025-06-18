import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CommandBar from '../CommandBar';
import { formatDateForDisplay } from '../../utils/dateUtils';

test('renders KPIs and selected date', () => {
  const date = new Date('2024-01-01');
  render(
    <CommandBar
      selectedDate={date}
      pending={2}
      totalTrips={4}
      driversOnTrips={1}
      totalDrivers={3}
      onPrevDate={() => {}}
      onNextDate={() => {}}
      onDateChange={() => {}}
    />
  );

  expect(screen.getByText('Zenith')).toBeInTheDocument();
  expect(screen.getByText(formatDateForDisplay(date))).toBeInTheDocument();
});

test('clicking current date triggers date picker', () => {
  const date = new Date('2024-01-01');
  render(
    <CommandBar
      selectedDate={date}
      pending={0}
      totalTrips={0}
      driversOnTrips={0}
      totalDrivers={0}
      onPrevDate={() => {}}
      onNextDate={() => {}}
      onDateChange={() => {}}
    />
  );

  const input = document.getElementById('date-picker') as HTMLInputElement;
  // mock showPicker if available
  (input as any).showPicker = jest.fn();
  fireEvent.click(screen.getByText(formatDateForDisplay(date)));
  expect((input as any).showPicker).toHaveBeenCalled();
});
