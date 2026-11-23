import { describe, expect, it } from 'vitest';
import { writeCarSaleDraft } from '../Forms/CarSaleDraftStorage';
import { writeMarriageDraft } from '../Forms/MarriageDraftStorage';
import { backupNeedsAttention, listSavedDrafts } from './Blog';

const memoryStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
};

describe('home workspace', () => {
  it('lists saved drafts from most to least recent', () => {
    const storage = memoryStorage();
    writeCarSaleDraft(storage, { vehicle: 'P123' }, '2026-11-22T10:00:00Z');
    writeMarriageDraft(storage, { party: 'Ana' }, '2026-11-23T10:00:00Z');

    expect(
      listSavedDrafts(storage).map(({ label, draft }) => [label, draft.savedAt])
    ).toEqual([
      ['Matrimonio', '2026-11-23T10:00:00Z'],
      ['Compra venta de vehículos', '2026-11-22T10:00:00Z'],
    ]);
  });

  it('requests a backup when none is registered or it is over 30 days old', () => {
    const now = new Date('2026-11-23T12:00:00Z').getTime();

    expect(backupNeedsAttention(null, now)).toBe(true);
    expect(backupNeedsAttention('2026-10-01T12:00:00Z', now)).toBe(true);
    expect(backupNeedsAttention('2026-11-01T12:00:00Z', now)).toBe(false);
  });
});
