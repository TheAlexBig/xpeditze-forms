import { describe, expect, it, vi } from 'vitest';
import { readMarriageDraft } from '../Forms/MarriageDraftStorage';
import { readMutualDraft } from '../Forms/MutualDraftStorage';
import { prepareHistoryDraft } from './HistoryDraftNavigation';

const memoryStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
};

describe('history draft navigation', () => {
  it.each([
    ['mutual', '/mutuo', readMutualDraft],
    ['marriage', '/matrimonio', readMarriageDraft],
  ])('prepares a %s draft in local storage', (type, route, readDraft) => {
    const storage = memoryStorage();
    const draft = { value: type };

    expect(
      prepareHistoryDraft(
        { type, draft },
        storage,
        vi.fn(),
        '2026-11-23T12:00:00.000Z'
      )
    ).toBe(route);
    expect(readDraft(storage)).toEqual({
      schemaVersion: type === 'marriage' ? 4 : 3,
      state: draft,
      savedAt: '2026-11-23T12:00:00.000Z',
    });
  });

  it('loads a vehicle sale draft through application state', () => {
    const loadDraft = vi.fn();
    const historyItem = { type: 'car-sale', draft: { vehicle: 'P123' } };

    expect(prepareHistoryDraft(historyItem, memoryStorage(), loadDraft)).toBe(
      '/compra-venta'
    );
    expect(loadDraft).toHaveBeenCalledWith(historyItem);
  });
});
