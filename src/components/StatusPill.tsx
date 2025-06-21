import React from 'react';
import { TripStatus } from '../mockData';
import { getTripStatusInfo } from '../utils/tripStatusUtils';

interface StatusPillProps {
  status: TripStatus;
}

export default function StatusPill({ status }: StatusPillProps) {
  const info = getTripStatusInfo(status);
  return <span className={`status-pill ${info.className}`}>{info.text}</span>;
}
