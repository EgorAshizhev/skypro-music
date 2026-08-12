import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Track } from '@/data/tracks';

interface PlayerState {
  currentTrack: Track | null;
  originalPlaylist: Track[];
  playOrder: Track[];
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  volume: number;
  progress: number; // текущее время трека, сек
  duration: number; // длительность текущего трека, сек
}

const initialState: PlayerState = {
  currentTrack: null,
  originalPlaylist: [],
  playOrder: [],
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,
  volume: 1,
  progress: 0,
  duration: 0,
};

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // Вызывается компонентом Playlist (или другим плейлистом) при монтировании —
    // фиксирует, какой именно список треков сейчас "текущий плейлист".
    setPlaylist(state, action: PayloadAction<Track[]>) {
      state.originalPlaylist = action.payload;
      state.playOrder = state.isShuffle
        ? shuffleArray(action.payload)
        : action.payload;
    },
    // Клик по треку в списке — запускаем именно его
    playTrack(state, action: PayloadAction<Track>) {
      state.currentTrack = action.payload;
      state.isPlaying = true;
      state.progress = 0;
    },
    togglePlay(state) {
      if (state.currentTrack) {
        state.isPlaying = !state.isPlaying;
      }
    },
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    nextTrack(state) {
      if (!state.currentTrack || state.playOrder.length === 0) return;
      const currentIndex = state.playOrder.findIndex(
        (t) => t.id === state.currentTrack!.id,
      );
      const nextIndex =
        (currentIndex + 1 + state.playOrder.length) % state.playOrder.length;
      state.currentTrack = state.playOrder[nextIndex];
      state.isPlaying = true;
      state.progress = 0;
    },
    prevTrack(state) {
      if (!state.currentTrack || state.playOrder.length === 0) return;
      const currentIndex = state.playOrder.findIndex(
        (t) => t.id === state.currentTrack!.id,
      );
      const prevIndex =
        (currentIndex - 1 + state.playOrder.length) % state.playOrder.length;
      state.currentTrack = state.playOrder[prevIndex];
      state.isPlaying = true;
      state.progress = 0;
    },
    toggleShuffle(state) {
      state.isShuffle = !state.isShuffle;
      state.playOrder = state.isShuffle
        ? shuffleArray(state.originalPlaylist)
        : state.originalPlaylist;
    },
    toggleRepeat(state) {
      state.isRepeat = !state.isRepeat;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
  },
});

export const {
  setPlaylist,
  playTrack,
  togglePlay,
  setIsPlaying,
  nextTrack,
  prevTrack,
  toggleShuffle,
  toggleRepeat,
  setVolume,
  setProgress,
  setDuration,
} = playerSlice.actions;
export default playerSlice.reducer;