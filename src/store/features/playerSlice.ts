import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Track } from '@/data/tracks';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 1,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // Клик по новому треку — запускаем его
    setCurrentTrack(state, action: PayloadAction<Track>) {
      state.currentTrack = action.payload;
      state.isPlaying = true;
    },
    // Пауза/продолжить для текущего трека
    togglePlay(state) {
      if (state.currentTrack) {
        state.isPlaying = !state.isPlaying;
      }
    },
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
  },
});

export const { setCurrentTrack, togglePlay, setIsPlaying, setVolume } =
  playerSlice.actions;
export default playerSlice.reducer;