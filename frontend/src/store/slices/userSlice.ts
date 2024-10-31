import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@app/api/axiosInstance';
import { UserModel } from '@app/domain/UserModel';

// Backend response interface
interface BackendUserProfile {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  username: string;
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
  userName: data.username,
  email: data.email,
  phone: data.phone_number,
  sex: data.sex,
  birthday: data.birth_date,
  country: data.country,
  city: data.city,
  group: data.group,
  socials: {
    instagram: data.instagram,
    facebook: data.facebook,
    linkedin: data.linkedin,
    github: data.github,
  },
});

// Async thunks
export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<BackendUserProfile>('/user/my_profile/');
    return transformUserData(response.data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
  }
});

// Transform UserModel to backend format
const transformToBackendFormat = (data: Partial<UserModel>): Partial<BackendUserProfile> => ({
  first_name: data.firstName,
  last_name: data.lastName,
  username: data.userName,
  phone_number: data.phone,
  birth_date: data.birthday,
  country: data.country,
  city: data.city,
  sex: data.sex,
  ...(data.socials && {
    instagram: data.socials.instagram,
    facebook: data.socials.facebook,
    linkedin: data.socials.linkedin,
    github: data.socials.github,
  }),
});

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (data: Partial<UserModel>, { rejectWithValue }) => {
    try {
      const backendData = transformToBackendFormat(data);
      const response = await axiosInstance.patch<BackendUserProfile>('/user/my_profile/', backendData);
      return transformUserData(response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
    }
  },
);

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
