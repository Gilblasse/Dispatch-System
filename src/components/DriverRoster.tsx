import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getDateKey } from '../utils/dateUtils';
import DriverCard from './DriverCard';
import { getDriverStatus } from '../utils/driverUtils';


type FilterType = 'none' | 'trip' | 'driver' | 'passenger';

interface DriverRosterProps {
  selectedDate: Date;
  activeDriverId: string | null;
  onSelectDriver: (driverId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  filterType: FilterType;
  filterId: string | null;
}

export default function DriverRoster({
  selectedDate,
  activeDriverId,
  onSelectDriver,
  collapsed,
  onToggleCollapse,
  filterType,
  filterId,
}: DriverRosterProps) {
  const drivers = useSelector((s: RootState) => s.driverDetails);
  const schedule = useSelector((s: RootState) => s.tripsDetails);
  const dateKey = getDateKey(selectedDate);
  const trips = schedule[dateKey] || [];
  let driversList = Object.entries(drivers).map(([id, d]) => ({ id, ...d }));

  if (filterType === 'passenger' && filterId) {
    const driverIds = new Set(
      trips.filter(t => t.passenger === filterId).map(t => t.driverId),
    );
    driversList = driversList.filter(d => driverIds.has(d.id));
  }

  return (
    <footer className={`driver-roster${collapsed ? ' collapsed' : ''}`}>
      <div
        className="panel-header"
        role="button"
        tabIndex={0}
        aria-label={collapsed ? 'Expand Active Drivers' : 'Collapse Active Drivers'}
        onClick={onToggleCollapse}
        onKeyPress={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            onToggleCollapse();
          }
        }}
      >
        <h2>Active Drivers</h2>
        <i className={`fas fa-chevron-${collapsed ? 'up' : 'down'}`} />
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
          {driversList.map(driver => (
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