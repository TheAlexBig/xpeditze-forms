import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const emptyReviewValue = 'Pendiente';

export const formatReviewValue = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && !value.trim())
    ? emptyReviewValue
    : String(value);

export function ReviewSummary({ title, chips = [] }) {
  return (
    <Box
      sx={{
        bgcolor: 'primary.surface',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 2.5,
        px: { xs: 2, md: 2.5 },
        py: 2,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography color="text.secondary" fontWeight={650} variant="body2">
            Resumen del documento
          </Typography>
          <Typography component="h3" fontWeight={750} variant="h5">
            {title}
          </Typography>
        </Box>
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
          {chips.map((chip) => (
            <Chip
              key={chip}
              label={chip}
              size="small"
              sx={{ bgcolor: 'background.paper' }}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

export function ReviewField({ label, value, wide = false }) {
  const displayValue = formatReviewValue(value);
  const pending = displayValue === emptyReviewValue;

  return (
    <Grid
      size={{
        xs: 12,
        sm: wide ? 12 : 6,
        md: wide ? 12 : 6,
      }}
      sx={{ display: 'flex' }}
    >
      <Box
        sx={{
          bgcolor: '#f8faf7',
          border: '1px solid',
          borderColor: pending ? 'warning.light' : 'divider',
          borderRadius: 1.5,
          minWidth: 0,
          p: 1.5,
          width: '100%',
        }}
      >
        <Typography
          color="text.secondary"
          component="dt"
          fontWeight={700}
          sx={{ letterSpacing: '0.02em' }}
          variant="caption"
        >
          {label}
        </Typography>
        <Typography
          color={pending ? 'warning.dark' : 'text.primary'}
          component="dd"
          fontWeight={550}
          sx={{ m: 0, mt: 0.35, overflowWrap: 'anywhere' }}
          variant="body2"
        >
          {displayValue}
        </Typography>
      </Box>
    </Grid>
  );
}

function ReviewFields({ rows }) {
  return (
    <Grid
      columnSpacing={1.5}
      component="dl"
      container
      rowSpacing={1.5}
      sx={{ m: 0 }}
    >
      {rows.map(([label, value, wide]) => (
        <ReviewField key={label} label={label} value={value} wide={wide} />
      ))}
    </Grid>
  );
}

function ReviewGroup({ title, rows }) {
  return (
    <Box>
      <Typography
        color="text.secondary"
        fontWeight={750}
        sx={{ mb: 1, textTransform: 'uppercase' }}
        variant="caption"
      >
        {title}
      </Typography>
      <ReviewFields rows={rows} />
    </Box>
  );
}

export function ReviewSection({
  id,
  number,
  title,
  summary,
  rows = [],
  groups = [],
  content,
  onEdit,
  accent = '#17695d',
  expanded,
  onSelect,
}) {
  const headerId = `${id}-header`;
  const contentId = `${id}-content`;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 2,
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          bgcolor: expanded ? 'primary.surface' : 'background.paper',
          p: { xs: 1.25, sm: 1.5 },
        }}
      >
        <ButtonBase
          aria-controls={contentId}
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Ocultar' : 'Revisar'} ${title}`}
          id={headerId}
          onClick={() => onSelect(id)}
          sx={{
            borderRadius: 1,
            flex: 1,
            justifyContent: 'flex-start',
            minWidth: 0,
            p: 0.5,
            textAlign: 'left',
          }}
        >
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 1.5 }}
            sx={{ alignItems: 'center', minWidth: 0, width: '100%' }}
          >
            <Box
              sx={{
                alignItems: 'center',
                bgcolor: accent,
                borderRadius: 1,
                color: '#ffffff',
                display: 'flex',
                flexShrink: 0,
                fontSize: 13,
                fontWeight: 800,
                height: 34,
                justifyContent: 'center',
                width: 34,
              }}
            >
              {number}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography component="h3" fontWeight={750} variant="h6">
                {title}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {summary || emptyReviewValue}
              </Typography>
            </Box>
            <Typography
              aria-hidden="true"
              color="text.secondary"
              sx={{
                flexShrink: 0,
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 150ms ease',
              }}
            >
              ⌄
            </Typography>
          </Stack>
        </ButtonBase>
        <Button onClick={onEdit} size="small" type="button" variant="outlined">
          Editar
        </Button>
      </Stack>
      <Collapse in={expanded} timeout="auto">
        <Box
          aria-labelledby={headerId}
          id={contentId}
          role="region"
          sx={{ px: { xs: 2, md: 2.5 }, pb: 2.5 }}
        >
          <Divider sx={{ mb: 2 }} />
          {content ||
            (groups.length ? (
              <Stack spacing={2.5}>
                {groups.map((group) => (
                  <ReviewGroup
                    key={group.title}
                    title={group.title}
                    rows={group.values}
                  />
                ))}
              </Stack>
            ) : (
              <ReviewFields rows={rows} />
            ))}
        </Box>
      </Collapse>
    </Box>
  );
}

export const selectReviewSection = (activeSection, selectedSection) =>
  activeSection === selectedSection ? null : selectedSection;

export function ReviewSectionList({ sections, onEdit }) {
  const [activeSection, setActiveSection] = useState('review-section-1');

  const handleSelect = (selectedSection) => {
    setActiveSection((currentSection) =>
      selectReviewSection(currentSection, selectedSection)
    );
  };

  return sections.map((section, index) => {
    const id = `review-section-${index + 1}`;
    return (
      <ReviewSection
        key={section.title}
        id={id}
        number={index + 1}
        title={section.title}
        summary={section.summary}
        rows={section.values}
        groups={section.groups}
        content={section.content}
        accent={section.accent}
        expanded={activeSection === id}
        onSelect={handleSelect}
        onEdit={() => onEdit(section.step)}
      />
    );
  });
}
