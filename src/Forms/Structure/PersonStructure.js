import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { DataTerritorialDivision } from '../../Data/DataTerritorialDivision';
import { formatDui, normalizeDui } from '../PersonMemory';
import { PersonValidationSchema } from '../Validations/PersonValidationSchema';
import {
  countFieldErrors,
  fieldsAreComplete,
  FormActions,
  FormHeading,
  ProgressiveFieldGroup,
} from './FormScaffold';
import DateField from './DateField';

const fieldProps = (name, values, touched, errors) => ({
  error: Boolean(touched[name] && errors[name]),
  helperText: touched[name] && errors[name],
  name,
  value: values[name] ?? '',
  fullWidth: true,
});

const personLabel = (person) =>
  [
    [person.nombre, person.apellido].filter(Boolean).join(' '),
    person.documento,
    person.oficio,
  ]
    .filter(Boolean)
    .join(' / ');

const personSummary = (values) => [
  {
    label: 'Persona',
    value: [values.nombre, values.apellido].filter(Boolean).join(' '),
  },
  { label: 'DUI', value: values.documento },
  { label: 'Oficio', value: values.oficio },
];

const isExcludedDui = (excludedDui, value) =>
  (Array.isArray(excludedDui) ? excludedDui : [excludedDui])
    .map(normalizeDui)
    .filter(Boolean)
    .includes(normalizeDui(value));

const identityFields = ['nombre', 'apellido', 'fecha_nacimiento', 'genero'];
const documentFields = ['documento', 'departamento', 'municipio', 'domicilio'];
const companyFields = [
  'sociedad_nombre',
  'sociedad_nacionalidad',
  'sociedad_departamento',
  'sociedad_municipio',
  'sociedad_domicilio',
  'sociedad_nit',
  'sociedad_cargo',
  'sociedad_personeria',
];

