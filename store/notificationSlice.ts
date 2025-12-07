import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getNotifications, Notification } from '../services/notificationService';

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  currentOffset: number;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  loadingMore: false,
  error: null,
  total: 0,
  hasMore: true,
  currentOffset: 0,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params: { limit?: number; offset?: number; loadMore?: boolean } = {}, { rejectWithValue }) => {
    try {
      const { limit = 15, offset = 0, loadMore = false } = params;
      const response = await getNotifications(limit, offset);
      if (response.success) {
        return {
          notifications: response.result || [],
          total: response.total || 0,
          loadMore,
          offset,
          limit,
        };
      } else {
        return rejectWithValue(response.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetNotifications: (state) => {
      state.notifications = [];
      state.currentOffset = 0;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state, action) => {
        const isLoadMore = action.meta.arg?.loadMore;
        if (isLoadMore) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        
        if (action.payload.loadMore) {
          // Append new notifications for load more
          state.notifications = [...state.notifications, ...action.payload.notifications];
        } else {
          // Replace notifications for initial load
          state.notifications = action.payload.notifications;
        }
        
        state.total = action.payload.total;
        state.currentOffset = action.payload.offset + action.payload.limit;
        state.hasMore = state.notifications.length < state.total;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;