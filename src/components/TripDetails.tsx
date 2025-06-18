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
        <strong>Pickup Address:</strong> {trip.pickupAddress}
      </p>
      <p>
        <strong>Dropoff Address:</strong> {trip.dropoffAddress}
      </p>
      <p>
        <strong>Pickup:</strong> {trip.time}
      </p>
      <p>
        <strong>Date:</strong> {trip.date}
      </p>
      <p>
        <strong>In:</strong> {trip.inTime} &nbsp;&nbsp; <strong>Out:</strong> {trip.outTime}
      </p>
      <p>
        <strong>Miles:</strong> {trip.miles}
      </p>
      <p>
        <strong>Transport:</strong> {trip.transportType}
      </p>
      <p>
        <strong>Phone:</strong> {trip.phone}
      </p>
      <p>
        <strong>Medicaid #:</strong> {trip.medicaidNumber}
      </p>
      <p>
        <strong>Invoice #:</strong> {trip.invoiceNumber}
      </p>
      <p>
        <strong>Driver:</strong> {driver.name}
      </p>
      <p>
        <strong>Notes:</strong> {trip.notes}
      </p>
    </div>
  );
}
