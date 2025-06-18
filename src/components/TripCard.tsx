import React from 'react';
import { Trip } from '../mockData';

interface TripCardProps {
  trip: Trip;
  isActive: boolean;
  onSelect: () => void;
  onPassengerFilter: () => void;
  onShowDetails: () => void;
}

export default function TripCard({
  trip,
  isActive,
  onSelect,
  onPassengerFilter,
  onShowDetails,
}: TripCardProps) {
  return (
    <div
      className={`trip-card ${isActive ? 'active' : ''}`}
      data-status={trip.status}
      onClick={onSelect}
      onDoubleClick={onPassengerFilter}
    >
      <div className="trip-header">
        <h3
          onClick={e => {
            e.stopPropagation();
            onPassengerFilter();
          }}
          onDoubleClick={e => {
            e.stopPropagation();
            onShowDetails();
          }}
        >
          {trip.passenger}
        </h3>
      </div>
      <div className="trip-locations">
        <p className="trip-route">
          <span>{trip.from}</span>
          <span className="trip-arrow">&nbsp;&rarr;&nbsp;</span>
          <span>{trip.to}</span>
        </p>
      </div>
      <div className="trip-footer">
        <span>
          <i className="fas fa-clock"></i> Pickup at {trip.time}
        </span>
      </div>
    </div>
  );
}
