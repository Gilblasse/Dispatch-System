import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store';
import App from '../App';
import * as tripUtils from '../utils/tripUtils';
import { setTrips } from '../store/tripsSlice';
import { MOCK_TRIPS_MAP } from '../mockData';

jest.mock('../components/Map', () => () => <div data-testid="map" />);

describe('App passenger interactions', () => {
  const originalTrips = store.getState().trips;

  beforeEach(() => {
    jest.spyOn(tripUtils, 'mapScheduleToTrips').mockResolvedValue(MOCK_TRIPS_MAP);
  });

  afterEach(() => {
    store.dispatch(setTrips(originalTrips));
    (tripUtils.mapScheduleToTrips as jest.Mock).mockRestore();
  });

  test('opens passenger page on trip card double click', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const card = (await screen.findAllByText('Dr. Evelyn Reed'))[0].closest('.trip-card')!;
    fireEvent.doubleClick(card);

    expect(await screen.findByText('Trip History')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Manifest/i })).toBeInTheDocument();
  });

  test('filters trips when passenger name clicked', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const header = (await screen.findAllByText('Dr. Evelyn Reed'))[0];
    fireEvent.click(header);

    const title = await screen.findByText('Passenger: Dr. Evelyn Reed');
    expect(title).toBeInTheDocument();
  });
});
