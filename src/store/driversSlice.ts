import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Driver } from '../types';
import { MOCK_DRIVERS_MAP } from '../mockMapData';

const initialState: Driver[] = [...MOCK_DRIVERS_MAP];

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
