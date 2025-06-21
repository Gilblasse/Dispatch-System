import React from 'react';
import { Trip } from '../mockData';
import { formatDateWithYear } from '../utils/dateUtils';
import StatusPill from './StatusPill';
import styles from './PassengerPage.module.css';

interface TripHistoryItemProps {
  trip: Trip;
  isActive: boolean;
  isPast: boolean;
  onSelect: (id: string) => void;
}

export default function TripHistoryItem({ trip, isActive, isPast, onSelect }: TripHistoryItemProps) {
  const itemClasses = [
    styles.tripHistoryItem,
    isActive ? styles.tripHistoryItemActive : '',
    isPast ? styles.tripHistoryItemMuted : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={itemClasses} onClick={() => onSelect(trip.id)}>
      <div className={styles.historyItemHeader}>
        <span>{formatDateWithYear(new Date(trip.date))}</span>
        <StatusPill status={trip.status} />
      </div>
      <div className="trip-route">
        {trip.from} <i className="fas fa-arrow-right-long" /> {trip.to}
      </div>
    </div>
  );
}
