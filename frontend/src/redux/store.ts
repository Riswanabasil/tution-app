import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import courseReducer from './slices/courseSlice'
import assignedCoursesReducer from './slices/assignedCoursesSlice'

const store = configureStore({
  reducer: {
    admin: adminReducer,
    courses: courseReducer,
    assignedCourses: assignedCoursesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
