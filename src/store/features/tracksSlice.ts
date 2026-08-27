import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Track } from '@/data/tracks';
import { getAllTracks } from '@/services/tracksApi';
import { ApiError } from '@/services/httpClient';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface TracksState {
  items: Track[];
  status: Status;
  error: string | null;
}

const initialState: TracksState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchAllTracks = createAsyncThunk<
  Track[],
  void,
  { rejectValue: string }
>('tracks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await getAllTracks();
  } catch (err) {
    console.error('Ошибка загрузки треков:', err);
    if (err instanceof ApiError) return rejectWithValue(err.message);
    return rejectWithValue('Произошла ошибка. Попробуйте позже');
  }
});

const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTracks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllTracks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAllTracks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Произошла ошибка. Попробуйте позже';
      });
  },
});

export default tracksSlice.reducer;
