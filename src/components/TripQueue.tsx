import React from 'react';
import { useSelector } from 'react-redux';
import { Trip, Driver } from '../mockData';
import { RootState } from '../store';
import { getDateKey } from '../utils/dateUtils';
import TripCard from './TripCard';
import TripDetails from './TripDetails';

type FilterType = 'none' | 'trip' | 'driver' | 'passenger';

interface TripQueueProps {
  selectedDate: Date;
  filterType: FilterType;
  filterId: string | null;
  detailedTrip: Trip | null;
  activeTripId: string | null;
  onSelectTrip: (tripId: string) => void;
  onPassengerFilter: (passenger: string) => void;
  onShowPassengerPage: (passenger: string) => void;
  onShowTripDetails: (trip: Trip) => void;
  onCloseTripDetails: () => void;
  onClearFilter: () => void;
}

export default function TripQueue({
  selectedDate,
  filterType,
  filterId,
  detailedTrip,
  activeTripId,
  onSelectTrip,
  onPassengerFilter,
  onShowPassengerPage,
  onShowTripDetails,
  onCloseTripDetails,
  onClearFilter,
}: TripQueueProps) {
  const drivers = useSelector((s: RootState) => s.driverDetails);
  const schedule = useSelector((s: RootState) => s.tripsDetails);
  const dateKey = getDateKey(selectedDate);
  let trips = schedule[dateKey] || [];

  if (filterType === 'trip') {
    trips = trips.filter(t => t.id === filterId);
  } else if (filterType === 'driver') {
    trips = trips.filter(t => t.driverId === filterId);
  } else if (filterType === 'passenger') {
    trips = trips.filter(t => t.passenger === filterId);
  }
  return (
    <aside className="trip-queue">
      <div className="panel-header" id="trip-panel-header">
        <h2>
          {filterType === 'none'
            ? 'Trip Manifest'
            : filterType === 'trip'
              ? `Trip for ${trips.find(t => t.id === filterId)?.passenger || filterId}`
              : filterType === 'driver'
                ? `Driver: ${drivers[filterId || '']?.name || filterId}`
                : `Passenger: ${filterId}`}
        </h2>
        {filterType !== 'none' && (
          <button className="clear-filter-btn" onClick={onClearFilter}>
            <i className="fas fa-xmark" /> Show All
          </button>
        )}
      </div>
      <div className="trip-list" id="trip-list-container">
        {detailedTrip && (
          <TripDetails
            trip={detailedTrip}
            driver={{ id: detailedTrip.driverId, ...drivers[detailedTrip.driverId] }}
            onClose={onCloseTripDetails}
          />
        )}
        {trips.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
            No trips found.
          </p>
        )}
        {trips
          .slice()
          .sort((a, b) => a.time.localeCompare(b.time))
          .map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              isActive={activeTripId === trip.id}
              onSelect={() => onSelectTrip(trip.id)}
              onPassengerFilter={() => onPassengerFilter(trip.passenger)}
              onShowPassengerPage={() => onShowPassengerPage(trip.passenger)}
              onShowDetails={() => onShowTripDetails(trip)}
            />
          ))}
      </div>
    </aside>
  );
}
