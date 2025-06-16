import React, { useState, useEffect } from 'react';
import { trips as initialTrips, drivers as initialDrivers, vehicles } from './data/mockData';
import { Trip, Driver } from './types';
import { DispatcherDashboard } from './components/DispatcherDashboard';
import { DriverManager } from './components/DriverManager';

export const App: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [dark]);

  const addTrip = (trip: Trip) => {
    setTrips(prev => [...prev, trip]);
  };

  const addDriver = (driver: Driver) => {
    setDrivers(prev => [...prev, driver]);
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
      <DispatcherDashboard trips={trips} drivers={drivers} vehicles={vehicles} addTrip={addTrip} />
      <DriverManager drivers={drivers} addDriver={addDriver} />
    </div>
  );
};

