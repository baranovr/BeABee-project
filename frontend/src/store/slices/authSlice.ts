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
  avatar: File;
  nickname: string;
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
  status_in_service: string;
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

const API_BASE_URL = 'http://localhost:8000/api';

const fetchConfig = {
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
};

export const send2FACode = createAsyncThunk(
  'auth/send2FACode',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login/2fa/`, {
        ...fetchConfig,
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to send 2FA code');
      }

      // Log cookies after response
      console.log('Cookies after 2FA request:', document.cookie);

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return rejectWithValue('Network error occurred');
    }
  }
);

export const verify2FACode = createAsyncThunk(
  'auth/verify2FACode',
  async (payload: { code: string }, { dispatch, rejectWithValue }) => {
    try {
      // Send verification request
      const response = await fetch(`${API_BASE_URL}/user/login/2fa/verify/`, {
        ...fetchConfig,
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify 2FA code');
      }

      const data = await response.json();
      const { access, refresh } = data;

      // Store tokens
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      // Set authorization header for future requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // Fetch user profile
      await dispatch(fetchUserProfile());

      return { access, refresh };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Вспомогательная функция для проверки статуса сессии
export const checkSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/check-session/`, {
      ...fetchConfig,
      method: 'GET'
    });
    return response.ok;
  } catch {
    return false;
  }
};

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
      .addCase(send2FACode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(send2FACode.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(send2FACode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verify2FACode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verify2FACode.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verify2FACode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
