import React, { useEffect, useState } from 'react';
import { Driver } from '../types';
import Tooltip from './Tooltip';
import { useDispatch } from 'react-redux';
import { updateDriver } from '../store/driversSlice';

interface Props {
  driver: Driver;
  position: { x: number; y: number };
}

export default function DriverIcon({ driver, position }: Props) {
  const dispatch = useDispatch();
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const deltaLng = (Math.random() - 0.5) * 0.001;
      const deltaLat = (Math.random() - 0.5) * 0.001;
      dispatch(
        updateDriver({ ...driver, lng: driver.lng + deltaLng, lat: driver.lat + deltaLat })
      );
    }, 3000);
    return () => clearInterval(id);
  }, [dispatch, driver]);

  const style = { left: position.x, top: position.y } as React.CSSProperties;

  return (
    <div
      className="map-driver"
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="icon-body" />
      {hover && (
        <Tooltip>{`ID: ${driver.id}\n${driver.lat.toFixed(5)}, ${driver.lng.toFixed(5)}`}</Tooltip>
      )}
    </div>
  );
}
