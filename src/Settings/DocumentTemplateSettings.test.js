import { describe, expect, it } from 'vitest';
import { renderSampleTemplate } from './DocumentTemplateSettings';

describe('document template sample preview', () => {
  it('replaces every template variable with readable sample content', () => {
    const preview = renderSampleTemplate(
      ':number :debtor pagará :amount en :unknownValue.'
    );

    expect(preview).toContain('III)');
    expect(preview).toContain('ANA MARTÍNEZ');
    expect(preview).toContain('CINCO MIL DÓLARES');
    expect(preview).toContain('[unknown Value]');
    expect(preview).not.toContain(':debtor', ':amount', ':unknownValue');
  });
});
