export interface Driver {
  id: string;
  name: string;
  photo: string;
  vehicle: string;
}

export interface Trip {
  id: string;
  driverId: string;
  status:
    | 'en-route'
    | 'at-pickup'
    | 'at-dropoff'
    | 'in-transit'
    | 'cancel'
    | 'no_show'
    | 'complete'
    | 'pending';
  passenger: string;
  from: string;
  to: string;
  time: string;
}

export const MOCK_DRIVERS: Record<string, Omit<Driver, 'id'>> = {
  d1: { name: 'Elena Vance', photo: 'a', vehicle: 'Tesla Model Y (XL)' },
  d2: { name: 'Ben Carter', photo: 'b', vehicle: 'Ford Transit (WAV)' },
  d3: { name: 'Maya Singh', photo: 'c', vehicle: 'Toyota Camry' },
  d4: { name: 'David Chen', photo: 'd', vehicle: 'Chevy Suburban (XL)' },
};

function getDateKey(date: Date) {
  return date.toISOString().split('T')[0];
}

export const MOCK_SCHEDULE: Record<string, Trip[]> = {
  [getDateKey(new Date())]: [
    { id: 'zt-819', driverId: 'd1', status: 'en-route', passenger: 'Dr. Evelyn Reed', from: 'Grand Medical Center', to: "Oakwood Int'l Airport", time: '13:30' },
    { id: 'zt-820', driverId: 'd2', status: 'at-pickup', passenger: 'Marcus Thorne', from: '123 Market St', to: 'Westside Conference Hall', time: '14:00' },
    { id: 'zt-822', driverId: 'd4', status: 'in-transit', passenger: 'Dr. Evelyn Reed', from: "Oakwood Int'l Airport", to: 'The Landon Hotel', time: '18:00' },
  ],
  [getDateKey(new Date(Date.now() - 864e5))]: [
    { id: 'zt-755', driverId: 'd3', status: 'complete', passenger: 'Chloe Davis', from: 'Art Museum', to: 'The Landon Hotel', time: '15:00' },
  ],
};
