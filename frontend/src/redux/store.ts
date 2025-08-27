import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import studentAuthReducer from './slices/studentAuthSlice';
import tutorAuthReducer from './slices/tutorAuthSlice';

const store = configureStore({
  reducer: {
    admin: adminReducer,
    studentAuth: studentAuthReducer,
    tutorAuth: tutorAuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
