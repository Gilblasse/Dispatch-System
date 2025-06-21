import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

const DateDisplay = forwardRef<HTMLSpanElement, { value?: string; onClick?: () => void }>(
  ({ value, onClick }, ref) => (
    <span id="current-date" onClick={onClick} ref={ref}>
      {value}
    </span>
  )
);

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

  return (
    <header className="command-bar">
      <div className="logo">Zenith</div>
      <div className="date-navigator">
        <i className="fas fa-chevron-left nav-arrow" onClick={onPrevDate} />
        <DatePicker
          id="date-picker"
          selected={selectedDate}
          onChange={(date: Date | null) => {
            if (date) onDateChange(date);
          }}
          customInput={<DateDisplay value={formatDateForDisplay(selectedDate)} />}
          dateFormat="MMM d"
          popperPlacement="bottom"
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
