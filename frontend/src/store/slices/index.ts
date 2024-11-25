import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '@app/store/slices/userSlice';
import authReducer from '@app/store/slices/authSlice';
import nightModeReducer from '@app/store/slices/nightModeSlice';
import themeReducer from '@app/store/slices/themeSlice';
import pwaReducer from '@app/store/slices/pwaSlice';
import userSlice from "@app/store/slices/userSlice";

const rootReducer = combineReducers({
  user: userReducer,
  profile: userSlice,
  auth: authReducer,
  nightMode: nightModeReducer,
  theme: themeReducer,
  pwa: pwaReducer,
});

export default rootReducer;
