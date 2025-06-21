import React from 'react';
import { Trip } from '../mockData';
import TripHistoryItem from './TripHistoryItem';
import styles from './PassengerPage.module.css';

interface TripHistoryListProps {
  trips: Trip[];
  activeTripId: string | null;
  onSelectTrip: (id: string) => void;
}

export default function TripHistoryList({ trips, activeTripId, onSelectTrip }: TripHistoryListProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className={styles.tripHistoryList}>
      <h5>Trip History</h5>
      {trips.map(trip => {
        const isPast = new Date(trip.date) < today;
        const isActive = trip.id === activeTripId;
        return (
          <TripHistoryItem
            key={trip.id}
            trip={trip}
            isActive={isActive}
            isPast={isPast}
            onSelect={onSelectTrip}
          />
        );
      })}
    </div>
  );
}
