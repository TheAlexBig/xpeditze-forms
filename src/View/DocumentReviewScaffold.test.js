import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  formatReviewValue,
  ReviewSectionList,
  selectReviewSection,
} from './DocumentReviewScaffold';

describe('review section selection', () => {
  it('opens a different section', () => {
    expect(selectReviewSection('review-section-1', 'review-section-2')).toBe(
      'review-section-2'
    );
  });

  it('closes the active section', () => {
    expect(selectReviewSection('review-section-1', 'review-section-1')).toBe(
      null
    );
  });
});

describe('review values', () => {
  it('keeps zero values visible', () => {
    expect(formatReviewValue(0)).toBe('0');
  });

  it('marks empty values as pending', () => {
    expect(formatReviewValue('  ')).toBe('Pendiente');
    expect(formatReviewValue(null)).toBe('Pendiente');
  });
});

describe('review information groups', () => {
  it('presents labeled groups and their values', () => {
    const markup = renderToStaticMarkup(
      <ReviewSectionList
        sections={[
          {
            title: 'Contrayente',
            summary: 'Ana Prueba',
            step: 1,
            groups: [
              {
                title: 'Identidad',
                values: [['Nombre completo', 'Ana Prueba']],
              },
            ],
          },
        ]}
        onEdit={() => {}}
      />
    );

    expect(markup).toContain('Identidad');
    expect(markup).toContain('Nombre completo');
    expect(markup).toContain('Ana Prueba');
  });
});
