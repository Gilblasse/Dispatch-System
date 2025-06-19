import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store';
import TripQueue from '../TripQueue';

test('shows message when no trips are available', () => {
  render(
    <Provider store={store}>
      <TripQueue
        selectedDate={new Date('2000-01-01')}
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
    </Provider>
  );

  expect(screen.getByText('No trips found.')).toBeInTheDocument();
});
