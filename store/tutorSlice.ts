import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllTutors } from '../services/searchService';

interface Tutor {
  id: string;
  name: string;
  profileImage?: string;
  subject?: {
    name: string;
  };
  hourlyRate: number;
  averageRating: string;
  account?: {
    id: string;
  };
}

interface TutorState {
  tutors: Tutor[];
  loading: boolean;
  error: string | null;
}

const initialState: TutorState = {
  tutors: [],
  loading: false,
  error: null,
};

export const fetchTutors = createAsyncThunk(
  'tutor/fetchTutors',
  async () => {
    const result = await getAllTutors();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message);
  }
);

const tutorSlice = createSlice({
  name: 'tutor',
  initialState,
  reducers: {
    clearTutors: (state) => {
      state.tutors = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTutors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTutors.fulfilled, (state, action: PayloadAction<Tutor[]>) => {
        state.loading = false;
        state.tutors = action.payload;
        state.error = null;
      })
      .addCase(fetchTutors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tutors';
      });
  },
});

export const { clearTutors } = tutorSlice.actions;
export default tutorSlice.reducer;