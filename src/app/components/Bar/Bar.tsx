'use client';

import { useEffect, useRef } from 'react';
import styles from './Bar.module.css';
import PlayerControls from '@/app/components/PlayerControls/PlayerControls';
import TrackPlay from '@/app/components/TrackPlay/TrackPlay';
import Volume from '@/app/components/Volume/Volume';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  nextTrack,
  setProgress,
  setDuration,
} from '@/store/features/playerSlice';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Bar() {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);
  const isRepeat = useAppSelector((state) => state.player.isRepeat);
  const volume = useAppSelector((state) => state.player.volume);
  const progress = useAppSelector((state) => state.player.progress);
  const duration = useAppSelector((state) => state.player.duration);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Смена трека — обновляем src и запускаем
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.trackFile;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, [currentTrack]);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);


  function handleEnded() {
    const audio = audioRef.current;
    if (isRepeat && audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }
    dispatch(nextTrack());
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    const value = Number(e.target.value);
    if (audio) {
      audio.currentTime = value;
    }
    dispatch(setProgress(value));
  }

  return (
    <div className={styles.bar}>
      {/* Скрытый нативный аудиоэлемент — им управляет только JS */}
      <audio
        ref={audioRef}
        style={{ display: 'none' }}
        onEnded={handleEnded}
        onTimeUpdate={(e) =>
          dispatch(setProgress(e.currentTarget.currentTime))
        }
        onLoadedMetadata={(e) =>
          dispatch(setDuration(e.currentTarget.duration))
        }
      />
      <div className={styles.bar__content}>
        <div className={styles.bar__playerProgress}>
          <input
            className={styles.bar__progressLine}
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(progress, duration || 0)}
            onChange={handleSeek}
            disabled={!currentTrack}
          />
          <div className={styles.bar__timeText}>
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <PlayerControls />
            <TrackPlay />
          </div>
          <div className={styles.bar__volumeBlock}>
            <Volume />
          </div>
        </div>
      </div>
    </div>
  );
}