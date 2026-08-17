import { apiRequest } from './httpClient';
import { extractArray } from './extractArray';
import type { RawSelection } from '@/types/api';

export interface Selection {
  id: number;
  name: string;
  trackIds: number[];
}

function normalizeSelection(raw: RawSelection): Selection {
  return {
    id: raw._id,
    name: raw.name,
    trackIds: Array.isArray(raw.items) ? raw.items : [],
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
      ? ((payload as { data: RawSelection }).data)
      : (payload as RawSelection);
  return normalizeSelection(raw);
}
