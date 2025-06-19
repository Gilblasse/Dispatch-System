import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trip } from '../types';
import { MOCK_TRIPS_MAP } from '../mockMapData';

const initialState: Trip[] = [...MOCK_TRIPS_MAP];

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
