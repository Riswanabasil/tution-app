import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAdmin, logoutAdmin } from '../../features/admin/services/AdminApi';
import { AxiosError } from 'axios';

interface AdminState {
  accessToken: string | null;
  loading: boolean;
  error: string | null;
   isAuthenticated: boolean;
}

const initialState: AdminState = {
  accessToken: localStorage.getItem('adminAccessToken'),
  loading: false,
  error: null,
  isAuthenticated: false
};

export const loginAdminThunk = createAsyncThunk(
  'admin/login',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await loginAdmin(email, password);
      localStorage.setItem('adminAccessToken', response.accessToken);
      return response.accessToken;
    } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(axiosError.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutAdminThunk = createAsyncThunk(
  "admin/logout",
  async (_, thunkAPI) => {
    try {
      await logoutAdmin();
      localStorage.removeItem("adminAccessToken");
    } catch (error:unknown) {
        const axiosError = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(axiosError.response?.data?.message
        ||"Logout failed");
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('adminAccessToken');
      state.accessToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdminThunk.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.accessToken = action.payload;
        state.loading = false;
      })
      .addCase(loginAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

       builder
    .addCase(logoutAdminThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(logoutAdminThunk.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.loading = false;
    })
    .addCase(logoutAdminThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer;
