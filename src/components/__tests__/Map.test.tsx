import React from 'react';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store';
import { setDrivers } from '../../store/driversSlice';
import { setTrips } from '../../store/tripsSlice';
import { setDarkMode } from '../../store/mapUiSlice';
import Map from '../Map';

jest.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));
jest.mock('../MapStyles.css', () => ({}));

jest.mock('maplibre-gl', () => {
  class Marker {
    element: HTMLElement;
    constructor({ element }: { element: HTMLElement }) {
      this.element = element;
    }
    setLngLat() { return this; }
    addTo(map: any) { map._element.appendChild(this.element); return this; }
    remove() { if (this.element.parentNode) this.element.parentNode.removeChild(this.element); }
  }
  return {
    Map: class {
      _element: HTMLElement;
      constructor(opts: any) { this._element = opts.container; }
      addControl() {}
      on() {}
      remove() {}
      setStyle() {}
      setZoom() {}
      setCenter() {}
      getCenter() { return { lng: 0, lat: 0 }; }
      getZoom() { return 12; }
      fitBounds() {}
    },
    LngLatBounds: class {
      sw: [number, number];
      ne: [number, number];
      constructor(sw: [number, number], ne: [number, number]) {
        this.sw = sw; this.ne = ne;
      }
      extend(pt: [number, number]) {
        return this;
      }
    },
    NavigationControl: class {},
    Marker,
  };
});

describe('Map passenger filter', () => {
  test('shows markers for all trips of the passenger', async () => {
    const originalDrivers = store.getState().drivers;
    const originalTrips = store.getState().trips;
    const originalUi = store.getState().mapUi;

    store.dispatch(setDrivers([
      { id: 'd1', lat: 0, lng: 0, status: 'idle' },
      { id: 'd2', lat: 2, lng: 2, status: 'idle' },
    ]));
    store.dispatch(setTrips([
      { id: 't1', driverId: 'd1', status: 'pending', passengerName: 'Alice', pickup: { lat: 0, lng: 0 }, dropoff: { lat: 1, lng: 1 } },
      { id: 't2', driverId: 'd2', status: 'pending', passengerName: 'Alice', pickup: { lat: 2, lng: 2 }, dropoff: { lat: 3, lng: 3 } },
      { id: 't3', driverId: 'd1', status: 'pending', passengerName: 'Bob', pickup: { lat: 4, lng: 4 }, dropoff: { lat: 5, lng: 5 } },
    ]));
    store.dispatch(setDarkMode(false));

    const { container } = render(
      <Provider store={store}>
        <Map filterType="passenger" filterId="Alice" activeTripId={null} />
      </Provider>
    );

    await waitFor(() => {
      expect(container.querySelectorAll('.map-pin.map-pickup-pin').length).toBe(2);
      expect(container.querySelectorAll('.map-pin.map-dropoff-pin').length).toBe(2);
    });

    store.dispatch(setDrivers(originalDrivers));
    store.dispatch(setTrips(originalTrips));
    store.dispatch(setDarkMode(originalUi.isDarkMode));
  });
});
