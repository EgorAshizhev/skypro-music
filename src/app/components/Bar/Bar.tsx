'use client';

import { useEffect, useRef } from 'react';
import styles from './Bar.module.css';
import PlayerControls from '@/app/components/PlayerControls/PlayerControls';
import TrackPlay from '@/app/components/TrackPlay/TrackPlay';
import Volume from '@/app/components/Volume/Volume';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setIsPlaying } from '@/store/features/playerSlice';

export default function Bar() {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);
  const volume = useAppSelector((state) => state.player.volume);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Смена трека — обновляем src и запускаем
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.trackFile;
    audio.play().catch(() => {});
  }, [currentTrack]);

  // Play / Pause по флагу из Redux
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // Громкость
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div className={styles.bar}>
      {/* Скрытый нативный аудиоэлемент — им управляет только JS */}
      <audio
        ref={audioRef}
        style={{ display: 'none' }}
        onEnded={() => dispatch(setIsPlaying(false))}
      />
      <div className={styles.bar__content}>
        <div className={styles.bar__playerProgress}></div>
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