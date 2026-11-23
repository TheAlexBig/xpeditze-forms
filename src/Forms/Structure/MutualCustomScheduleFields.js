import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import DateField from './DateField';

const itemError = (errors, index, field) =>
  Array.isArray(errors) ? errors[index]?.[field] : '';

export default function MutualCustomScheduleFields({
  errors,
  installments,
  onBlur,
  onChange,
  setFieldValue,
}) {
  return (
    <Stack spacing={1.5}>
      {installments.map((installment, index) => (
        <Grid container spacing={1} key={index}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <DateField
              error={Boolean(itemError(errors, index, 'date'))}
              fullWidth
              helperText={itemError(errors, index, 'date')}
              label={`Fecha cuota ${index + 1}`}
              name={`customInstallments.${index}.date`}
              value={installment.date}
              onChange={onChange}
              onBlur={onBlur}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              error={Boolean(itemError(errors, index, 'capital'))}
              fullWidth
              helperText={itemError(errors, index, 'capital')}
              label="Capital"
              name={`customInstallments.${index}.capital`}
              type="number"
              value={installment.capital}
              onChange={onChange}
              onBlur={onBlur}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              error={Boolean(itemError(errors, index, 'interest'))}
              fullWidth
              helperText={itemError(errors, index, 'interest')}
              label="Interés"
              name={`customInstallments.${index}.interest`}
              type="number"
              value={installment.interest}
              onChange={onChange}
              onBlur={onBlur}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Button
              disabled={installments.length === 1}
              onClick={() =>
                setFieldValue(
                  'customInstallments',
                  installments.filter((_item, itemIndex) => itemIndex !== index)
                )
              }
              size="small"
              type="button"
            >
              Quitar
            </Button>
          </Grid>
        </Grid>
      ))}
      <Box>
        <Button
          onClick={() =>
            setFieldValue('customInstallments', [
              ...installments,
              { date: '', capital: '', interest: '0' },
            ])
          }
          size="small"
          type="button"
          variant="outlined"
        >
          Agregar cuota
        </Button>
      </Box>
      {typeof errors === 'string' && <Alert severity="warning">{errors}</Alert>}
    </Stack>
  );
}

MutualCustomScheduleFields.propTypes = {
  errors: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  installments: PropTypes.arrayOf(
    PropTypes.shape({
      capital: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      date: PropTypes.string.isRequired,
      interest: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    })
  ).isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
