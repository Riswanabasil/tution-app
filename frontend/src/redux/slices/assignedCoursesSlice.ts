import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAssignedCourses } from "../../features/tutor/services/TutorApi";
import type { ICourse } from "../../types/course";
import { AxiosError } from "axios";

interface AssignedCoursesState {
  courses: ICourse[];
  loading: boolean;
  error: string | null;
}

const initialState: AssignedCoursesState = {
  courses: [],
  loading: false,
  error: null,
};

export const fetchAssignedCourses = createAsyncThunk(
  "tutor/fetchAssignedCourses",
  async (_, { rejectWithValue }) => {
    try {

         const res = await getAssignedCourses()
      console.log("API RESPONSE", res); 
      return res;
      return await getAssignedCourses();
    } catch (error: unknown) {
        console.log("API ERROR", error)
        const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch courses");
    }
  }
);

const assignedCoursesSlice = createSlice({
  name: "assignedCourses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignedCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchAssignedCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default assignedCoursesSlice.reducer;
