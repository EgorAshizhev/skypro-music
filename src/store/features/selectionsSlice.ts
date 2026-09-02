import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Track } from '@/data/tracks';
import {
  getAllSelections,
  getSelectionById,
  type Selection,
} from '@/services/selectionsApi';
import { getAllTracks } from '@/services/tracksApi';
import { ApiError } from '@/services/httpClient';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface SelectionsState {
  list: Selection[];
  listStatus: Status;
  listError: string | null;

  currentId: number | null;
  currentName: string | null;
  currentTracks: Track[];
  currentStatus: Status;
  currentError: string | null;
}

const initialState: SelectionsState = {
  list: [],
  listStatus: 'idle',
  listError: null,

  currentId: null,
  currentName: null,
  currentTracks: [],
  currentStatus: 'idle',
  currentError: null,
};

export const fetchSelections = createAsyncThunk<
  Selection[],
  void,
  { rejectValue: string }
>('selections/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await getAllSelections();
  } catch (err) {
    console.error('Ошибка загрузки подборок:', err);
    if (err instanceof ApiError) return rejectWithValue(err.message);
    return rejectWithValue('Произошла ошибка. Попробуйте позже');
  }
});

export const fetchSelectionTracks = createAsyncThunk<
  { id: number; name: string; tracks: Track[] },
  number,
  { rejectValue: string }
>('selections/fetchTracks', async (id, { rejectWithValue }) => {
  try {
    const selection = await getSelectionById(id);

    if (selection.tracks.length > 0) {
      return { id, name: selection.name, tracks: selection.tracks };
    }

    const allTracks = await getAllTracks();
    const idsInSelection = new Set(selection.trackIds);
    const tracks = allTracks.filter((track) => idsInSelection.has(track.id));
    return { id, name: selection.name, tracks };
  } catch (err) {
    console.error('Ошибка загрузки треков подборки:', err);
    if (err instanceof ApiError) return rejectWithValue(err.message);
    return rejectWithValue('Произошла ошибка. Попробуйте позже');
  }
});

const selectionsSlice = createSlice({
  name: 'selections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSelections.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchSelections.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchSelections.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError =
          action.payload ?? 'Произошла ошибка. Попробуйте позже';
      })
      .addCase(fetchSelectionTracks.pending, (state) => {
        state.currentStatus = 'loading';
        state.currentError = null;
        state.currentId = null;
        state.currentName = null;
        state.currentTracks = [];
      })
      .addCase(fetchSelectionTracks.fulfilled, (state, action) => {
        state.currentStatus = 'succeeded';
        state.currentId = action.payload.id;
        state.currentName = action.payload.name;
        state.currentTracks = action.payload.tracks;
      })
      .addCase(fetchSelectionTracks.rejected, (state, action) => {
        state.currentStatus = 'failed';
        state.currentError =
          action.payload ?? 'Произошла ошибка. Попробуйте позже';
      });
  },
});

export default selectionsSlice.reducer;
