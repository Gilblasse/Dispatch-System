import React from 'react';
import { Trip, Driver } from '../mockData';

interface TripDetailsProps {
  trip: Trip;
  driver: Driver;
  onClose: () => void;
}

export default function TripDetails({ trip, driver, onClose }: TripDetailsProps) {
  return (
    <div className="trip-details">
      <div className="details-header">
        <h3>{trip.passenger}</h3>
        <button className="close-details-btn" onClick={onClose}>
          <i className="fas fa-xmark" />
        </button>
      </div>
      <p>
        <strong>Trip ID:</strong> {trip.id.toUpperCase()}
      </p>
      <p>
        <strong>From:</strong> {trip.from}
      </p>
      <p>
        <strong>To:</strong> {trip.to}
      </p>
      <p>
        <strong>Pickup:</strong> {trip.time}
      </p>
      <p>
        <strong>Driver:</strong> {driver.name}
      </p>
    </div>
  );
}
