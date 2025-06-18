import React from 'react';
import { Trip, Driver } from '../mockData';

interface MapContainerProps {
  drivers: Record<string, Omit<Driver, 'id'>>;
  trips: Trip[];
}

export default function MapContainer({ drivers, trips }: MapContainerProps) {
  return (
    <main className="map-container" id="map-container">
      {Object.entries(drivers).map(([id, d]) => {
        const activeTrip = trips.find(
          t => t.driverId === id && t.status !== 'pending' && t.status !== 'complete'
        );
        if (!activeTrip) return null;
        return (
          <div
            key={id}
            className="map-icon map-driver"
            data-status={activeTrip.status}
            style={{ top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%` }}
          >
            <div className="icon-body"></div>
          </div>
        );
      })}
    </main>
  );
}
