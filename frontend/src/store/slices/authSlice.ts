import axios from 'axios';
import axiosPublicInstance from '@app/api/axiosPublicInstance';
import axiosInstance from '@app/api/axiosInstance';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { fetchUserProfile } from '@app/store/slices/userSlice';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  expiresAt: number | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('access'),
  refreshToken: localStorage.getItem('refresh'),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('access'),
  expiresAt: null,
};

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  avatar?: File | null;
  username: string;
  sex: string;
  birth_date: string;
  phone_number?: string;
  country?: string;
  city?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
  group: string;
  status: string;
  about_me?: string;
}

export const doLogin = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { dispatch }) => {
    try {
      const response = await axiosInstance.post('user/token/', credentials);
      const { access, refresh } = response.data;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      await dispatch(fetchUserProfile());

      return { access, refresh };
    } catch (error) {
      throw error;
    }
  },
);

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await axiosInstance.post('user/token/refresh/', { refresh: refreshToken });
    const { access } = response.data;
    localStorage.setItem('access', access);

    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

    return access;
  } catch (error) {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return rejectWithValue('Failed to refresh token');
  }
});

export const doLogout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');

    delete axiosInstance.defaults.headers.common['Authorization'];

    dispatch(clearAuthState());

    return;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
});

export const doSignUp = createAsyncThunk('auth/register', async (registrationData: FormData, { rejectWithValue }) => {
  try {
    const registerResponse = await axiosPublicInstance.post('/user/register/', registrationData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { data } = await axiosPublicInstance.post('/user/token/', {
      email: registrationData.get('email'),
      password: registrationData.get('password'),
    });

    const { access, refresh } = data;
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);

    const { exp } = jwtDecode<{ exp: number }>(access);

    return { access, refresh, expiresAt: exp };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

export const checkAuthStatus = createAsyncThunk('auth/checkStatus', async (_, { dispatch }) => {
  const accessToken = localStorage.getItem('access');
  if (accessToken) {
    try {
      const { exp } = jwtDecode<{ exp: number }>(accessToken);

      if (Date.now() >= exp * 1000) {
        return await dispatch(refreshToken()).unwrap();
      } else {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        const userProfile = await dispatch(fetchUserProfile()).unwrap();

        if (userProfile && userProfile.id) {
          return { access: accessToken };
        } else {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          throw new Error('User not found. Please register.');
        }
      }
    } catch (error) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      throw error;
    }
  }
  throw new Error('Access token not found');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.expiresAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(doLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(doLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthenticated = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = 'Token refresh failed';
      })
      .addCase(doLogout.fulfilled, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(doLogout.rejected, (state, action) => {
        state.error = action.error.message || 'Logout failed';
      })
      .addCase(doSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doSignUp.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        state.expiresAt = action.payload.expiresAt;
        state.error = null;
      })
      .addCase(doSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
        state.isAuthenticated = false;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.accessToken = action.payload.access;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
