import React, { useState, useEffect } from 'react';
import {
  trips as initialTrips,
  drivers as initialDrivers,
  passengers as initialPassengers,
  vehicles,
} from './data/mockData';
import { Trip, Driver, Passenger } from './types';
import { DispatcherDashboard } from './components/DispatcherDashboard';
import { DriverManager } from './components/DriverManager';

export const App: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [passengers, setPassengers] = useState<Passenger[]>(initialPassengers);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [dark]);

  // Load persisted trips, drivers and passengers on first render
  useEffect(() => {
    const storedTrips = localStorage.getItem('trips');
    const storedDrivers = localStorage.getItem('drivers');
    const storedPassengers = localStorage.getItem('passengers');

    if (storedTrips) {
      try {
        setTrips(JSON.parse(storedTrips));
      } catch {
        // ignore parse errors and keep defaults
      }
    }

    if (storedDrivers) {
      try {
        setDrivers(JSON.parse(storedDrivers));
      } catch {
        // ignore parse errors and keep defaults
      }
    }

    if (storedPassengers) {
      try {
        setPassengers(JSON.parse(storedPassengers));
      } catch {
        // ignore parse errors and keep defaults
      }
    }
  }, []);

  // Persist trips, drivers and passengers whenever they change
  useEffect(() => {
    localStorage.setItem('trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('passengers', JSON.stringify(passengers));
  }, [passengers]);

  const addTrip = (trip: Trip) => {
    setTrips(prev => [...prev, trip]);
  };

  const addDriver = (driver: Driver) => {
    setDrivers(prev => [...prev, driver]);
  };

  const addPassenger = (passenger: Passenger) => {
    setPassengers(prev => [...prev, passenger]);
  };

  const updatePassenger = (passenger: Passenger) => {
    setPassengers(prev =>
      prev.map(p => (p.id === passenger.id ? passenger : p))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dispatcher Dashboard</h1>
        <button
          className="px-2 py-1 text-sm rounded border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          onClick={() => setDark(!dark)}
        >
          {dark ? 'Light' : 'Dark'} Mode
        </button>
      </div>
      <DispatcherDashboard
        trips={trips}
        drivers={drivers}
        vehicles={vehicles}
        passengers={passengers}
        addTrip={addTrip}
        addPassenger={addPassenger}
        updatePassenger={updatePassenger}
      />
      <DriverManager drivers={drivers} addDriver={addDriver} />
    </div>
  );
};

