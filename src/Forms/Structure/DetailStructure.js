import { useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { DataTerritorialDivision } from '../../Data/DataTerritorialDivision';
import { DetailValidationSchema } from '../Validations/DetailValidationSchema';
import {
  countFieldErrors,
  fieldsAreComplete,
  FormActions,
  FormHeading,
  ProgressiveFieldGroup,
} from './FormScaffold';
import { currentTimeValue, todayValue } from '../../Functions/DateTimeValues';
import { formatDate } from '../../Functions/DateFormat';
import DateField from './DateField';

const fieldProps = (name, values, touched, errors) => ({
  error: Boolean(touched[name] && errors[name]),
  helperText: touched[name] && errors[name],
  name,
  value: values[name],
  fullWidth: true,
});

const formatCurrency = (value) => {
  const [integer = '', cents] = String(value ?? '').split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return cents === undefined
    ? formattedInteger
    : `${formattedInteger}.${cents}`;
};

const cleanCurrency = (value) => {
  const withoutSeparators = value.replace(/,/g, '').replace(/[^\d.]/g, '');
  const [integer = '', ...decimalParts] = withoutSeparators.split('.');
  if (!decimalParts.length) {
    return integer;
  }
  return `${integer || '0'}.${decimalParts.join('').slice(0, 2)}`;
};

const detailSummary = (values) => [
  {
    label: 'Precio',
    value: values.precio && `$${formatCurrency(values.precio)}`,
  },
  { label: 'Firma', value: formatDate(values.fecha_firma) },
  { label: 'Lugar', value: values.domicilio || values.municipio },
];

const signingFields = [
  'departamento',
  'municipio',
  'domicilio',
  'fecha_firma',
  'hora_firma',
];

const DetailStructure = ({ data, title, buttons, submitAction }) => {
  const [activeGroup, setActiveGroup] = useState('conditions');

  return (
    <Formik
      enableReinitialize
      initialValues={data}
      onSubmit={submitAction}
      validationSchema={Yup.object().shape(DetailValidationSchema)}
    >
      {({
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        submitCount,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit} noValidate>
          <FormHeading
            title={title}
            description="Defina las condiciones de venta y los datos del acto notarial."
            eyebrow="Cierre del documento"
            summary={detailSummary(values)}
          />
          <ProgressiveFieldGroup
            id="conditions"
            title="Condiciones de la venta"
            accent="#52766e"
            complete={fieldsAreComplete(values, ['precio', 'calidad_de'])}
            errorCount={countFieldErrors(
              errors,
              ['precio', 'calidad_de'],
              touched,
              submitCount > 0
            )}
            expanded={activeGroup === 'conditions'}
            onSelect={setActiveGroup}
          >
            <Grid container spacing={2}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  {...fieldProps('precio', values, touched, errors)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  inputProps={{ inputMode: 'decimal' }}
                  label="Precio de venta"
                  onBlur={handleBlur}
                  onChange={(event) =>
                    setFieldValue('precio', cleanCurrency(event.target.value))
                  }
                  placeholder="0.00"
                  type="text"
                  value={formatCurrency(values.precio)}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  {...fieldProps('calidad_de', values, touched, errors)}
                  label="Calidad de entrega"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  select
                >
                  <MenuItem value="Propiedad">Propiedad</MenuItem>
                  <MenuItem value="Prenda">Prenda</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </ProgressiveFieldGroup>
          <ProgressiveFieldGroup
            id="signing"
            title="Lugar y momento de firma"
            description="Seleccione municipio y distrito según la reorganización territorial vigente."
            accent="#2f7c70"
            complete={fieldsAreComplete(values, signingFields)}
            errorCount={countFieldErrors(
              errors,
              signingFields,
              touched,
              submitCount > 0
            )}
            expanded={activeGroup === 'signing'}
            onSelect={setActiveGroup}
          >
            <Grid container spacing={2}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  {...fieldProps('departamento', values, touched, errors)}
                  label="Departamento"
                  onBlur={handleBlur}
                  onChange={(event) => {
                    handleChange(event);
                    setFieldValue('municipio', '');
                    setFieldValue('domicilio', '');
                  }}
                  select
                >
                  {Object.keys(DataTerritorialDivision).map((option) => (
                    <MenuItem value={option} key={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  {...fieldProps('municipio', values, touched, errors)}
                  disabled={!values.departamento}
                  label="Municipio"
                  onBlur={handleBlur}
                  onChange={(event) => {
                    handleChange(event);
                    setFieldValue('domicilio', '');
                  }}
                  select
                >
                  {Object.keys(
                    DataTerritorialDivision[values.departamento] || {}
                  ).map((option) => (
                    <MenuItem value={option} key={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  {...fieldProps('domicilio', values, touched, errors)}
                  disabled={!values.municipio}
                  label="Distrito"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  select
                >
                  {(
                    DataTerritorialDivision[values.departamento]?.[
                      values.municipio
                    ] || []
                  ).map((option) => (
                    <MenuItem value={option} key={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Grid container spacing={1}>
                  <Grid size="grow">
                    <DateField
                      {...fieldProps('fecha_firma', values, touched, errors)}
                      label="Fecha de firma"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size="auto">
                    <Button
                      onClick={() => setFieldValue('fecha_firma', todayValue())}
                      sx={{ height: '100%' }}
                      variant="outlined"
                    >
                      Hoy
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Grid container spacing={1}>
                  <Grid size="grow">
                    <TextField
                      {...fieldProps('hora_firma', values, touched, errors)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ step: 300 }}
                      label="Hora de firma"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="time"
                    />
                  </Grid>
                  <Grid size="auto">
                    <Button
                      onClick={() =>
                        setFieldValue('hora_firma', currentTimeValue())
                      }
                      sx={{ height: '100%' }}
                      variant="outlined"
                    >
                      Ahora
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </ProgressiveFieldGroup>
          <ProgressiveFieldGroup
            id="knowledge"
            title="Identificación ante notario"
            description="Indique si el notario conoce personalmente a cada compareciente."
            accent="#8a6540"
            complete={fieldsAreComplete(values, [
              'identifica_vendedor',
              'identifica_comprador',
            ])}
            errorCount={countFieldErrors(
              errors,
              ['identifica_vendedor', 'identifica_comprador'],
              touched,
              submitCount > 0
            )}
            expanded={activeGroup === 'knowledge'}
            onSelect={setActiveGroup}
          >
            <Grid container spacing={2}>
              {[
                ['identifica_vendedor', 'El notario conoce al vendedor'],
                ['identifica_comprador', 'El notario conoce al comprador'],
              ].map(([field, label]) => (
                <Grid
                  key={field}
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Box
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 1,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values[field] === 'Sí'}
                          onChange={(event) =>
                            setFieldValue(
                              field,
                              event.target.checked ? 'Sí' : 'No'
                            )
                          }
                        />
                      }
                      label={
                        <Typography variant="body2" fontWeight={500}>
                          {label}
                        </Typography>
                      }
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </ProgressiveFieldGroup>
          <FormActions buttons={buttons} />
        </form>
      )}
    </Formik>
  );
};

export default DetailStructure;
