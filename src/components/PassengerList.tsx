import React from 'react';
import { Passenger } from '../types';

interface Props {
  passengers: Passenger[];
}

export const PassengerList: React.FC<Props> = ({ passengers }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Passengers</h2>
    <ul className="space-y-1">
      {passengers.map(p => (
        <li key={p.id} className="text-gray-700 dark:text-gray-200">
          {p.name} - {p.phone.join(', ')}
        </li>
      ))}
    </ul>
  </div>
);
