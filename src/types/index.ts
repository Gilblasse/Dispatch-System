export interface Passenger {
  id: string;
  name: string;
  phone: string[];
  medicaid?: string;
  addresses: string[];
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  license: string;
  licenseExpiration: string;
}

export interface Vehicle {
  id: string;
  label: string;
}

export type TripStatus =
  | 'scheduled'
  | 'inroute'
  | 'waiting'
  | 'arrive'
  | 'in_transit'
  | 'complete'
  | 'cancel'
  | 'no_show';

export interface Trip {
  id: string;
  date: string;
  time: string;
  passengerId: string;
  driverId: string;
  pickup: string;
  dropoff: string;
  payer: 'Medicaid' | 'Private';
  vehicleId?: string;
  transport: 'Ambulatory' | 'Wheelchair' | 'Taxi' | 'Stretcher';
  phone: string;
  medicaid?: string;
  notes?: string;
  invoice: string;
  status: TripStatus;
}

