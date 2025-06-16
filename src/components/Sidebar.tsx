import React from 'react';

export type ViewOption =
  | 'dashboard'
  | 'trips'
  | 'drivers'
  | 'passengers'
  | 'vehicles'
  | 'settings';

interface Props {
  current: ViewOption;
  onSelect: (view: ViewOption) => void;
  dark: boolean;
  toggleDark: () => void;
}

export const Sidebar: React.FC<Props> = ({ current, onSelect, dark, toggleDark }) => {
  const itemClass = (id: ViewOption) =>
    `block w-full text-left px-2 py-1 rounded ${current === id ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`;

  return (
    <aside className="w-48 flex-shrink-0 bg-white dark:bg-gray-800 p-4 space-y-2">
      <button className={itemClass('dashboard')} onClick={() => onSelect('dashboard')}>
        Dashboard
      </button>
      <button className={itemClass('trips')} onClick={() => onSelect('trips')}>
        Trips
      </button>
      <button className={itemClass('drivers')} onClick={() => onSelect('drivers')}>
        Drivers
      </button>
      <button className={itemClass('passengers')} onClick={() => onSelect('passengers')}>
        Passengers
      </button>
      <button className={itemClass('vehicles')} onClick={() => onSelect('vehicles')}>
        Vehicles
      </button>
      <button className={itemClass('settings')} onClick={() => onSelect('settings')}>
        Settings
      </button>
      <hr className="my-2 border-gray-300 dark:border-gray-700" />
      <button
        className="w-full px-2 py-1 text-left rounded border bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        onClick={toggleDark}
      >
        {dark ? 'Light' : 'Dark'} Mode
      </button>
    </aside>
  );
};
