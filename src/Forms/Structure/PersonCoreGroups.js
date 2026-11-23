import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DataTerritorialDivision } from '../../Data/DataTerritorialDivision';
import { formatDui, normalizeDui } from '../PersonMemory';
import DateField from './DateField';
import { ProgressiveFieldGroup } from './FormScaffold';

export const DUI_IDENTITY_TYPE = 'Documento Único de Identidad';
const ALTERNATIVE_IDENTITY_TYPES = ['Pasaporte', 'Carné de residente'];
const identityFields = ['nombre', 'apellido', 'fecha_nacimiento', 'genero'];
const documentFields = ['documento', 'departamento', 'municipio', 'domicilio'];

export const usesDuiIdentity = (identityType) =>
  identityType === DUI_IDENTITY_TYPE;

export const formatIdentityDocument = (
  value,
  identityType,
  allowAlternativeIdentity = false
) =>
  !allowAlternativeIdentity || usesDuiIdentity(identityType)
    ? formatDui(value)
    : value;

const personLabel = (person) =>
  [
    [person.nombre, person.apellido].filter(Boolean).join(' '),
    person.documento,
    person.oficio,
  ]
    .filter(Boolean)
    .join(' / ');

const complete = (values, fields) =>
  fields.every((field) => {
    const value = values[field];
    return value !== undefined && value !== null && String(value).trim() !== '';
  });

