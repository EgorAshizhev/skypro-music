import { apiRequest } from './httpClient';
import { extractArray } from './extractArray';
import type { RawTrack } from '@/types/api';
import type { Track } from '@/data/tracks';

function formatDuration(totalSeconds: number): string {
  const safeSeconds = Number.isFinite(totalSeconds) ? totalSeconds : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = Math.round(safeSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function normalizeTrack(raw: RawTrack): Track {
  const genreValue = Array.isArray(raw.genre)
    ? (raw.genre[0] ?? '')
    : ((raw.genre as unknown as string) ?? '');

  const releaseDate = new Date(raw.release_date);
  const year = Number.isNaN(releaseDate.getTime())
    ? new Date().getFullYear()
    : releaseDate.getFullYear();

  return {
    id: raw._id,
    title: raw.name,
    author: raw.author,
    album: raw.album,
    duration: formatDuration(raw.duration_in_seconds),
    genre: genreValue,
    year,
    trackFile: raw.track_file,
  };
}

export async function getAllTracks(): Promise<Track[]> {
  const payload = await apiRequest<unknown>('/catalog/track/all/');
  const raw = extractArray<RawTrack>(payload, 'catalog/track/all');
  return raw.map((item, index) => {
    try {
      return normalizeTrack(item);
    } catch (err) {
      console.error('Не удалось обработать трек из API:', item, err);
      throw new Error(
        `Не удалось обработать трек #${index} из ответа API — проверьте формат данных в консоли`,
      );
    }
  });
}

export async function getTrackById(id: number): Promise<Track> {
  const payload = await apiRequest<unknown>(`/catalog/track/${id}/`);
  const raw =
    payload && typeof payload === 'object' && 'data' in payload
      ? ((payload as { data: RawTrack }).data)
      : (payload as RawTrack);
  return normalizeTrack(raw);
}

export async function getFavoriteTracks(token: string): Promise<Track[]> {
  const payload = await apiRequest<unknown>('/catalog/track/favorite/all/', {
    token,
  });
  const raw = extractArray<RawTrack>(payload, 'catalog/track/favorite/all');
  return raw.map(normalizeTrack);
}

export function addFavoriteTrack(id: number, token: string): Promise<void> {
  return apiRequest<void>(`/catalog/track/${id}/favorite/`, {
    method: 'POST',
    token,
  });
}

export function removeFavoriteTrack(
  id: number,
  token: string,
): Promise<void> {
  return apiRequest<void>(`/catalog/track/${id}/favorite/`, {
    method: 'DELETE',
    token,
  });
}
