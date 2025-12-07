import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCourseUnits, Unit, UnitsResponse } from '../services/unitService';

interface UnitState {
  units: Unit[];
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: UnitState = {
  units: [],
  loading: false,
  error: null,
  total: 0,
};

export const fetchCourseUnits = createAsyncThunk(
  'unit/fetchCourseUnits',
  async (courseId: string) => {
    const result = await getCourseUnits(courseId);
    if (result) {
      return result;
    }
    throw new Error('Failed to fetch course units');
  }
);

const unitSlice = createSlice({
  name: 'unit',
  initialState,
  reducers: {
    clearUnits: (state) => {
      state.units = [];
      state.error = null;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseUnits.fulfilled, (state, action: PayloadAction<UnitsResponse>) => {
        state.loading = false;
        state.units = action.payload.result;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchCourseUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch course units';
      });
  },
});

export const { clearUnits } = unitSlice.actions;
export default unitSlice.reducer;