import { describe, expect, it } from 'vitest';
import {
  DUI_IDENTITY_TYPE,
  formatIdentityDocument,
  usesDuiIdentity,
} from './PersonCoreGroups';

describe('person identity mode', () => {
  it('recognizes only DUI as the DUI mode', () => {
    expect(usesDuiIdentity(DUI_IDENTITY_TYPE)).toBe(true);
    expect(usesDuiIdentity('Pasaporte')).toBe(false);
    expect(usesDuiIdentity('')).toBe(false);
  });

  it('masks DUI and preserves alternative document numbers', () => {
    expect(formatIdentityDocument('012345678', DUI_IDENTITY_TYPE, true)).toBe(
      '01234567-8'
    );
    expect(formatIdentityDocument('AB-12/34', 'Pasaporte', true)).toBe(
      'AB-12/34'
    );
  });
});
