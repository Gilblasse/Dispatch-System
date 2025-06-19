import React, { ReactNode } from 'react';
import './MapStyles.css';

export default function Tooltip({ children }: { children: ReactNode }) {
  return <div className="map-tooltip">{children}</div>;
}
