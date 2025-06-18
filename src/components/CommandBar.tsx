import React, { useRef } from 'react';
import { formatDateForDisplay } from '../utils/dateUtils';

interface CommandBarProps {
  selectedDate: Date;
  pending: number;
  totalTrips: number;
  driversOnTrips: number;
  totalDrivers: number;
  onPrevDate: () => void;
  onNextDate: () => void;
  onDateChange: (date: Date) => void;
}

export default function CommandBar({
  selectedDate,
  pending,
  totalTrips,
  driversOnTrips,
  totalDrivers,
  onPrevDate,
  onNextDate,
  onDateChange,
}: CommandBarProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = () => {
    const input = dateInputRef.current;
    if (!input) return;
    if (typeof (input as any).showPicker === 'function') {
      (input as any).showPicker();
    } else {
      input.focus();
      input.click();
    }
  };

  return (
    <header className="command-bar">
      <div className="logo">Zenith</div>
      <div className="date-navigator">
        <i className="fas fa-chevron-left nav-arrow" onClick={onPrevDate} />
        <span id="current-date" onClick={handleDateClick}>{formatDateForDisplay(selectedDate)}</span>
        <input
          id="date-picker"
          type="date"
          ref={dateInputRef}
          style={{ position: 'absolute', left: '-9999px' }}
          value={selectedDate.toISOString().split('T')[0]}
          onChange={e => onDateChange(new Date(e.target.value))}
        />
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
