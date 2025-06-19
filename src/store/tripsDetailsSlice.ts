import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trip, MOCK_SCHEDULE } from '../mockData';

export type TripsScheduleState = Record<string, Trip[]>;

const initialState: TripsScheduleState = { ...MOCK_SCHEDULE };

const tripsDetailsSlice = createSlice({
  name: 'tripsDetails',
  initialState,
  reducers: {
    setTripsSchedule(_, action: PayloadAction<TripsScheduleState>) {
      return action.payload;
    },
    updateTrip(state, action: PayloadAction<Trip>) {
      const { date } = action.payload;
      const list = state[date] || [];
      const idx = list.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) list[idx] = action.payload;
      else list.push(action.payload);
      state[date] = list;
    },
  },
});

export const { setTripsSchedule, updateTrip } = tripsDetailsSlice.actions;
export default tripsDetailsSlice.reducer;
