import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trip } from '../types';

const initialState: Trip[] = [
  {
    id: 't1',
    passengerName: 'Alice',
    pickup: { lat: 40.7127, lng: -74.0059 },
    dropoff: { lat: 40.721, lng: -74.01 },
  },
];

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTrips(_, action: PayloadAction<Trip[]>) {
      return action.payload;
    },
  },
});

export const { setTrips } = tripsSlice.actions;
export default tripsSlice.reducer;
