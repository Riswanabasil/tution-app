import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import adminAxios from "../../api/AxiosAdmin";
import { toast } from 'react-toastify';

export interface Course {
  _id: string;
  title: string;
  code: string;
  semester: number;
  thumbnail?: string;
  price: number;
  offer?: number;
  actualPrice?: number;
  details?: string;
}

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
};


export const fetchCoursesThunk = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAxios.get('admin/courses');
      return response.data.courses as Course[];
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || 'Failed to fetch courses');
    }
  }
);

// 
export const createCourseThunk = createAsyncThunk(
  'courses/createCourse',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await adminAxios.post('admin/course', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.course as Course;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || 'Failed to create course');
    }
  }
);

// export const updateCourseThunk = createAsyncThunk(
//   'courses/updateCourse',
//   async ({ id, data }: { id: string; data: Partial<Course> }, { rejectWithValue }) => {
//     try {
//       const response = await adminAxios.put(`/course/${id}`, data);
//       return response.data.updated as Course;
//     } catch (err) {
//       const error = err as AxiosError;
//       return rejectWithValue(error.response?.data || 'Failed to update course');
//     }
//   }
// );

export const updateCourseThunk = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await adminAxios.put(`admin/course/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.updated as Course;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || 'Failed to update course');
    }
  }
);


export const deleteCourseThunk = createAsyncThunk(
  'courses/deleteCourse',
  async (id: string, { rejectWithValue }) => {
    try {
      await adminAxios.delete(`admin/course/${id}`);
      toast.success('Course deleted successfully')
      return id;
    } catch (err) {
      const error = err as AxiosError;
      toast.error('Failed to delete course')
      return rejectWithValue(error.response?.data || 'Failed to delete course');
    }
  }
);


const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchCoursesThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCoursesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    });
    builder.addCase(fetchCoursesThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createCourseThunk.fulfilled, (state, action) => {
      state.courses.unshift(action.payload);
    });

    // Update
    builder.addCase(updateCourseThunk.fulfilled, (state, action) => {
      const index = state.courses.findIndex(c => c._id === action.payload._id);
      if (index !== -1) state.courses[index] = action.payload;
    });

    // Delete
    builder.addCase(deleteCourseThunk.fulfilled, (state, action) => {
      state.courses = state.courses.filter(c => c._id !== action.payload);
    });
  },
});

export default courseSlice.reducer;
