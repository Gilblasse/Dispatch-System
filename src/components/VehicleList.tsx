import React from 'react';
import { Vehicle } from '../types';

interface Props {
  vehicles: Vehicle[];
}

export const VehicleList: React.FC<Props> = ({ vehicles }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Vehicles</h2>
    <ul className="space-y-1">
      {vehicles.map(v => (
        <li key={v.id} className="text-gray-700 dark:text-gray-200">
          {v.label}
        </li>
      ))}
    </ul>
  </div>
);
