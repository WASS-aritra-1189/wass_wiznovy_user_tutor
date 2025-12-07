import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getWalkthrough } from '../services/profileService';

interface WalkthroughItem {
  id: string;
  title: string | null;
  subtitle: string;
  image: string | null;
  imagePath: string | null;
}

interface WalkthroughState {
  slides: WalkthroughItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WalkthroughState = {
  slides: [],
  loading: false,
  error: null,
};

export const fetchWalkthrough = createAsyncThunk(
  'walkthrough/fetchWalkthrough',
  async () => {
    const result = await getWalkthrough();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message);
  }
);

const walkthroughSlice = createSlice({
  name: 'walkthrough',
  initialState,
  reducers: {
    clearWalkthrough: (state) => {
      state.slides = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalkthrough.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalkthrough.fulfilled, (state, action: PayloadAction<WalkthroughItem[]>) => {
        state.loading = false;
        state.slides = action.payload;
        state.error = null;
      })
      .addCase(fetchWalkthrough.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch walkthrough';
      });
  },
});

export const { clearWalkthrough } = walkthroughSlice.actions;
export default walkthroughSlice.reducer;