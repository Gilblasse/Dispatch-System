import React from 'react';
import { Driver, Trip } from '../mockData';
import DriverCard from './DriverCard';
import { getDriverStatus } from '../utils/driverUtils';


interface DriverRosterProps {
  drivers: Driver[];
  trips: Trip[];
  activeDriverId: string | null;
  onSelectDriver: (driverId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function DriverRoster({
  drivers,
  trips,
  activeDriverId,
  onSelectDriver,
  collapsed,
  onToggleCollapse,
}: DriverRosterProps) {

  return (
    <footer className={`driver-roster${collapsed ? ' collapsed' : ''}`}> 
      <div className="panel-header">
        <h2>Active Drivers</h2>
        <button
          aria-label={collapsed ? 'Expand Active Drivers' : 'Collapse Active Drivers'}
          className="collapse-btn"
          onClick={onToggleCollapse}
        >
          <i className={`fas fa-chevron-${collapsed ? 'up' : 'down'}`} />
        </button>
      </div>
      {!collapsed && (
        <div
          className="roster-scroll"
          id="driver-roster-container"
          onWheel={e => {
            e.preventDefault();
            e.currentTarget.scrollLeft += e.deltaY;
          }}
        >
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
      )}
    </footer>
  );
}
