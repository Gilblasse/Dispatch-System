import React, { useState } from 'react';
import { Driver } from '../types';

interface Props {
  drivers: Driver[];
  addDriver: (driver: Driver) => void;
  updateDriver: (driver: Driver) => void;
}

export const DriverManager: React.FC<Props> = ({ drivers, addDriver, updateDriver }) => {
  const [newDriver, setNewDriver] = useState<Driver | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Driver | null>(null);

  const handleAddRow = () => {
    setNewDriver({
      id: '',
      name: '',
      phone: '',
      email: '',
      license: '',
      licenseExpiration: '',
    });
  };

  const handleSaveNew = () => {
    if (!newDriver) return;
    if (
      !newDriver.name ||
      !newDriver.phone ||
      !newDriver.email ||
      !newDriver.license ||
      !newDriver.licenseExpiration
    )
      return;
    addDriver({ ...newDriver, id: `d-${Date.now()}` });
    setNewDriver(null);
  };

  const handleCancelNew = () => setNewDriver(null);

  const handleEdit = (driver: Driver) => {
    setEditingId(driver.id);
    setEditData({ ...driver });
  };

  const handleSaveEdit = () => {
    if (!editData) return;
    updateDriver(editData);
    setEditingId(null);
    setEditData(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const renderRowInputs = (data: Driver, onChange: (d: Driver) => void, save: () => void, cancel: () => void) => (
    <tr>
      <td className="p-2 w-1/6">
        <input
          className="border rounded p-1 w-full bg-gray-50 dark:bg-gray-700"
          value={data.name}
          onChange={e => onChange({ ...data, name: e.target.value })}
        />
      </td>
      <td className="p-2 w-1/6">
        <input
          className="border rounded p-1 w-full bg-gray-50 dark:bg-gray-700"
          value={data.phone}
          onChange={e => onChange({ ...data, phone: e.target.value })}
        />
      </td>
      <td className="p-2 w-1/6">
        <input
          className="border rounded p-1 w-full bg-gray-50 dark:bg-gray-700"
          value={data.email}
          onChange={e => onChange({ ...data, email: e.target.value })}
        />
      </td>
      <td className="p-2 w-1/6">
        <input
          className="border rounded p-1 w-full bg-gray-50 dark:bg-gray-700"
          value={data.license}
          onChange={e => onChange({ ...data, license: e.target.value })}
        />
      </td>
      <td className="p-2 w-1/6">
        <input
          type="date"
          className="border rounded p-1 w-full bg-gray-50 dark:bg-gray-700"
          value={data.licenseExpiration}
          onChange={e => onChange({ ...data, licenseExpiration: e.target.value })}
        />
      </td>
      <td className="p-2 w-1/6 flex space-x-1">
        <button className="text-green-600" onClick={save} title="Save">✔️</button>
        <button className="text-red-600" onClick={cancel} title="Cancel">✖️</button>
      </td>
    </tr>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Drivers</h2>
      <button className="mb-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAddRow}>
        Add Driver
      </button>
      <table className="min-w-full w-full table-fixed">
        <thead>
          <tr className="text-left text-gray-700 dark:text-gray-200">
            <th className="p-2 w-1/6">Name</th>
            <th className="p-2 w-1/6">Phone</th>
            <th className="p-2 w-1/6">Email</th>
            <th className="p-2 w-1/6">License</th>
            <th className="p-2 w-1/6">Expiration</th>
            <th className="p-2 w-1/6" />
          </tr>
        </thead>
        <tbody>
          {drivers.map(d =>
            editingId === d.id && editData ? (
              renderRowInputs(editData, setEditData, handleSaveEdit, handleCancelEdit)
            ) : (
              <tr key={d.id} className="text-gray-700 dark:text-gray-200">
                <td className="p-2 w-1/6 break-words">{d.name}</td>
                <td className="p-2 w-1/6 break-words">{d.phone}</td>
                <td className="p-2 w-1/6 break-words">{d.email}</td>
                <td className="p-2 w-1/6 break-words">{d.license}</td>
                <td className="p-2 w-1/6 break-words">{d.licenseExpiration}</td>
                <td className="p-2 w-1/6">
                  <button className="text-blue-600" onClick={() => handleEdit(d)} title="Edit">
                    ✏️
                  </button>
                </td>
              </tr>
            )
          )}
          {newDriver &&
            renderRowInputs(newDriver, setNewDriver, handleSaveNew, handleCancelNew)}
        </tbody>
      </table>
    </div>
  );
};
