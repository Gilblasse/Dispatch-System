import React, { useEffect, useMemo, useState } from 'react';
import { Trip, MOCK_SCHEDULE } from '../mockData';
import PassengerInfoPanel, { PassengerDetails } from './PassengerInfoPanel';
import TripHistoryList from './TripHistoryList';
import styles from './PassengerPage.module.css';

interface PassengerPageProps {
  passenger: string;
  onBack: () => void;
}

function flattenSchedule(schedule: Record<string, Trip[]>): Trip[] {
  return Object.entries(schedule).flatMap(([date, trips]) =>
    trips.map(t => ({ ...t, date }))
  );
}

export default function PassengerPage({ passenger, onBack }: PassengerPageProps) {
  const allTrips = useMemo(() => flattenSchedule(MOCK_SCHEDULE), []);
  const passengerTrips = useMemo(
    () =>
      allTrips
        .filter(t => t.passenger === passenger)
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime() ||
            b.time.localeCompare(a.time)
        ),
    [allTrips, passenger]
  );

  const [activeTripId, setActiveTripId] = useState<string | null>(null);

  useEffect(() => {
    if (passengerTrips.length > 0 && !activeTripId) {
      setActiveTripId(passengerTrips[0].id);
    }
  }, [passengerTrips, activeTripId]);

  if (passengerTrips.length === 0) {
    return null;
  }

  const activeTrip = passengerTrips.find(t => t.id === activeTripId) || passengerTrips[0];

  const details: PassengerDetails = {
    phone: activeTrip.phone,
    medicaidId: activeTrip.medicaidNumber,
    invoice: activeTrip.invoiceNumber,
    notes: activeTrip.notes,
  };

  return (
    <div className={styles.passengerPageView}>
      <div className="panel-header">
        <h2>{passenger}</h2>
        <button className={styles.panelHeaderBtn} onClick={onBack} id="back-to-manifest-btn">
          <i className="fas fa-arrow-left" />Back to Manifest
        </button>
      </div>
      <PassengerInfoPanel details={details} />
      <TripHistoryList trips={passengerTrips} activeTripId={activeTripId} onSelectTrip={setActiveTripId} />
    </div>
  );
}
