import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserProfile } from '../services/profileService';

interface UserProfile {
  id?: string;
  email?: string;
  roles?: string;
  status?: string;
  userDetail?: {
    id?: string;
    name?: string;
    gender?: string;
    profile?: string;
  };
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async () => {
    console.log('Fetching user profile...');
    const result = await getUserProfile();
    console.log('Profile API response:', result);
    if (result.success && result.data) {
      console.log('Profile data:', result.data);
      return result.data;
    }
    throw new Error(result.message);
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.profile = null;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload,
          userDetail: {
            ...state.profile.userDetail,
            ...action.payload.userDetail,
          },
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      });
  },
});

export const { clearUser, updateProfile } = userSlice.actions;
export default userSlice.reducer;