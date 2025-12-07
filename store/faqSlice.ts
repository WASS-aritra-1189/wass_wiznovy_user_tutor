import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserFAQs, FAQ, FAQResponse } from '../services/faqService';

interface FAQState {
  faqs: FAQ[];
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: FAQState = {
  faqs: [],
  loading: false,
  error: null,
  total: 0,
};

export const fetchFAQs = createAsyncThunk(
  'faq/fetchFAQs',
  async () => {
    const result = await getUserFAQs();
    if (result) {
      return result;
    }
    throw new Error('Failed to fetch FAQs');
  }
);

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    clearFAQs: (state) => {
      state.faqs = [];
      state.error = null;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFAQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFAQs.fulfilled, (state, action: PayloadAction<FAQResponse>) => {
        state.loading = false;
        state.faqs = action.payload.result;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchFAQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch FAQs';
      });
  },
});

export const { clearFAQs } = faqSlice.actions;
export default faqSlice.reducer;