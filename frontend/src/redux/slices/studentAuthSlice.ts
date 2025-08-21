import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { studentLogin, studentGoogleLogin,logoutStudent } from "../../features/student/services/StudentApi";

interface RoleAuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const LS_KEY = "accessToken";
const saved = localStorage.getItem(LS_KEY);

const initialState: RoleAuthState = {
  accessToken: saved,
  isAuthenticated: !!saved,
  loading: false,
  error: null,
};

export const loginStudentThunk = createAsyncThunk(
  "student/login",
  async (payload: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await studentLogin(payload);      
      localStorage.setItem(LS_KEY, res.accessToken);
      return res.accessToken;
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(e.response?.data?.message || "Login failed");
    }
  }
);

export const googleLoginStudentThunk = createAsyncThunk(
  "student/googleLogin",
  async (idToken: string, thunkAPI) => {
    try {
      const res = await studentGoogleLogin(idToken);  
      localStorage.setItem(LS_KEY, res.accessToken);
      return res.accessToken;
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(e.response?.data?.message || "Google login failed");
    }
  }
);

export const logoutStudentThunk = createAsyncThunk(
  "student/logout",
  async (_, thunkAPI) => {
    try {
      await logoutStudent()
      localStorage.removeItem(LS_KEY);
      return;
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(e.response?.data?.message || "Logout failed");
    }
  }
);

const studentAuthSlice = createSlice({
  name: "studentAuth",
  initialState,
  reducers: {
    hardLogout(state) {
      localStorage.removeItem(LS_KEY);
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(loginStudentThunk.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(loginStudentThunk.fulfilled, (s, a) => {
      s.loading = false; s.isAuthenticated = true; s.accessToken = a.payload;
    });
    b.addCase(loginStudentThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });

    b.addCase(googleLoginStudentThunk.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(googleLoginStudentThunk.fulfilled, (s, a) => {
      s.loading = false; s.isAuthenticated = true; s.accessToken = a.payload;
    });
    b.addCase(googleLoginStudentThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });

    b.addCase(logoutStudentThunk.fulfilled, (s) => {
      s.isAuthenticated = false; s.accessToken = null; s.loading = false;
    });
    b.addCase(logoutStudentThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
  },
});

export const { hardLogout } = studentAuthSlice.actions;
export default studentAuthSlice.reducer;
