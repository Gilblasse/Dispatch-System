import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Driver } from '../types';

const initialState: Driver[] = [
  { id: 'd1', lat: 40.7128, lng: -74.006, status: 'idle' },
  { id: 'd2', lat: 40.73, lng: -74.01, status: 'idle' },
];

const driversSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
    setDrivers(_, action: PayloadAction<Driver[]>) {
      return action.payload;
    },
    updateDriver(state, action: PayloadAction<Driver>) {
      const idx = state.findIndex(d => d.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
      else state.push(action.payload);
    },
  },
});

export const { setDrivers, updateDriver } = driversSlice.actions;
export default driversSlice.reducer;
