import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Track } from '@/data/tracks';
import {
  getFavoriteTracks,
  addFavoriteTrack,
  removeFavoriteTrack,
} from '@/services/tracksApi';
import { ApiError } from '@/services/httpClient';
import { withReAuth } from '@/store/withReAuth';
import { logout } from '@/store/features/authSlice';
import type { RootState, AppDispatch } from '@/store/store';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface FavoritesState {
  ids: number[];
  tracks: Track[];
  status: Status;
  error: string | null;
  // id треков, для которых сейчас выполняется запрос лайка/дизлайка —
  // используется, чтобы заблокировать повторный клик и показать индикацию.
  pendingIds: number[];
}

const initialState: FavoritesState = {
  ids: [],
  tracks: [],
  status: 'idle',
  error: null,
  pendingIds: [],
};

export const fetchFavorites = createAsyncThunk<
  Track[],
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('favorites/fetchAll', async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    return await withReAuth(getState, dispatch, (token) =>
      getFavoriteTracks(token),
    );
  } catch (err) {
    console.error('Ошибка загрузки избранных треков:', err);
    if (err instanceof ApiError) return rejectWithValue(err.message);
    return rejectWithValue('Не удалось загрузить избранные треки');
  }
});

export const toggleFavoriteThunk = createAsyncThunk<
  { id: number },
  Track,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'favorites/toggle',
  async (track, { getState, dispatch, rejectWithValue }) => {
    const wasLiked = getState().favorites.ids.includes(track.id);
    try {
      await withReAuth(getState, dispatch, (token) =>
        wasLiked
          ? removeFavoriteTrack(track.id, token)
          : addFavoriteTrack(track.id, token),
      );
      return { id: track.id };
    } catch (err) {
      console.error('Ошибка изменения избранного:', err);
      if (err instanceof ApiError) return rejectWithValue(err.message);
      return rejectWithValue('Не удалось обновить избранное');
    }
  },
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavoritesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tracks = action.payload;
        state.ids = action.payload.map((track) => track.id);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Не удалось загрузить избранные треки';
      })
      // Оптимистичное обновление: переключаем состояние сразу, не дожидаясь
      // ответа сервера, чтобы UI реагировал мгновенно.
      .addCase(toggleFavoriteThunk.pending, (state, action) => {
        const track = action.meta.arg;
        const wasLiked = state.ids.includes(track.id);
        state.pendingIds.push(track.id);
        if (wasLiked) {
          state.ids = state.ids.filter((id) => id !== track.id);
          state.tracks = state.tracks.filter((t) => t.id !== track.id);
        } else {
          state.ids.push(track.id);
          state.tracks.push(track);
        }
      })
      .addCase(toggleFavoriteThunk.fulfilled, (state, action) => {
        state.pendingIds = state.pendingIds.filter(
          (id) => id !== action.payload.id,
        );
      })
      .addCase(toggleFavoriteThunk.rejected, (state, action) => {
        const track = action.meta.arg;
        state.pendingIds = state.pendingIds.filter((id) => id !== track.id);
        state.error = action.payload ?? 'Не удалось обновить избранное';
        // запрос не удался — откатываем оптимистичное изменение
        const isLikedNow = state.ids.includes(track.id);
        if (isLikedNow) {
          state.ids = state.ids.filter((id) => id !== track.id);
          state.tracks = state.tracks.filter((t) => t.id !== track.id);
        } else {
          state.ids.push(track.id);
          state.tracks.push(track);
        }
      })
      // При выходе из аккаунта избранное больше не актуально для UI
      .addCase(logout, () => initialState);
  },
});

export const { clearFavoritesError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
