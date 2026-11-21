import { describe, expect, it } from 'vitest';
import { normalizeCatalogText } from './CatalogText';

describe('normalizeCatalogText', () => {
  it('corrige mayúsculas inconsistentes y espacios', () => {
    expect(normalizeCatalogText('  cOrolla   cross ')).toBe('Corolla Cross');
  });

  it('conserva siglas y normaliza códigos de modelos', () => {
    expect(normalizeCatalogText('BMW')).toBe('BMW');
    expect(normalizeCatalogText('cx-5')).toBe('CX-5');
    expect(normalizeCatalogText('rav4')).toBe('RAV4');
  });

  it('mantiene conectores españoles en minúscula', () => {
    expect(
      normalizeCatalogText('administrador único Y representante legal')
    ).toBe('Administrador Único y Representante Legal');
  });
});
