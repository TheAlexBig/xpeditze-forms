import { describe, expect, it } from 'vitest';
import {
  hasSameCompanyNit,
  hasSamePartyDui,
  isNotary,
  validateCarSaleState,
} from './CarSaleRules';

describe('car sale business rules', () => {
  it('accepts only notaries as authenticating agents', () => {
    expect(isNotary({ rol: 'Notario' })).toBe(true);
    expect(isNotary({ rol: 'Abogado' })).toBe(false);
  });

  it('compares represented companies by normalized NIT', () => {
    expect(
      hasSameCompanyNit(
        { actua_por_sociedad: true, sociedad_nit: '0614-010101-001-1' },
        { actua_por_sociedad: true, sociedad_nit: '0614 010101 001 1' }
      )
    ).toBe(true);
    expect(
      hasSameCompanyNit(
        { actua_por_sociedad: false, sociedad_nit: '0614-010101-001-1' },
        { actua_por_sociedad: true, sociedad_nit: '0614-010101-001-1' }
      )
    ).toBe(false);
  });

  it('compares buyer and seller by normalized DUI', () => {
    expect(
      hasSamePartyDui({ documento: '01234567-8' }, { documento: '0123 4567 8' })
    ).toBe(true);
  });

  it('reports invalid recovered drafts before generation', () => {
    expect(
      validateCarSaleState({
        agentStates: { rol: 'Abogado' },
        personStates: { documento: '01234567-8' },
        vendorStates: { documento: '87654321-0' },
      })
    ).toContain('notario');
  });
});
