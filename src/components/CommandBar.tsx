import React from 'react';
import { formatDateForDisplay } from '../utils';

interface CommandBarProps {
  selectedDate: Date;
  pending: number;
  totalTrips: number;
  driversOnTrips: number;
  totalDrivers: number;
  onPrevDate: () => void;
  onNextDate: () => void;
}

export default function CommandBar({
  selectedDate,
  pending,
  totalTrips,
  driversOnTrips,
  totalDrivers,
  onPrevDate,
  onNextDate,
}: CommandBarProps) {
  return (
    <header className="command-bar">
      <div className="logo">Zenith</div>
      <div className="date-navigator">
        <i className="fas fa-chevron-left nav-arrow" onClick={onPrevDate} />
        <span id="current-date">{formatDateForDisplay(selectedDate)}</span>
        <i className="fas fa-chevron-right nav-arrow" onClick={onNextDate} />
      </div>
      <div className="kpis" id="kpis-container">
        <div className="kpi">
          PENDING <span>{pending}</span>
        </div>
        <div className="kpi">
          ACTIVE TRIPS <span>{totalTrips - pending}</span>
        </div>
        <div className="kpi">
          DRIVERS <span>{totalDrivers - driversOnTrips} / {totalDrivers}</span>
        </div>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div>
    </header>
  );
}
