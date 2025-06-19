import React, { useState } from 'react';
import { Trip } from '../types';
import Tooltip from './Tooltip';

interface Props {
  trip: Trip;
  position: { pickup: { x: number; y: number }; dropoff: { x: number; y: number } };
}

export default function TripPin({ trip, position }: Props) {
  const [hover, setHover] = useState<'pickup' | 'dropoff' | null>(null);

  return (
    <>
      <div
        className="map-pin map-pickup-pin"
        style={{ left: position.pickup.x, top: position.pickup.y }}
        onMouseEnter={() => setHover('pickup')}
        onMouseLeave={() => setHover(null)}
      >
        P
        {hover === 'pickup' && (
          <Tooltip>{`${trip.passengerName}\n${trip.pickup.lat.toFixed(5)}, ${trip.pickup.lng.toFixed(5)}`}</Tooltip>
        )}
      </div>
      <div
        className="map-pin map-dropoff-pin"
        style={{ left: position.dropoff.x, top: position.dropoff.y }}
        onMouseEnter={() => setHover('dropoff')}
        onMouseLeave={() => setHover(null)}
      >
        D
        {hover === 'dropoff' && (
          <Tooltip>{`${trip.passengerName}\n${trip.dropoff.lat.toFixed(5)}, ${trip.dropoff.lng.toFixed(5)}`}</Tooltip>
        )}
      </div>
    </>
  );
}
