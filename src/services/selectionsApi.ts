import { apiRequest } from './httpClient';
import { extractArray } from './extractArray';
import { normalizeTrack } from './tracksApi';
import type { RawSelection, RawTrack } from '@/types/api';
import type { Track } from '@/data/tracks';

export interface Selection {
  id: number;
  name: string | undefined;
  trackIds: number[];
  tracks: Track[];
}

function normalizeSelection(raw: RawSelection): Selection {
  const items = Array.isArray(raw.items) ? raw.items : [];
  const trackIds: number[] = [];
  const tracks: Track[] = [];

  for (const item of items) {
    if (typeof item === 'number') {
      trackIds.push(item);
      continue;
    }

    const rawId: unknown =
      '_id' in item ? item._id : 'id' in item ? item.id : null;
    const id =
      typeof rawId === 'number'
        ? rawId
        : typeof rawId === 'string' &&
            rawId.trim() !== '' &&
            !Number.isNaN(Number(rawId))
          ? Number(rawId)
          : null;

    if (id !== null) {
      trackIds.push(id);
    }

    if (
      typeof item === 'object' &&
      item !== null &&
      '_id' in item &&
      'name' in item &&
      'author' in item &&
      'release_date' in item &&
      'duration_in_seconds' in item
    ) {
      try {
        tracks.push(normalizeTrack(item as RawTrack));
      } catch (err) {
        // Один битый трек в подборке не должен обнулять всю подборку —
        // пропускаем его, остальные треки подборки всё равно отобразятся.
        console.error('Не удалось обработать трек внутри подборки:', item, err);
      }
    }
  }

  return {
    id: raw._id,
    name: raw.name,
    trackIds,
    tracks,
  };
}

export async function getAllSelections(): Promise<Selection[]> {
  const payload = await apiRequest<unknown>('/catalog/selection/all');
  const raw = extractArray<RawSelection>(payload, 'catalog/selection/all');
  return raw.map(normalizeSelection);
}

export async function getSelectionById(id: number): Promise<Selection> {
  const payload = await apiRequest<unknown>(`/catalog/selection/${id}/`);
  const raw =
    payload && typeof payload === 'object' && 'data' in payload
      ? (payload as { data: RawSelection }).data
      : (payload as RawSelection);
  return normalizeSelection(raw);
}
