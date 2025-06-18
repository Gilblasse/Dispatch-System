import React from 'react';
import { Driver, Trip } from '../mockData';
import DriverCard from './DriverCard';
import { getDriverStatus } from '../utils/driverUtils';


interface DriverRosterProps {
  drivers: Driver[];
  trips: Trip[];
  activeDriverId: string | null;
  onSelectDriver: (driverId: string) => void;
}

export default function DriverRoster({ drivers, trips, activeDriverId, onSelectDriver }: DriverRosterProps) {
  return (
    <footer className="driver-roster">
      <div className="panel-header">
        <h2>Active Drivers</h2>
      </div>
      <div className="roster-scroll" id="driver-roster-container">
        {drivers.map(driver => (
          <DriverCard
            key={driver.id}
            driver={driver}
            status={getDriverStatus(driver.id, trips)}
            isActive={activeDriverId === driver.id}
            onSelect={() => onSelectDriver(driver.id)}
          />
        ))}
      </div>
    </footer>
  );
}
