import React, { useState } from 'react';
import { Trip, Driver, Vehicle } from '../types';
import { passengers } from '../data/mockData';
import { AddTripModal } from './AddTripModal';

interface Props {
  trips: Trip[];
  drivers: Driver[];
  vehicles: Vehicle[];
  addTrip: (trip: Trip) => void;
}

export const DispatcherDashboard: React.FC<Props> = ({ trips, drivers, vehicles, addTrip }) => {
  const [filterDriver, setFilterDriver] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filteredTrips = trips.filter(t => {
    return (!filterDriver || t.driverId === filterDriver) && (!filterDate || t.date === filterDate);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-2 md:space-y-0">
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Driver</label>
          <select
            className="border rounded p-2 w-full bg-gray-50 dark:bg-gray-700"
            value={filterDriver}
            onChange={e => setFilterDriver(e.target.value)}
          >
            <option value="">All Drivers</option>
            {drivers.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            className="border rounded p-2 w-full bg-gray-50 dark:bg-gray-700"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
        </div>
        <button
          className="md:ml-auto px-4 py-2 rounded bg-blue-600 text-white"
          onClick={() => setModalOpen(true)}
        >
          Add Trip
        </button>
      </div>
      <ul className="space-y-2">
        {filteredTrips.map(trip => (
          <li key={trip.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">{passengers.find(p => p.id === trip.passengerId)?.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{trip.date} {trip.time}</span>
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {trip.pickup} → {trip.dropoff}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Status: {trip.status}
            </div>
          </li>
        ))}
      </ul>
      <AddTripModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        drivers={drivers}
        vehicles={vehicles}
        addTrip={addTrip}
      />
    </div>
  );
};
