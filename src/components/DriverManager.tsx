import React, { useState } from 'react';
import { Driver } from '../types';

interface Props {
  drivers: Driver[];
  addDriver: (driver: Driver) => void;
}

export const DriverManager: React.FC<Props> = ({ drivers, addDriver }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleAdd = () => {
    if (!name || !phone || !email) return;
    addDriver({ id: `d-${Date.now()}`, name, phone, email });
    setName('');
    setPhone('');
    setEmail('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Drivers</h2>
      <ul className="space-y-1 mb-4">
        {drivers.map(d => (
          <li key={d.id} className="text-gray-700 dark:text-gray-200">{d.name} - {d.phone}</li>
        ))}
      </ul>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          type="text"
          className="border rounded p-2 bg-gray-50 dark:bg-gray-700"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="text"
          className="border rounded p-2 bg-gray-50 dark:bg-gray-700"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <input
          type="email"
          className="border rounded p-2 bg-gray-50 dark:bg-gray-700"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleAdd}
      >
        Add Driver
      </button>
    </div>
  );
};
