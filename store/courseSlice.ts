import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllCourses, getPaginatedCourses } from '../services/searchService';
import { getCourseDetails, CourseDetail } from '../services/courseService';

interface Course {
  id: string;
  name: string;
  imageUrl?: string;
  totalLectures: number;
  totalDuration: string;
  price: number;
  discountPrice?: number;
  averageRating: string;
  description?: string;
  subject?: { name: string };
}

interface CourseState {
  courses: Course[];
  courseDetails: CourseDetail | null;
  loading: boolean;
  detailsLoading: boolean;
  error: string | null;
  detailsError: string | null;
}

const initialState: CourseState = {
  courses: [],
  courseDetails: null,
  loading: false,
  detailsLoading: false,
  error: null,
  detailsError: null,
};

export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async () => {
    const result = await getAllCourses();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message);
  }
);

export const fetchPaginatedCourses = createAsyncThunk(
  'course/fetchPaginatedCourses',
  async ({ limit, offset }: { limit: number; offset: number }) => {
    const result = await getPaginatedCourses(limit, offset);
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message);
  }
);

export const fetchCourseDetails = createAsyncThunk(
  'course/fetchCourseDetails',
  async (courseId: string) => {
    const result = await getCourseDetails(courseId);
    if (result) {
      return result;
    }
    throw new Error('Failed to fetch course details');
  }
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    clearCourses: (state) => {
      state.courses = [];
      state.error = null;
    },
    clearCourseDetails: (state) => {
      state.courseDetails = null;
      state.detailsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false;
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      })
      .addCase(fetchPaginatedCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaginatedCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false;
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchPaginatedCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch paginated courses';
      })
      .addCase(fetchCourseDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action: PayloadAction<CourseDetail>) => {
        state.detailsLoading = false;
        state.courseDetails = action.payload;
        state.detailsError = null;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.error.message || 'Failed to fetch course details';
      });
  },
});

export const { clearCourses, clearCourseDetails } = courseSlice.actions;
export default courseSlice.reducer;