export default function PersonCoreGroups({
  values,
  people = [],
  occupations = [],
  activeGroup,
  onSelectGroup,
  onChange,
  onBlur,
  onLoadPerson,
  getError = () => '',
  allowAlternativeIdentity = false,
}) {
  const identityType = allowAlternativeIdentity
    ? values.identityType
    : DUI_IDENTITY_TYPE;
  const usesDui = !allowAlternativeIdentity || usesDuiIdentity(identityType);
  const alternativeSelection = ALTERNATIVE_IDENTITY_TYPES.includes(identityType)
    ? identityType
    : 'OTHER';
  const municipalities = Object.keys(
    DataTerritorialDivision[values.departamento] || {}
  );
  const districts =
    DataTerritorialDivision[values.departamento]?.[values.municipio] || [];
  const occupationOptions = occupations.length
    ? occupations
    : [...new Set(people.map((person) => person.oficio).filter(Boolean))];
  const errorCount = (fields) =>
    fields.filter((field) => Boolean(getError(field))).length;
  const fieldProps = (name) => ({
    error: Boolean(getError(name)),
    helperText: getError(name),
    name,
    value: values[name] ?? '',
    fullWidth: true,
  });

  return (
    <>
      {people.length > 0 && (
        <ProgressiveFieldGroup
          id="saved"
          title="Persona guardada"
          description="Busque por nombre, DUI u oficio para reutilizar datos anteriores."
          accent="#17695d"
          expanded={activeGroup === 'saved'}
          onSelect={onSelectGroup}
          optional
        >
          <Autocomplete
            options={people}
            getOptionLabel={personLabel}
            isOptionEqualToValue={(option, value) =>
              normalizeDui(option.documento) === normalizeDui(value.documento)
            }
            onChange={(event, person) => {
              if (person) {
                onLoadPerson(person);
                onSelectGroup('identity');
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
                    {[person.nombre, person.apellido].filter(Boolean).join(' ')}
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
        complete={complete(values, identityFields)}
        errorCount={errorCount(identityFields)}
        expanded={activeGroup === 'identity'}
        onSelect={onSelectGroup}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...fieldProps('nombre')}
              label="Nombres"
              onBlur={onBlur}
              onChange={(event) => onChange('nombre', event.target.value)}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...fieldProps('apellido')}
              label="Apellidos"
              onBlur={onBlur}
              onChange={(event) => onChange('apellido', event.target.value)}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DateField
              {...fieldProps('fecha_nacimiento')}
              label="Fecha de nacimiento"
              onBlur={onBlur}
              onChange={(event) =>
                onChange('fecha_nacimiento', event.target.value)
              }
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...fieldProps('genero')}
              label="Género"
              onBlur={onBlur}
              onChange={(event) => onChange('genero', event.target.value)}
              required
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
        description={
          allowAlternativeIdentity
            ? 'Seleccione la identificación y registre el domicilio vigente.'
            : 'El DUI y la división territorial vigente se incorporarán al contrato.'
        }
        accent="#8a6540"
        complete={
          complete(values, documentFields) &&
          (!allowAlternativeIdentity || Boolean(identityType))
        }
        errorCount={errorCount([
          ...documentFields,
          ...(allowAlternativeIdentity ? ['identityType'] : []),
        ])}
        expanded={activeGroup === 'documents'}
        onSelect={onSelectGroup}
      >
        <Grid container spacing={2}>
          {allowAlternativeIdentity && (
            <Grid size={12}>
              <FormControl>
                <FormLabel id="uses-dui-label">
                  ¿Usará DUI como documento de identificación?
                </FormLabel>
                <RadioGroup
                  aria-labelledby="uses-dui-label"
                  row
                  value={usesDui ? 'yes' : 'no'}
                  onChange={(event) => {
                    onChange(
                      'identityType',
                      event.target.value === 'yes' ? DUI_IDENTITY_TYPE : ''
                    );
                    onChange('documento', '');
                  }}
                >
                  <FormControlLabel
                    control={<Radio />}
                    label="Sí"
                    value="yes"
                  />
                  <FormControlLabel control={<Radio />} label="No" value="no" />
                </RadioGroup>
              </FormControl>
            </Grid>
          )}
          {allowAlternativeIdentity && !usesDui && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  error={
                    alternativeSelection !== 'OTHER' &&
                    Boolean(getError('identityType'))
                  }
                  fullWidth
                  helperText={
                    alternativeSelection !== 'OTHER'
                      ? getError('identityType')
                      : ''
                  }
                  label="Tipo de identificación"
                  onChange={(event) => {
                    onChange(
                      'identityType',
                      event.target.value === 'OTHER' ? '' : event.target.value
                    );
                    onChange('documento', '');
                  }}
                  required
                  select
                  value={alternativeSelection}
                >
                  {ALTERNATIVE_IDENTITY_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                  <MenuItem value="OTHER">Otro</MenuItem>
                </TextField>
              </Grid>
              {alternativeSelection === 'OTHER' && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    error={Boolean(getError('identityType'))}
                    fullWidth
                    helperText={getError('identityType')}
                    label="Nombre del tipo de identificación"
                    onChange={(event) =>
                      onChange('identityType', event.target.value)
                    }
                    required
                    value={identityType || ''}
                  />
                </Grid>
              )}
            </>
          )}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...fieldProps('documento')}
              label={
                usesDui
                  ? 'DUI'
                  : `Número de ${identityType || 'identificación'}`
              }
              onBlur={onBlur}
              onChange={(event) =>
                onChange(
                  'documento',
                  formatIdentityDocument(
                    event.target.value,
                    identityType,
                    allowAlternativeIdentity
                  )
                )
              }
              placeholder={usesDui ? '00000000-0' : ''}
              required
              slotProps={{
                htmlInput: usesDui
                  ? { inputMode: 'numeric', maxLength: 10 }
                  : undefined,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...fieldProps('departamento')}
              label="Departamento"
              onBlur={onBlur}
              onChange={(event) => {
                onChange('departamento', event.target.value);
                onChange('municipio', '');
                onChange('domicilio', '');
              }}
              required
              select
            >
              {Object.keys(DataTerritorialDivision).map((option) => (
                <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...fieldProps('municipio')}
              disabled={!values.departamento}
              label="Municipio"
              onBlur={onBlur}
              onChange={(event) => {
                onChange('municipio', event.target.value);
                onChange('domicilio', '');
              }}
              required
              select
            >
              {municipalities.map((option) => (
                <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...fieldProps('domicilio')}
              disabled={!values.municipio}
              label="Distrito"
              onBlur={onBlur}
              onChange={(event) => onChange('domicilio', event.target.value)}
              required
              select
            >
              {districts.map((option) => (
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
        complete={complete(values, ['oficio'])}
        errorCount={errorCount(['oficio'])}
        expanded={activeGroup === 'activity'}
        onSelect={onSelectGroup}
      >
        <Autocomplete
          freeSolo
          inputValue={values.oficio || ''}
          onChange={(event, newValue) => onChange('oficio', newValue || '')}
          onInputChange={(event, newInputValue) =>
            onChange('oficio', newInputValue)
          }
          options={occupationOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              error={Boolean(getError('oficio'))}
              fullWidth
              helperText={getError('oficio')}
              label="Oficio o profesión"
              name="oficio"
              onBlur={onBlur}
              required
            />
          )}
        />
      </ProgressiveFieldGroup>
    </>
  );
}
