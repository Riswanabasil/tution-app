import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import { loginTutor, logoutTutor, tutorGoogleLogin } from '../../features/tutor/services/TutorApi';

interface TutorProfile {
  id: string;
  name: string;
  email: string;
  role: 'tutor';
}
interface TutorAuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  profile: TutorProfile | null; 
}

export interface TutorLoginResp {
  accessToken: string;
  tutor: { id: string; name: string; email: string; role: 'tutor' };
}


const LS_KEY = 'tutorAccessToken';
const saved = localStorage.getItem(LS_KEY);

const initialState: TutorAuthState = {
  accessToken: saved,
  isAuthenticated: !!saved,
  loading: false,
  error: null,
  profile: null,
};


export const loginTutorThunk = createAsyncThunk<
  { accessToken: string; profile: TutorLoginResp['tutor'] }, // thunk return type
  { email: string; password: string },
  { rejectValue: string }
>('tutor/login', async (payload, { rejectWithValue }) => {
  try {
    const res: TutorLoginResp = await loginTutor(payload);  // you can keep API as-is
    localStorage.setItem(LS_KEY, res.accessToken);
    localStorage.setItem('tutorProfile', JSON.stringify(res.tutor));
    return { accessToken: res.accessToken, profile: res.tutor };
  } catch (err) {
    const e = err as AxiosError<{ message?: string }>;
    return rejectWithValue(e.response?.data?.message || 'Login failed');
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
  },
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
      s.accessToken = a.payload.accessToken;
       s.profile = a.payload.profile;
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
