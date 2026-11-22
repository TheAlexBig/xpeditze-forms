import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const emptySummary = 'Pendiente';

export function FormHeading({ title, description, eyebrow, summary = [] }) {
  return (
    <Box
      sx={{
        bgcolor: '#f4f8f5',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 3,
        px: { xs: 2, md: 2.5 },
        py: 2.25,
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
          {eyebrow && (
            <Typography
              color="primary.main"
              fontWeight={700}
              sx={{ mb: 0.25 }}
              variant="overline"
            >
              {eyebrow}
            </Typography>
          )}
          <Typography component="h2" variant="h5" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {description}
          </Typography>
        </Box>
        {summary.length > 0 && (
          <Stack
            direction="row"
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              maxWidth: { md: 420 },
            }}
          >
            {summary.map(({ label, value }) => (
              <Chip
                key={label}
                label={`${label}: ${value || emptySummary}`}
                size="small"
                sx={{ bgcolor: 'background.paper' }}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export function FieldGroup({
  title,
  description,
  children,
  accent = '#17695d',
}) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: { xs: 3, md: 3.5 },
        overflow: 'hidden',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: { xs: 1.5, sm: 2 },
          py: 1.75,
        }}
      >
        <Box
          sx={{
            bgcolor: accent,
            borderRadius: 1,
            flexShrink: 0,
            height: 8,
            mt: { sm: 0.8 },
            width: { xs: 42, sm: 8 },
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={700}>{title}</Typography>
          {description && (
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
          )}
        </Box>
      </Stack>
      <Box
        sx={{
          bgcolor: '#f8faf7',
          p: { xs: 1.5, sm: 2.25 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export const countFieldErrors = (
  errors,
  fields,
  touched = {},
  showAll = false
) =>
  fields.filter(
    (field) => Boolean(errors[field]) && (showAll || Boolean(touched[field]))
  ).length;

export const fieldsAreComplete = (values, fields) =>
  fields.every((field) => {
    const value = values[field];
    return value !== undefined && value !== null && String(value).trim() !== '';
  });

export function ProgressiveFieldGroup({
  id,
  title,
  description,
  children,
  accent = '#17695d',
  expanded,
  onSelect,
  errorCount = 0,
  complete = false,
  optional = false,
}) {
  const status = errorCount
    ? { color: 'error', label: `Revisar ${errorCount}` }
    : complete
      ? { color: 'success', label: 'Completo' }
      : optional
        ? { color: 'default', label: 'Opcional' }
        : { color: 'default', label: 'Pendiente' };

  return (
    <Accordion
      disableGutters
      expanded={expanded}
      onChange={() => onSelect(id)}
      sx={{
        border: '1px solid',
        borderColor: errorCount ? 'error.main' : 'divider',
        borderRadius: '8px !important',
        boxShadow: 'none',
        mb: 1.5,
        overflow: 'hidden',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        aria-controls={`${id}-content`}
        expandIcon={<Typography aria-hidden="true">⌄</Typography>}
        id={`${id}-header`}
        sx={{
          bgcolor: expanded ? '#f4f8f5' : 'background.paper',
          minHeight: 64,
          px: { xs: 1.5, sm: 2 },
          '& .MuiAccordionSummary-content': { my: 1.25 },
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            mr: 1,
            width: '100%',
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                bgcolor: accent,
                borderRadius: 1,
                flexShrink: 0,
                height: 8,
                mt: 0.8,
                width: 8,
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={700}>{title}</Typography>
              {description && (
                <Typography color="text.secondary" variant="body2">
                  {description}
                </Typography>
              )}
            </Box>
          </Stack>
          <Chip color={status.color} label={status.label} size="small" />
        </Stack>
      </AccordionSummary>
      <AccordionDetails
        aria-labelledby={`${id}-header`}
        id={`${id}-content`}
        sx={{ bgcolor: '#f8faf7', p: { xs: 1.5, sm: 2.25 } }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

export function EmptyState({ children }) {
  return (
    <Box
      sx={{
        bgcolor: '#f4f8f5',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        px: 2,
        py: 2.25,
      }}
    >
      <Typography color="text.secondary" variant="body2">
        {children}
      </Typography>
    </Box>
  );
}

export function SectionHeader({ title, description }) {
  return (
    <Box
      sx={{
        borderLeft: '3px solid',
        borderLeftColor: 'secondary.main',
        mb: 2.5,
        pl: 1.5,
      }}
    >
      <Typography component="h2" variant="h5">
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
          {description}
        </Typography>
      )}
    </Box>
  );
}

export function SurfaceRow({ children }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        px: { xs: 1.5, sm: 2 },
        py: 1.5,
      }}
    >
      {children}
    </Box>
  );
}

export function FormActions({ buttons }) {
  return (
    <Stack
      direction={{ xs: 'column-reverse', sm: 'row' }}
      spacing={1.5}
      sx={{ justifyContent: 'flex-end', mt: 3 }}
    >
      {buttons.map((buttonItem) => (
        <Button
          key={buttonItem.text}
          color={buttonItem.color}
          onClick={buttonItem.action}
          type={buttonItem.type}
          variant={buttonItem.variant}
        >
          {buttonItem.text}
        </Button>
      ))}
    </Stack>
  );
}
