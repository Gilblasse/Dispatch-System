import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MapUiState {
  zoom: number;
  center: [number, number];
  selectedDriverId: string | null;
  isDarkMode: boolean;
}

const initialState: MapUiState = {
  zoom: 12,
  center: [-74.006, 40.7128],
  selectedDriverId: null,
  isDarkMode: typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches,
};

const mapUiSlice = createSlice({
  name: 'mapUi',
  initialState,
  reducers: {
    setZoom(state, action: PayloadAction<number>) {
      state.zoom = action.payload;
    },
    setCenter(state, action: PayloadAction<[number, number]>) {
      state.center = action.payload;
    },
    setSelectedDriverId(state, action: PayloadAction<string | null>) {
      state.selectedDriverId = action.payload;
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.isDarkMode = action.payload;
    },
  },
});

export const { setZoom, setCenter, setSelectedDriverId, setDarkMode } = mapUiSlice.actions;
export default mapUiSlice.reducer;
