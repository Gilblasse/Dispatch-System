import React, { useState, useEffect } from 'react';
import { Passenger, Driver, Vehicle, Trip } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  drivers: Driver[];
  vehicles: Vehicle[];
  passengers: Passenger[];
  addTrip: (trip: Trip) => void;
  addPassenger: (p: Passenger) => void;
  updatePassenger: (p: Passenger) => void;
}

const defaultTrip: Omit<Trip, 'id' | 'invoice' | 'status'> = {
  date: '',
  time: '',
  passengerId: '',
  driverId: '',
  pickup: '',
  dropoff: '',
  payer: 'Medicaid',
  vehicleId: undefined,
  transport: 'Ambulatory',
  phone: '',
  medicaid: '',
};

export const AddTripModal: React.FC<Props> = ({
  open,
  onClose,
  drivers,
  vehicles,
  passengers,
  addTrip,
  addPassenger,
  updatePassenger,
}) => {
  const [form, setForm] = useState(defaultTrip);
  const [invoice, setInvoice] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [phones, setPhones] = useState<string[]>(['']);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setForm(defaultTrip);
      setInvoice('');
      setPassengerName('');
      setPhones(['']);
    }
  }, [open]);

  const handlePassengerChange = (name: string) => {
    setPassengerName(name);
    const passenger = passengers.find(
      p => p.name.toLowerCase() === name.toLowerCase()
    );
    if (passenger) {
      setForm(prev => ({
        ...prev,
        passengerId: passenger.id,
        phone: passenger.phone[0] || '',
        medicaid: passenger.medicaid ?? '',
        payer: passenger.medicaid ? 'Medicaid' : 'Private',
      }));
      setPhones(passenger.phone.slice());
    } else {
      setForm(prev => ({ ...prev, passengerId: '' }));
      setPhones(['']);
    }
  };

  const handlePhoneChange = (index: number, value: string) => {
    const updated = [...phones];
    updated[index] = value;
    setPhones(updated);
    setForm(prev => ({ ...prev, phone: updated[0] || '' }));
  };

  const addPhoneField = () => setPhones(prev => [...prev, '']);

  const removePhoneField = (index: number) => {
    const updated = phones.filter((_, i) => i !== index);
    setPhones(updated.length ? updated : ['']);
    setForm(prev => ({ ...prev, phone: (updated[0] || '') }));
  };

  const selectedPassenger = passengers.find(p => p.id === form.passengerId);

  const handleSubmit = () => {
    let passengerId = form.passengerId;
    if (!passengerId) {
      passengerId = `p-${Date.now()}`;
      const newPassenger: Passenger = {
        id: passengerId,
        name: passengerName,
        phone: phones.filter(p => p.trim() !== ''),
        medicaid: form.medicaid || undefined,
        lastPickup: form.pickup,
        lastDropoff: form.dropoff,
      };
      addPassenger(newPassenger);
    } else {
      const existing = passengers.find(p => p.id === passengerId);
      if (existing) {
        const trimmed = phones.filter(p => p.trim() !== '');
        const phoneSet = Array.from(new Set([...existing.phone, ...trimmed]));
        const pickupChanged = form.pickup && form.pickup !== existing.lastPickup;
        const dropoffChanged =
          form.dropoff && form.dropoff !== existing.lastDropoff;
        if (
          phoneSet.length !== existing.phone.length ||
          pickupChanged ||
          dropoffChanged
        ) {
          updatePassenger({
            ...existing,
            phone: phoneSet,
            lastPickup: pickupChanged ? form.pickup : existing.lastPickup,
            lastDropoff: dropoffChanged ? form.dropoff : existing.lastDropoff,
          });
        }
      }
    }

    const newTrip: Trip = {
      id: `t-${Date.now()}`,
      invoice: invoice || `INV-${Date.now()}`,
      status: 'scheduled',
      ...form,
      phone: phones[0] || '',
      passengerId,
    };
    addTrip(newTrip);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-trip-modal-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-lg">
        <h2
          id="add-trip-modal-title"
          className="text-xl mb-4 font-semibold text-gray-800 dark:text-gray-100"
        >
          Add Trip
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Passenger</label>
            <input
              list="passenger-list"
              className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
              value={passengerName}
              onChange={e => handlePassengerChange(e.target.value)}
              placeholder="Select or type passenger"
            />
            <datalist id="passenger-list">
              {passengers.map(p => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Phone</label>
              {phones.map((p, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="text"
                    list={`phone-list-${idx}`}
                    className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                    value={p}
                    onChange={e => handlePhoneChange(idx, e.target.value)}
                  />
                  {phones.length > 1 && (
                    <button
                      type="button"
                      className="ml-2 text-red-500"
                      onClick={() => removePhoneField(idx)}
                    >
                      Remove
                    </button>
                  )}
                  <datalist id={`phone-list-${idx}`}>
                    {(selectedPassenger?.phone || []).map(num => (
                      <option key={num} value={num} />
                    ))}
                  </datalist>
                </div>
              ))}
              <button
                type="button"
                className="mt-1 text-sm text-blue-600"
                onClick={addPhoneField}
              >
                Add Phone
              </button>
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Payer</label>
              <select
                className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                value={form.payer}
                onChange={e => setForm({ ...form, payer: e.target.value as 'Medicaid' | 'Private' })}
              >
                <option value="Medicaid">Medicaid</option>
                <option value="Private">Private</option>
              </select>
            </div>
          </div>
          {form.payer === 'Medicaid' && (
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Medicaid ID</label>
              <input
                type="text"
                className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                value={form.medicaid}
                onChange={e => setForm({ ...form, medicaid: e.target.value })}
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Pickup</label>
              <input
                type="text"
                className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                value={form.pickup}
                onChange={e => setForm({ ...form, pickup: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Dropoff</label>
              <input
                type="text"
                className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                value={form.dropoff}
                onChange={e => setForm({ ...form, dropoff: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Date</label>
              <input
                type="date"
                className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Time</label>
              <input
                type="time"
                className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Driver</label>
              <select
                className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                value={form.driverId}
                onChange={e => setForm({ ...form, driverId: e.target.value })}
              >
                <option value="">Select driver</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Vehicle</label>
              <select
                className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                value={form.vehicleId}
                onChange={e => setForm({ ...form, vehicleId: e.target.value })}
              >
                <option value="">Select vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Transport</label>
            <select
              className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
              value={form.transport}
              onChange={e => setForm({ ...form, transport: e.target.value as Trip['transport'] })}
            >
              <option value="Ambulatory">Ambulatory</option>
              <option value="Wheelchair">Wheelchair</option>
              <option value="Taxi">Taxi</option>
              <option value="Stretcher">Stretcher</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Invoice</label>
            <input
              type="text"
              className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
              value={invoice}
              onChange={e => setInvoice(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

