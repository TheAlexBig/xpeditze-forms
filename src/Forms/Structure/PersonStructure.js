import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
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
import { normalizeCatalogText } from '../../Functions/CatalogText';
import { formatDui, formatNit, normalizeDui } from '../PersonMemory';
import { PersonValidationSchema } from '../Validations/PersonValidationSchema';
import {
  countFieldErrors,
  fieldsAreComplete,
  FormActions,
  FormHeading,
  ProgressiveFieldGroup,
} from './FormScaffold';
import PersonCoreGroups from './PersonCoreGroups';

const fieldProps = (name, values, touched, errors) => ({
  error: Boolean(touched[name] && errors[name]),
  helperText: touched[name] && errors[name],
  name,
  value: values[name] ?? '',
  fullWidth: true,
});

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

const companyFields = [
  'sociedad_nombre',
  'sociedad_nacionalidad',
  'sociedad_departamento',
  'sociedad_municipio',
  'sociedad_domicilio',
  'sociedad_nit',
  'sociedad_cargo',
  'sociedad_personeria_tipo',
  'sociedad_personeria',
];

const nationalities = [
  'Salvadoreña',
  'Guatemalteca',
  'Hondureña',
  'Nicaragüense',
  'Costarricense',
  'Panameña',
  'Mexicana',
  'Estadounidense',
  'Española',
];

const representativeCapacities = [
  'Administrador Único y Representante Legal',
  'Director Único y Representante Legal',
  'Presidente de la Junta Directiva y Representante Legal',
  'Apoderado General Administrativo',
  'Apoderado Especial',
];

const authorityDocumentTypes = [
  'Escritura de constitución',
  'Credencial de elección',
  'Poder general administrativo',
  'Poder especial',
  'Otro instrumento',
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
          then: (schema) =>
            schema
              .matches(
                /^\d{4}-\d{6}-\d{3}-\d$/,
                'Use el formato 0000-000000-000-0'
              )
              .required('Campo requerido'),
        }),
        sociedad_cargo: Yup.string().when('actua_por_sociedad', {
          is: true,
          then: (schema) => schema.required('Campo requerido'),
        }),
        sociedad_personeria: Yup.string().when('actua_por_sociedad', {
          is: true,
          then: (schema) => schema.required('Campo requerido'),
        }),
        sociedad_personeria_tipo: Yup.string().when('actua_por_sociedad', {
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
          <PersonCoreGroups
            values={values}
            people={people}
            occupations={occupations}
            activeGroup={activeGroup}
            onSelectGroup={setActiveGroup}
            onChange={setFieldValue}
            onBlur={handleBlur}
            onLoadPerson={(person) =>
              setValues({
                ...data,
                ...person,
                documento: formatDui(person.documento),
              })
            }
            getError={(field) =>
              (submitCount > 0 || touched[field]) && errors[field]
            }
          />
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
                <Grid size={12}>
                  <Alert severity="info">
                    Tenga a la mano el NIT de la sociedad y el documento que
                    acredita el cargo, la vigencia y las facultades de quien
                    firma.
                  </Alert>
                </Grid>
                <Grid size={12}>
                  <Typography fontWeight={700} variant="subtitle2">
                    Datos de la sociedad
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Copie estos datos del NIT o de la escritura de constitución.
                  </Typography>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 8,
                  }}
                >
                  <TextField
                    {...fieldProps('sociedad_nombre', values, touched, errors)}
                    label="Denominación o razón social"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
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
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Autocomplete
                    freeSolo
                    inputValue={values.sociedad_nacionalidad || ''}
                    onChange={(event, value) =>
                      setFieldValue('sociedad_nacionalidad', value || '')
                    }
                    onInputChange={(event, value) =>
                      setFieldValue('sociedad_nacionalidad', value)
                    }
                    options={nationalities}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(
                          touched.sociedad_nacionalidad &&
                          errors.sociedad_nacionalidad
                        )}
                        helperText={
                          touched.sociedad_nacionalidad &&
                          errors.sociedad_nacionalidad
                        }
                        label="Nacionalidad de la sociedad"
                        name="sociedad_nacionalidad"
                        onBlur={(event) => {
                          handleBlur(event);
                          setFieldValue(
                            'sociedad_nacionalidad',
                            normalizeCatalogText(event.target.value)
                          );
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <TextField
                    {...fieldProps('sociedad_nit', values, touched, errors)}
                    label="NIT de la sociedad"
                    onBlur={handleBlur}
                    onChange={(event) =>
                      setFieldValue(
                        'sociedad_nit',
                        formatNit(event.target.value)
                      )
                    }
                    slotProps={{
                      htmlInput: { inputMode: 'numeric', maxLength: 17 },
                    }}
                    placeholder="0000-000000-000-0"
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
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
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
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
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
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
                <Grid size={12}>
                  <Typography fontWeight={700} variant="subtitle2">
                    Autorización para firmar
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Indique por qué esta persona puede actuar en nombre de la
                    sociedad.
                  </Typography>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Autocomplete
                    freeSolo
                    inputValue={values.sociedad_cargo || ''}
                    onChange={(event, value) =>
                      setFieldValue('sociedad_cargo', value || '')
                    }
                    onInputChange={(event, value) =>
                      setFieldValue('sociedad_cargo', value)
                    }
                    options={representativeCapacities}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(
                          touched.sociedad_cargo && errors.sociedad_cargo
                        )}
                        helperText={
                          touched.sociedad_cargo && errors.sociedad_cargo
                        }
                        label="Cargo o calidad con que actúa"
                        name="sociedad_cargo"
                        onBlur={(event) => {
                          handleBlur(event);
                          setFieldValue(
                            'sociedad_cargo',
                            normalizeCatalogText(event.target.value)
                          );
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <TextField
                    {...fieldProps(
                      'sociedad_personeria_tipo',
                      values,
                      touched,
                      errors
                    )}
                    label="Documento que acredita la representación"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    select
                  >
                    {authorityDocumentTypes.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={12}>
                  <TextField
                    {...fieldProps(
                      'sociedad_personeria',
                      values,
                      touched,
                      errors
                    )}
                    label="Datos del documento de representación"
                    minRows={3}
                    multiline
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Número, fecha, notario, inscripción, vigencia y facultades."
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
