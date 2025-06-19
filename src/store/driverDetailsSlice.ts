import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Driver, MOCK_DRIVERS } from '../mockData';

export type DriverDetailsState = Record<string, Omit<Driver, 'id'>>;

const initialState: DriverDetailsState = { ...MOCK_DRIVERS };

const driverDetailsSlice = createSlice({
  name: 'driverDetails',
  initialState,
  reducers: {
    setDriverDetails(_, action: PayloadAction<DriverDetailsState>) {
      return action.payload;
    },
    updateDriverDetail(state, action: PayloadAction<Driver>) {
      const { id, ...rest } = action.payload;
      state[id] = rest;
    },
  },
});

export const { setDriverDetails, updateDriverDetail } = driverDetailsSlice.actions;
export default driverDetailsSlice.reducer;
