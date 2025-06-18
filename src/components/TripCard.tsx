import React from 'react';
import { Trip } from '../mockData';

function getTransportIcon(type: string): string {
  switch (type.toLowerCase()) {
    case 'ambulatory':
      return 'fa-person-walking';
    case 'wheelchair':
      return 'fa-wheelchair';
    case 'stretcher':
      return 'fa-bed';
    default:
      return 'fa-car';
  }
}

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
      {isActive && trip.time && (
        <div className="trip-footer">
          <span>
            <i className="fas fa-clock"></i> Pickup at {trip.time}
          </span>
          <span
            className="transport-type-icon"
            aria-label={trip.transportType}
          >
            <i className={`fas ${getTransportIcon(trip.transportType)}`}></i>
          </span>
        </div>
      )}
    </div>
  );
}