const PersonStructure = ({
  data,
  title,
  buttons,
  submitAction,
  error = '',
  people = [],
  occupations = [],
  excludedDui = '',
}) => {
  const [activeGroup, setActiveGroup] = useState(
    people.length > 0 ? 'saved' : 'identity'
  );

  return (
    <Formik
      enableReinitialize
      initialValues={data}
      onSubmit={submitAction}
      validationSchema={Yup.object().shape({
        ...PersonValidationSchema,
        actua_por_sociedad: Yup.boolean(),
        sociedad_nombre: Yup.string().when('actua_por_sociedad', {
          is: true,
          then: (schema) => schema.required('Campo requerido'),
        }),
        sociedad_nacionalidad: Yup.string().when('actua_por_sociedad', {
          is: true,
          then: (schema) => schema.required('Campo requerido'),
        }),
        sociedad_departamento: Yup.string().when('actua_por_sociedad', {
          is: true,
          then: (schema) => schema.required('Campo requerido'),
        }),
        sociedad_municipio: Yup.string().when('actua_por_sociedad', {
          is: true,
          then: (schema) => schema.required('Campo requerido'),
        }),
        sociedad_domicilio: Yup.string().when('actua_por_sociedad', {
          is: true,
          then: (schema) => schema.required('Campo requerido'),
        }),
        sociedad_nit: Yup.string().when('actua_por_sociedad', {
          is: true,
          then: (schema) => schema.required('Campo requerido'),
        }),
        sociedad_cargo: Yup.string().when('actua_por_sociedad', {
          is: true,
          then: (schema) => schema.required('Campo requerido'),
        }),
        sociedad_personeria: Yup.string().when('actua_por_sociedad', {
          is: true,
          then: (schema) => schema.required('Campo requerido'),
        }),
        documento: PersonValidationSchema.documento.test(
          'different-party-dui',
          'Los comparecientes deben tener DUI diferentes',
          (value) => !isExcludedDui(excludedDui, value)
        ),
      })}
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
        setValues,
      }) => (
        <form onSubmit={handleSubmit} noValidate>
          <FormHeading
            title={title}
            description="Ingrese la información tal como aparece en los documentos de identidad."
            eyebrow="Datos personales"
            summary={personSummary(values)}
          />
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {people.length > 0 && (
            <ProgressiveFieldGroup
              id="saved"
              title="Persona guardada"
              description="Busque por nombre, DUI u oficio para reutilizar datos anteriores."
              accent="#17695d"
              expanded={activeGroup === 'saved'}
              onSelect={setActiveGroup}
              optional
            >
              <Autocomplete
                options={people}
                getOptionLabel={personLabel}
                isOptionEqualToValue={(option, value) =>
                  normalizeDui(option.documento) ===
                  normalizeDui(value.documento)
                }
                onChange={(event, person) => {
                  if (person) {
                    setValues({
                      ...data,
                      ...person,
                      documento: formatDui(person.documento),
                    });
                    setActiveGroup('identity');
                  }
                }}
                renderOption={(props, person) => (
                  <Box
                    component="li"
                    {...props}
                    key={normalizeDui(person.documento)}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={650} variant="body2">
                        {[person.nombre, person.apellido]
                          .filter(Boolean)
                          .join(' ')}
                      </Typography>
                      <Typography color="text.secondary" variant="caption">
                        {person.documento} / {person.oficio}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Buscar persona guardada"
                  />
                )}
              />
            </ProgressiveFieldGroup>
          )}
          <ProgressiveFieldGroup
            id="identity"
            title="Identidad personal"
            accent="#2f7c70"
            complete={fieldsAreComplete(values, identityFields)}
            errorCount={countFieldErrors(
              errors,
              identityFields,
              touched,
              submitCount > 0
            )}
            expanded={activeGroup === 'identity'}
            onSelect={setActiveGroup}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...fieldProps('nombre', values, touched, errors)}
                  label="Nombres"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...fieldProps('apellido', values, touched, errors)}
                  label="Apellidos"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateField
                  {...fieldProps('fecha_nacimiento', values, touched, errors)}
                  label="Fecha de nacimiento"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...fieldProps('genero', values, touched, errors)}
                  label="Género"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  select
                >
                  <MenuItem value="Femenino">Femenino</MenuItem>
                  <MenuItem value="Masculino">Masculino</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </ProgressiveFieldGroup>
          <ProgressiveFieldGroup
            id="documents"
            title="Documentos y domicilio"
            description="El DUI y la división territorial vigente se incorporarán al contrato."
            accent="#8a6540"
            complete={fieldsAreComplete(values, documentFields)}
            errorCount={countFieldErrors(
              errors,
              documentFields,
              touched,
              submitCount > 0
            )}
            expanded={activeGroup === 'documents'}
            onSelect={setActiveGroup}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...fieldProps('documento', values, touched, errors)}
                  label="DUI"
                  onBlur={handleBlur}
                  onChange={(event) => {
                    setFieldValue('documento', formatDui(event.target.value));
                  }}
                  placeholder="00000000-0"
                  inputProps={{
                    inputMode: 'numeric',
                    maxLength: 10,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
            </Grid>
          </ProgressiveFieldGroup>
          <ProgressiveFieldGroup
            id="activity"
            title="Actividad"
            accent="#b37d24"
            complete={fieldsAreComplete(values, ['oficio'])}
            errorCount={countFieldErrors(
              errors,
              ['oficio'],
              touched,
              submitCount > 0
            )}
            expanded={activeGroup === 'activity'}
            onSelect={setActiveGroup}
          >
            <Autocomplete
              freeSolo
              inputValue={values.oficio || ''}
              onChange={(event, newValue) => {
                setFieldValue('oficio', newValue || '');
              }}
              onInputChange={(event, newInputValue) => {
                setFieldValue('oficio', newInputValue);
              }}
              options={occupations}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(touched.oficio && errors.oficio)}
                  fullWidth
                  helperText={touched.oficio && errors.oficio}
                  label="Oficio o profesión"
                  name="oficio"
                  onBlur={handleBlur}
                />
              )}
            />
          </ProgressiveFieldGroup>
          <ProgressiveFieldGroup
            id="representation"
            title="Representación de sociedad"
            description="Active esta opción cuando la persona comparece en nombre de una sociedad."
            accent="#52766e"
            complete={
              !values.actua_por_sociedad ||
              fieldsAreComplete(values, companyFields)
            }
            errorCount={countFieldErrors(
              errors,
              companyFields,
              touched,
              submitCount > 0
            )}
            expanded={activeGroup === 'representation'}
            onSelect={setActiveGroup}
          >
            <FormControl component="fieldset">
              <FormLabel component="legend">
                ¿Esta persona firma en nombre de una sociedad?
              </FormLabel>
              <RadioGroup
                name="actua_por_sociedad"
                onChange={(event) => {
                  setFieldValue(
                    'actua_por_sociedad',
                    event.target.value === 'si'
                  );
                }}
                row
                value={values.actua_por_sociedad ? 'si' : 'no'}
              >
                <FormControlLabel
                  control={<Radio />}
                  label="No, firma en nombre propio"
                  value="no"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Sí, representa una sociedad"
                  value="si"
                />
              </RadioGroup>
            </FormControl>
            {values.actua_por_sociedad && (
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                  <Alert severity="info">
                    Tenga a la mano el NIT de la sociedad y el documento que
                    acredita el cargo, la vigencia y las facultades de quien
                    firma.
                  </Alert>
                </Grid>
                <Grid item xs={12}>
                  <Typography fontWeight={700} variant="subtitle2">
                    Datos de la sociedad
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Copie estos datos del NIT o de la escritura de constitución.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    {...fieldProps('sociedad_nombre', values, touched, errors)}
                    label="Denominación o razón social"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    {...fieldProps(
                      'sociedad_abreviatura',
                      values,
                      touched,
                      errors
                    )}
                    label="Nombre abreviado (opcional)"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...fieldProps(
                      'sociedad_nacionalidad',
                      values,
                      touched,
                      errors
                    )}
                    label="Nacionalidad de la sociedad"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...fieldProps('sociedad_nit', values, touched, errors)}
                    label="NIT de la sociedad"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...fieldProps(
                      'sociedad_departamento',
                      values,
                      touched,
                      errors
                    )}
                    label="Departamento de la sociedad"
                    onBlur={handleBlur}
                    onChange={(event) => {
                      handleChange(event);
                      setFieldValue('sociedad_municipio', '');
                      setFieldValue('sociedad_domicilio', '');
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...fieldProps(
                      'sociedad_municipio',
                      values,
                      touched,
                      errors
                    )}
                    disabled={!values.sociedad_departamento}
                    label="Municipio de la sociedad"
                    onBlur={handleBlur}
                    onChange={(event) => {
                      handleChange(event);
                      setFieldValue('sociedad_domicilio', '');
                    }}
                    select
                  >
                    {Object.keys(
                      DataTerritorialDivision[values.sociedad_departamento] ||
                        {}
                    ).map((option) => (
                      <MenuItem value={option} key={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...fieldProps(
                      'sociedad_domicilio',
                      values,
                      touched,
                      errors
                    )}
                    disabled={!values.sociedad_municipio}
                    label="Distrito de la sociedad"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    select
                  >
                    {(
                      DataTerritorialDivision[values.sociedad_departamento]?.[
                        values.sociedad_municipio
                      ] || []
                    ).map((option) => (
                      <MenuItem value={option} key={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Typography fontWeight={700} variant="subtitle2">
                    Autorización para firmar
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Indique por qué esta persona puede actuar en nombre de la
                    sociedad.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...fieldProps('sociedad_cargo', values, touched, errors)}
                    label="Cargo o calidad con que actúa"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Administrador Único y Representante Legal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...fieldProps(
                      'sociedad_personeria',
                      values,
                      touched,
                      errors
                    )}
                    label="Documento que demuestra que puede firmar por la sociedad"
                    minRows={4}
                    multiline
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Describa el instrumento, fecha, notario, inscripción, vigencia y facultades."
                  />
                </Grid>
              </Grid>
            )}
          </ProgressiveFieldGroup>
          <FormActions buttons={buttons} />
        </form>
      )}
    </Formik>
  );
};

export default PersonStructure;
