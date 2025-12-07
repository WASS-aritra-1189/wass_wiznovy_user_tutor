import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllSubjects } from '../services/searchService';

interface Subject {
  id: string;
  name: string;
  image?: string;
}

interface SubjectState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
}

const initialState: SubjectState = {
  subjects: [],
  loading: false,
  error: null,
};

export const fetchSubjects = createAsyncThunk(
  'subject/fetchSubjects',
  async () => {
    const result = await getAllSubjects();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message);
  }
);

const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    clearSubjects: (state) => {
      state.subjects = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action: PayloadAction<Subject[]>) => {
        state.loading = false;
        state.subjects = action.payload;
        state.error = null;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subjects';
      });
  },
});

export const { clearSubjects } = subjectSlice.actions;
export default subjectSlice.reducer;