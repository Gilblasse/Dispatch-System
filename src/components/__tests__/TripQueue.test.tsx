import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TripQueue from '../TripQueue';

test('shows message when no trips are available', () => {
  render(
    <TripQueue
      trips={[]}
      drivers={{}}
      filterType="none"
      filterId={null}
      detailedTrip={null}
      activeTripId={null}
      onSelectTrip={() => {}}
      onPassengerFilter={() => {}}
      onShowTripDetails={() => {}}
      onCloseTripDetails={() => {}}
      onClearFilter={() => {}}
    />
  );

  expect(screen.getByText('No trips found.')).toBeInTheDocument();
});
