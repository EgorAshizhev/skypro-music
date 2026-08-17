import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './features/playerSlice';
import authReducer from './features/authSlice';
import tracksReducer from './features/tracksSlice';
import selectionsReducer from './features/selectionsSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    auth: authReducer,
    tracks: tracksReducer,
    selections: selectionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
