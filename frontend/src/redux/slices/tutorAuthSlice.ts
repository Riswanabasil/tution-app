import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import { loginTutor, logoutTutor, tutorGoogleLogin } from '../../features/tutor/services/TutorApi';

interface TutorAuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const LS_KEY = 'tutorAccessToken';
const saved = localStorage.getItem(LS_KEY);

const initialState: TutorAuthState = {
  accessToken: saved,
  isAuthenticated: !!saved,
  loading: false,
  error: null,
};

export const loginTutorThunk = createAsyncThunk<
  string,
  { email: string; password: string },
  { rejectValue: string }
>('tutor/login', async (payload, thunkAPI) => {
  try {
    const res = await loginTutor(payload);
    localStorage.setItem(LS_KEY, res.accessToken);
    return res.accessToken;
  } catch (err) {
    const e = err as AxiosError<{ message?: string }>;
    const msg = e.response?.data?.message || 'Login failed';
    return thunkAPI.rejectWithValue(msg);
  }
});

export const googleLoginTutorThunk = createAsyncThunk(
  'tutor/googleLogin',
  async (idToken: string, { rejectWithValue }) => {
    try {
      const res = await tutorGoogleLogin(idToken);
      localStorage.setItem('tutorAccessToken', res.accessToken);
      return res; 
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>;
      return rejectWithValue(e.response?.data?.message || 'Google login failed');
    }
  }
);

export const logoutTutorThunk = createAsyncThunk('tutor/logout', async (_, thunkAPI) => {
  try {
    await logoutTutor();
    localStorage.removeItem(LS_KEY);
    return;
  } catch (err) {
    const e = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Logout failed');
  }
});

const tutorAuthSlice = createSlice({
  name: 'tutorAuth',
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
    b.addCase(loginTutorThunk.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(loginTutorThunk.fulfilled, (s, a) => {
      s.loading = false;
      s.isAuthenticated = true;
      s.accessToken = a.payload;
    });
    b.addCase(loginTutorThunk.rejected, (s, a) => {
      s.loading = false;
      s.error = (a.payload as string) ?? 'Login failed';
    });

    b.addCase(logoutTutorThunk.fulfilled, (s) => {
      s.isAuthenticated = false;
      s.accessToken = null;
      s.loading = false;
    });
    b.addCase(logoutTutorThunk.rejected, (s, a) => {
      s.loading = false;
      s.error = (a.payload as string) ?? 'Logout failed';
    });
  },
});

export const { hardLogout } = tutorAuthSlice.actions;
export default tutorAuthSlice.reducer;
