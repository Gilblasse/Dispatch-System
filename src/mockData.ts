export interface Driver {
  id: string;
  name: string;
  photo: string;
  vehicle: string;
}

export type TripStatus =
  | 'en-route'
  | 'at-pickup'
  | 'in-transit'
  | 'at-dropoff'
  | 'complete'
  | 'cancel'
  | 'no_show'
  | 'waiting'
  | 're-assigned'
  | 'not-confirmed'
  | 'pending';

export interface Trip {
  id: string;
  driverId: string;
  status: TripStatus;
  passenger: string;
  from: string;
  to: string;
  time: string;
  date: string;
  inTime: string;
  outTime: string;
  miles: number;
  transportType: string;
  phone: string;
  medicaidNumber: string;
  invoiceNumber: string;
  pickupAddress: string;
  dropoffAddress: string;
  notes: string;
  lat: number;
  lng: number;
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
    {
      id: 'zt-819',
      driverId: 'd1',
      status: 'en-route',
      passenger: 'Dr. Evelyn Reed',
      from: 'Grand Medical Center',
      to: "Oakwood Int'l Airport",
      time: '13:30',
      date: getDateKey(new Date()),
      inTime: '13:15',
      outTime: '13:45',
      miles: 25,
      transportType: 'Ambulatory',
      phone: '555-1010',
      medicaidNumber: 'MC-001',
      invoiceNumber: 'INV-819',
      pickupAddress: '123 Health Way',
      dropoffAddress: '1 Airport Rd',
      notes: 'Needs assistance with luggage',
      lat: 32,
      lng: 20,
    },
    {
      id: 'zt-820',
      driverId: 'd2',
      status: 'at-pickup',
      passenger: 'Marcus Thorne',
      from: '123 Market St',
      to: 'Westside Conference Hall',
      time: '14:00',
      date: getDateKey(new Date()),
      inTime: '13:50',
      outTime: '14:20',
      miles: 10,
      transportType: 'Wheelchair',
      phone: '555-2020',
      medicaidNumber: 'MC-002',
      invoiceNumber: 'INV-820',
      pickupAddress: '123 Market St',
      dropoffAddress: '456 Conference Rd',
      notes: 'Wheelchair accessible vehicle required',
      lat: 45,
      lng: 70,
    },
    {
      id: 'zt-822',
      driverId: 'd4',
      status: 'in-transit',
      passenger: 'Dr. Evelyn Reed',
      from: "Oakwood Int'l Airport",
      to: 'The Landon Hotel',
      time: '18:00',
      date: getDateKey(new Date()),
      inTime: '17:45',
      outTime: '18:30',
      miles: 8,
      transportType: 'Ambulatory',
      phone: '555-1010',
      medicaidNumber: 'MC-001',
      invoiceNumber: 'INV-822',
      pickupAddress: '1 Airport Rd',
      dropoffAddress: '500 Hotel Ave',
      notes: 'Return trip',
      lat: 60,
      lng: 40,
    },
  ],
  [getDateKey(new Date(Date.now() - 864e5))]: [
    {
      id: 'zt-755',
      driverId: 'd3',
      status: 'complete',
      passenger: 'Chloe Davis',
      from: 'Art Museum',
      to: 'The Landon Hotel',
      time: '15:00',
      date: getDateKey(new Date(Date.now() - 864e5)),
      inTime: '14:45',
      outTime: '15:30',
      miles: 5,
      transportType: 'Ambulatory',
      phone: '555-3030',
      medicaidNumber: 'MC-003',
      invoiceNumber: 'INV-755',
      pickupAddress: '200 Art Way',
      dropoffAddress: '500 Hotel Ave',
      notes: 'Patient enjoyed museum visit',
      lat: 80,
      lng: 55,
    },
  ],
};
