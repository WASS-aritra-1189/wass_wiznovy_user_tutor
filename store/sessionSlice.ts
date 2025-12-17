import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserSessions, cancelSession, UserSession, CancelSessionResponse } from '../services/sessionService';

interface SessionState {
  sessions: UserSession[];
  loading: boolean;
  error: string | null;
  total: number;
  cancelLoading: string | null;
  cancelResponse: CancelSessionResponse | null;
}

const initialState: SessionState = {
  sessions: [],
  loading: false,
  error: null,
  total: 0,
  cancelLoading: null,
  cancelResponse: null,
};

export const fetchUserSessions = createAsyncThunk(
  'sessions/fetchUserSessions',
  async (params: { limit?: number; offset?: number; date?: string }, { rejectWithValue }) => {
    try {
      const { limit = 20, offset = 0, date } = params;
      const response = await getUserSessions(limit, offset, date);
      if (response) {
        return response;
      } else {
        return rejectWithValue('Failed to fetch sessions');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const cancelUserSession = createAsyncThunk(
  'sessions/cancelUserSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await cancelSession(sessionId);
      if (response) {
        return { sessionId, response };
      } else {
        return rejectWithValue('Failed to cancel session');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSessions: (state) => {
      state.sessions = [];
      state.total = 0;
    },
    clearCancelResponse: (state) => {
      state.cancelResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sessions
      .addCase(fetchUserSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload.result;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchUserSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel session
      .addCase(cancelUserSession.pending, (state, action) => {
        state.cancelLoading = action.meta.arg;
        state.error = null;
      })
      .addCase(cancelUserSession.fulfilled, (state, action) => {
        state.cancelLoading = null;
        state.cancelResponse = action.payload.response;
        // Update the session with the response data
        const sessionIndex = state.sessions.findIndex(s => s.id === action.payload.sessionId);
        if (sessionIndex !== -1) {
          state.sessions[sessionIndex] = action.payload.response.session;
        }
      })
      .addCase(cancelUserSession.rejected, (state, action) => {
        state.cancelLoading = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSessions, clearCancelResponse } = sessionSlice.actions;
export default sessionSlice.reducer;