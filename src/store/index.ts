import { configureStore } from '@reduxjs/toolkit';
import driversReducer from './driversSlice';
import tripsReducer from './tripsSlice';
import driverDetailsReducer from './driverDetailsSlice';
import tripsDetailsReducer from './tripsDetailsSlice';
import mapUiReducer from './mapUiSlice';

const store = configureStore({
  reducer: {
    drivers: driversReducer,
    trips: tripsReducer,
    driverDetails: driverDetailsReducer,
    tripsDetails: tripsDetailsReducer,
    mapUi: mapUiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
