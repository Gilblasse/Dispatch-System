import React, { useState } from 'react';
import { Driver } from '../types';

interface Props {
  drivers: Driver[];
  addDriver: (d: Driver) => void;
  updateDriver: (d: Driver) => void;
}

type Editing = 'new' | string | null;

export const DriverManager: React.FC<Props> = ({
  drivers,
  addDriver,
  updateDriver,
}) => {
  const empty = {
    name: '',
    phone: '',
    email: '',
    license: '',
    licenseExp: '',
  };

  const [editing, setEditing] = useState<Editing>(null);
  const [form, setForm] = useState<Omit<Driver, 'id'>>({ ...empty });

  const startAdd = () => {
    setEditing('new');
    setForm({ ...empty });
  };

  const startEdit = (d: Driver) => {
    setEditing(d.id);
    setForm({
      name: d.name,
      phone: d.phone,
      email: d.email,
      license: d.license,
      licenseExp: d.licenseExp,
    });
  };

  const cancel = () => {
    setEditing(null);
  };

  const save = () => {
    if (!form.name || !form.phone || !form.email || !form.license || !form.licenseExp) return;
    if (editing === 'new') {
      addDriver({ id: `d-${Date.now()}`, ...form });
    } else if (editing) {
      updateDriver({ id: editing, ...form });
    }
    setEditing(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const renderRow = (d: Driver) => {
    if (editing === d.id) {
      return (
        <tr key={d.id}>
          <td className="p-2 border-b">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded p-1 w-full bg-gray-50 dark:bg-gray-700"
            />
          </td>
          <td className="p-2 border-b">
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border rounded p-1 w-full bg-gray-50 dark:bg-gray-700"
            />
          </td>
          <td className="p-2 border-b">
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border rounded p-1 w-full bg-gray-50 dark:bg-gray-700"
            />
          </td>
          <td className="p-2 border-b">
            <input
              name="license"
              value={form.license}
              onChange={handleChange}
              className="border rounded p-1 w-full bg-gray-50 dark:bg-gray-700"
            />
          </td>
          <td className="p-2 border-b">
            <input
              type="date"
              name="licenseExp"
              value={form.licenseExp}
              onChange={handleChange}
              className="border rounded p-1 w-full bg-gray-50 dark:bg-gray-700"
            />
          </td>
          <td className="p-2 border-b whitespace-nowrap">
            <button className="mr-2 text-green-600" onClick={save} title="Save">
              ✔️
            </button>
            <button className="text-red-600" onClick={cancel} title="Cancel">
              ✖️
            </button>
          </td>
        </tr>
      );
    }
    return (
      <tr key={d.id}>
        <td className="p-2 border-b">{d.name}</td>
        <td className="p-2 border-b">{d.phone}</td>
        <td className="p-2 border-b">{d.email}</td>
        <td className="p-2 border-b">{d.license}</td>
        <td className="p-2 border-b">{d.licenseExp}</td>
        <td className="p-2 border-b whitespace-nowrap">
          <button className="text-blue-600" onClick={() => startEdit(d)}>
            Edit
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Drivers
        </h2>
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={startAdd}
        >
          Add Driver
        </button>
      </div>
      <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-200">
        <thead>
          <tr>
            <th className="p-2 border-b">Name</th>
            <th className="p-2 border-b">Phone Number</th>
            <th className="p-2 border-b">Email</th>
            <th className="p-2 border-b">License</th>
            <th className="p-2 border-b">Expires</th>
            <th className="p-2 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {editing === 'new' && renderRow({ id: '', ...empty })}
          {drivers.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
};
