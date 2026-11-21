import { describe, expect, it } from 'vitest';
import { countFieldErrors, fieldsAreComplete } from './FormScaffold';

describe('progressive form section status', () => {
  it('does not expose errors from sections the user has not visited', () => {
    const errors = { nombre: 'Campo requerido', documento: 'Campo requerido' };

    expect(
      countFieldErrors(errors, ['nombre', 'documento'], { nombre: true })
    ).toBe(1);
    expect(countFieldErrors(errors, ['nombre', 'documento'], {}, true)).toBe(2);
  });

  it('marks a section complete only when all required values are present', () => {
    expect(
      fieldsAreComplete({ nombre: 'Ana', documento: '01234567-8' }, [
        'nombre',
        'documento',
      ])
    ).toBe(true);
    expect(
      fieldsAreComplete({ nombre: 'Ana', documento: '' }, [
        'nombre',
        'documento',
      ])
    ).toBe(false);
  });
});
