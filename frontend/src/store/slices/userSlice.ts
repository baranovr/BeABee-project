// userSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@app/api/axiosInstance';
import { UserModel } from '@app/domain/UserModel';

// Backend response interface
interface BackendUserProfile {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  nickname: string;
  email: string;
  phone_number: string | null;
  sex: string;
  birth_date: string;
  country: string | null;
  city: string | null;
  group: string;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  github: string | null;
  status_in_service: string;
  date_joined: string;
}

interface UserState {
  user: UserModel | null;
  loading: boolean;
  error: string | null;
  updateSuccess: boolean;
}

// Initial state
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  updateSuccess: false,
};

// Transform backend data to UserModel
const transformUserData = (data: BackendUserProfile): UserModel => ({
  id: data.id,
  firstName: data.first_name,
  lastName: data.last_name,
  imgUrl: data.avatar,
  nickName: data.nickname,
  email: data.email,
  phone: data.phone_number,
  sex: data.sex,
  birthday: data.birth_date,
  country: data.country,
  city: data.city,
  group: data.group,
  instagram: data.instagram,
  facebook: data.facebook,
  linkedin: data.linkedin,
  github: data.github,
  statusInService: data.status_in_service,
  date_joined: data.date_joined,
});

// Async thunks
export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<BackendUserProfile>('user/my_profile/');
    return transformUserData(response.data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
  }
});

// Transform UserModel to backend format
const transformToBackendFormat = (data: Partial<UserModel>): Partial<BackendUserProfile> => ({
  first_name: data.firstName,
  last_name: data.lastName,
  nickname: data.nickName,
  email: data.email,
  phone_number: data.phone,
  birth_date: data.birthday,
  country: data.country,
  city: data.city,
  group: data.group,
  sex: data.sex,
  instagram: data.instagram,
  facebook: data.facebook,
  linkedin: data.linkedin,
  github: data.github,
  status_in_service: data.statusInService,
  date_joined: data.date_joined,
});

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (data: Partial<UserModel>, { rejectWithValue }) => {
    try {
      const backendData = transformToBackendFormat(data);
      const response = await axiosInstance.patch<BackendUserProfile>('user/my_profile/', backendData);
      return transformUserData(response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
    }
  },
);

// Асинхронное действие для загрузки аватара
export const uploadAvatar = createAsyncThunk('user/uploadAvatar', async (file: File, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axiosInstance.patch('user/my_profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // возвращаем обновленные данные пользователя
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to upload avatar');
  }
});

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.updateSuccess = false;
    },
    resetUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.error = null;
    },
    setUserProfile: (state, action: PayloadAction<UserModel>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserModel>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserModel>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.updateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      })
      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearUserProfile, resetUpdateStatus, setUserProfile } = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUpdateSuccess = (state: { user: UserState }) => state.user.updateSuccess;

export default userSlice.reducer;
