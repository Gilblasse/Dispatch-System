import React from 'react';
import { Driver } from '../mockData';
import { DriverStatus } from '../utils/driverUtils';

interface DriverCardProps {
  driver: Driver;
  status: DriverStatus;
  isActive: boolean;
  onSelect: () => void;
}

export default function DriverCard({ driver, status, isActive, onSelect }: DriverCardProps) {
  return (
    <div className={`driver-card ${isActive ? 'active' : ''}`} onClick={onSelect}>
      <div className="driver-profile">
        <img src={`https://i.pravatar.cc/80?u=${driver.photo}`} alt="Avatar" />
        <div className="driver-info">
          <h4>{driver.name}</h4>
          <span className="driver-vehicle-info">{driver.vehicle}</span>
        </div>
      </div>
      <div className="driver-status-container">
        <span className={`status-pill ${status.className}`}>{status.text}</span>
      </div>
    </div>
  );
}
