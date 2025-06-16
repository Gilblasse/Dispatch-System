import React, { useState, useEffect } from 'react';
import { Passenger, Driver, Vehicle, Trip } from '../types';
import { AutocompleteInput } from './AutocompleteInput';

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
  const [notes, setNotes] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [phones, setPhones] = useState<string[]>(['']);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setForm(defaultTrip);
      setInvoice('');
      setNotes('');
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
        pickup: '',
        dropoff: '',
      }));
      setPhones(passenger.phone.slice());
    } else {
      setForm(prev => ({ ...prev, passengerId: '', pickup: '', dropoff: '' }));
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

  const isFormValid = Boolean(
    (passengerName || form.passengerId) &&
      form.payer &&
      (form.payer === 'Private' || form.medicaid) &&
      form.date
  );

  const handleSubmit = () => {
    if (!passengerName && !form.passengerId) {
      alert('Passenger is required');
      return;
    }
    if (!form.payer) {
      alert('Payer is required');
      return;
    }
    if (form.payer === 'Medicaid' && !form.medicaid) {
      alert('Medicaid ID is required');
      return;
    }
    if (!form.date) {
      alert('Date is required');
      return;
    }
    let passengerId = form.passengerId;
    if (!passengerId) {
      passengerId = `p-${Date.now()}`;
      const newPassenger: Passenger = {
        id: passengerId,
        name: passengerName,
        phone: phones.filter(p => p.trim() !== ''),
        medicaid: form.medicaid || undefined,
        addresses: [form.pickup, form.dropoff].filter(a => a.trim() !== ''),
      };
      addPassenger(newPassenger);
    } else {
      const existing = passengers.find(p => p.id === passengerId);
      if (existing) {
        const trimmed = phones.filter(p => p.trim() !== '');
        const phoneSet = Array.from(new Set([...existing.phone, ...trimmed]));
        const newAddrs = [form.pickup, form.dropoff].filter(
          a => a.trim() && !existing.addresses.includes(a)
        );
        const addresses = [...existing.addresses, ...newAddrs];
        if (phoneSet.length !== existing.phone.length || newAddrs.length > 0) {
          updatePassenger({ ...existing, phone: phoneSet, addresses });
        }
      }
    }

    const newTrip: Trip = {
      id: `t-${Date.now()}`,
      invoice: invoice || `INV-${Date.now()}`,
      status: 'scheduled',
      ...form,
      phone: phones[0] || '',
      notes: notes || undefined,
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
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Passenger<span className="text-red-500 ml-0.5">*</span>
            </label>
            <AutocompleteInput
              suggestions={passengers.map(p => p.name)}
              className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
              value={passengerName}
              onChange={handlePassengerChange}
              placeholder="Select or type passenger"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Phone</label>
              {phones.map((p, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <AutocompleteInput
                    type="text"
                    suggestions={selectedPassenger?.phone || []}
                    className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                    value={p}
                    onChange={val => handlePhoneChange(idx, val)}
                    placeholder="Phone number"
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
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Payer<span className="text-red-500 ml-0.5">*</span>
              </label>
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
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Medicaid ID<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                value={form.medicaid}
                onChange={e => setForm({ ...form, medicaid: e.target.value })}
              />
            </div>
          )}
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
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Notes</label>
            <textarea
              className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Pickup</label>
              <AutocompleteInput
                type="text"
                suggestions={selectedPassenger?.addresses || []}
                className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                value={form.pickup}
                onChange={val => setForm({ ...form, pickup: val })}
                placeholder="Pickup address"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Dropoff</label>
              <AutocompleteInput
                type="text"
                suggestions={selectedPassenger?.addresses || []}
                className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                value={form.dropoff}
                onChange={val => setForm({ ...form, dropoff: val })}
                placeholder="Dropoff address"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Date<span className="text-red-500 ml-0.5">*</span>
              </label>
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
          <div className="flex justify-end space-x-2 pt-4">
            <button
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded text-white bg-blue-600 ${
                isFormValid ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

