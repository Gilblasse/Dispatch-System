import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trip } from '../types';

const initialState: Trip[] = [];

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
