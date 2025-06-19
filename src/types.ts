export interface Driver {
  id: string;
  lat: number;
  lng: number;
  status: string;
}

export interface Trip {
  id: string;
  passengerName: string;
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
}
