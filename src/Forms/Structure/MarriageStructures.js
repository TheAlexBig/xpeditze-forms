import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DataTerritorialDivision } from '../../Data/DataTerritorialDivision';
import GetAge from '../../Functions/GetAge';
import { currentTimeValue, todayValue } from '../../Functions/DateTimeValues';
import { emptyMarriageWitness } from '../MarriageState';
import { formatDui } from '../PersonMemory';
import {
  FormActions,
  FormHeading,
  ProgressiveFieldGroup,
} from './FormScaffold';
import DateField from './DateField';

const actions = (back) => [
  { type: 'button', text: 'Atrás', variant: 'outlined', action: back },
  { type: 'submit', text: 'Guardar y continuar', variant: 'contained' },
];

const update = (setValues, name) => (event) => {
  const value =
    event.target.type === 'checkbox'
      ? event.target.checked
      : event.target.value;
  setValues((current) => ({ ...current, [name]: value }));
};

const errorProps = (errors = {}, path) => ({
  error: Boolean(errors[path]),
  helperText: errors[path],
});
const errorColor = (errors = {}, path) =>
  errors[path] ? { color: 'error.main' } : undefined;
const prefixErrorCount = (errors = {}, prefixes = []) =>
  Object.keys(errors).filter((path) =>
    prefixes.some((prefix) => path.startsWith(prefix))
  ).length;
const valuesComplete = (values, fields) =>
  Boolean(values) &&
  fields.every((field) => {
    const value = values[field];
    return value !== undefined && value !== null && String(value).trim() !== '';
  });

const IDENTITY_TYPES = [
  'Documento Único de Identidad',
  'Pasaporte',
  'Carné de residente',
];

const SectionErrors = ({ errors = {}, prefixes = [] }) => {
  const messages = [
    ...new Set(
      Object.entries(errors)
        .filter(([path]) => prefixes.some((prefix) => path.startsWith(prefix)))
        .map(([, message]) => message)
    ),
  ];
  return messages.length ? (
    <Alert severity="error" sx={{ mb: 2 }}>
      <strong>Revise lo siguiente:</strong>
      <ul>
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </Alert>
  ) : null;
};

const PersonFields = ({
  values,
  setValues,
  people = [],
  identityFlexible = false,
  partyDetails = false,
  errors = {},
  errorPrefix,
  section = 'all',
}) => {
  const load = (event) => {
    const person = people.find((item) => item.id === event.target.value);
    if (person)
      setValues((current) => ({
        ...current,
        ...person,
        edad: GetAge(person.fecha_nacimiento),
      }));
  };
  const municipalities = Object.keys(
    DataTerritorialDivision[values.departamento] || {}
  );
  const districts =
    DataTerritorialDivision[values.departamento]?.[values.municipio] || [];
  const knownIdentityType = IDENTITY_TYPES.includes(values.identityType);
  const identitySelection = knownIdentityType ? values.identityType : 'OTHER';
  const usesDui = values.identityType === 'Documento Único de Identidad';
  const showPersonal = section === 'all' || section === 'personal';
  const showIdentification = section === 'all' || section === 'identification';
  const showDomicile = section === 'all' || section === 'domicile';
  return (
    <>
      {showPersonal && (
        <>
          {people.length > 0 && (
            <Grid size={12}>
              <TextField
                fullWidth
                label="Cargar persona guardada"
                onChange={load}
                select
                size="small"
                value=""
              >
                {people.map((person) => (
                  <MenuItem
                    key={person.id || person.documento}
                    value={person.id}
                  >
                    {person.nombre} {person.apellido} — {person.documento}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          {[
            ['nombre', 'Nombres'],
            ['apellido', 'Apellidos'],
          ].map(([name, label]) => (
            <Grid
              key={name}
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                fullWidth
                required
                label={label}
                value={values[name]}
                onChange={update(setValues, name)}
                {...errorProps(errors, `${errorPrefix}.${name}`)}
              />
            </Grid>
          ))}
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <DateField
              fullWidth
              required
              label="Fecha de nacimiento"
              name="fecha_nacimiento"
              value={values.fecha_nacimiento}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  fecha_nacimiento: event.target.value,
                  edad: GetAge(event.target.value),
                }))
              }
              {...errorProps(errors, `${errorPrefix}.fecha_nacimiento`)}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <TextField
              fullWidth
              required
              select
              label="Género"
              value={values.genero}
              onChange={update(setValues, 'genero')}
              {...errorProps(errors, `${errorPrefix}.genero`)}
            >
              <MenuItem value="Femenino">Femenino</MenuItem>
              <MenuItem value="Masculino">Masculino</MenuItem>
            </TextField>
          </Grid>
          {partyDetails && (
            <Grid
              size={{
                xs: 12,
                sm: 4,
              }}
            >
              <TextField
                fullWidth
                required
                select
                label="Estado familiar"
                value={values.familyStatus}
                onChange={update(setValues, 'familyStatus')}
                {...errorProps(errors, `${errorPrefix}.familyStatus`)}
              >
                <MenuItem value="SINGLE">Soltero</MenuItem>
                <MenuItem value="DIVORCED">Divorciado</MenuItem>
                <MenuItem value="WIDOWED">Viudo</MenuItem>
                <MenuItem value="MARRIED">Casado con vínculo vigente</MenuItem>
              </TextField>
            </Grid>
          )}
          {partyDetails && (
            <Grid
              size={{
                xs: 12,
                sm: 4,
              }}
            >
              <TextField
                fullWidth
                required
                label="Nacionalidad"
                value={values.nationality}
                onChange={update(setValues, 'nationality')}
                {...errorProps(errors, `${errorPrefix}.nationality`)}
              />
            </Grid>
          )}
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <TextField
              fullWidth
              required
              label="Profesión u oficio"
              value={values.oficio}
              onChange={update(setValues, 'oficio')}
              {...errorProps(errors, `${errorPrefix}.oficio`)}
            />
          </Grid>
          {partyDetails && (
            <Grid
              size={{
                xs: 12,
                sm: 4,
              }}
            >
              <TextField
                fullWidth
                required
                label="Lugar de nacimiento"
                value={values.birthPlace}
                onChange={update(setValues, 'birthPlace')}
                {...errorProps(errors, `${errorPrefix}.birthPlace`)}
              />
            </Grid>
          )}
        </>
      )}
      {showIdentification && (
        <>
          <Grid size={12}>
            <Typography color="text.secondary" fontWeight={700} variant="body2">
              Identificación
            </Typography>
          </Grid>
          {partyDetails && (
            <Grid
              size={{
                xs: 12,
                sm: knownIdentityType ? 6 : 4,
              }}
            >
              <TextField
                fullWidth
                required
                select
                label="Tipo de identificación"
                value={identitySelection}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    identityType:
                      event.target.value === 'OTHER' ? '' : event.target.value,
                    documento: '',
                  }))
                }
                {...(knownIdentityType
                  ? errorProps(errors, `${errorPrefix}.identityType`)
                  : {})}
              >
                {IDENTITY_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
                <MenuItem value="OTHER">Otro</MenuItem>
              </TextField>
            </Grid>
          )}
          {partyDetails && !knownIdentityType && (
            <Grid
              size={{
                xs: 12,
                sm: 4,
              }}
            >
              <TextField
                fullWidth
                required
                label="Nombre del tipo de identificación"
                value={values.identityType}
                onChange={update(setValues, 'identityType')}
                {...errorProps(errors, `${errorPrefix}.identityType`)}
              />
            </Grid>
          )}
          <Grid
            size={{
              xs: 12,
              sm: partyDetails && knownIdentityType ? 6 : 4,
            }}
          >
            <TextField
              fullWidth
              required
              label={
                usesDui || !identityFlexible
                  ? 'DUI'
                  : `Número de ${values.identityType || 'identificación'}`
              }
              error={Boolean(errors[`${errorPrefix}.documento`])}
              helperText={
                errors[`${errorPrefix}.documento`] ||
                (usesDui || !identityFlexible
                  ? 'Formato DUI: 00000000-0'
                  : 'Escriba el número tal como aparece en el documento')
              }
              value={values.documento}
              onChange={(event) => {
                setValues((current) => ({
                  ...current,
                  documento:
                    usesDui || !identityFlexible
                      ? formatDui(event.target.value)
                      : event.target.value,
                }));
              }}
              placeholder={usesDui || !identityFlexible ? '00000000-0' : ''}
              inputProps={
                usesDui || !identityFlexible
                  ? { inputMode: 'numeric', maxLength: 10 }
                  : undefined
              }
            />
          </Grid>
          {partyDetails &&
            ['DIVORCED', 'WIDOWED'].includes(values.familyStatus) && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  required
                  label={
                    values.familyStatus === 'DIVORCED'
                      ? 'Certificación de divorcio o sentencia de nulidad'
                      : 'Certificación de defunción del cónyuge anterior'
                  }
                  value={values.familyStatusDocument}
                  onChange={update(setValues, 'familyStatusDocument')}
                  {...errorProps(errors, `${errorPrefix}.familyStatusDocument`)}
                />
              </Grid>
            )}
        </>
      )}
      {showDomicile && (
        <>
          <Grid size={12}>
            <Typography color="text.secondary" fontWeight={700} variant="body2">
              Domicilio
            </Typography>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <TextField
              fullWidth
              required
              select
              label="Departamento"
              value={values.departamento}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  departamento: event.target.value,
                  municipio: '',
                  domicilio: '',
                }))
              }
              {...errorProps(errors, `${errorPrefix}.departamento`)}
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
              sm: 4,
            }}
          >
            <TextField
              fullWidth
              required
              select
              disabled={!values.departamento}
              label="Municipio"
              value={values.municipio}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  municipio: event.target.value,
                  domicilio: '',
                }))
              }
              {...errorProps(errors, `${errorPrefix}.municipio`)}
            >
              {municipalities.map((option) => (
                <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <TextField
              fullWidth
              required
              select
              disabled={!values.municipio}
              label="Distrito"
              value={values.domicilio}
              onChange={update(setValues, 'domicilio')}
              {...errorProps(errors, `${errorPrefix}.domicilio`)}
            >
              {districts.map((option) => (
                <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </>
      )}
    </>
  );
};

export function MarriagePartyStructure({
  title,
  values,
  setValues,
  people,
  savePerson,
  premaritalDate,
  errors,
  errorPrefix,
  onValidate,
  onBack,
  onNext,
}) {
  const [activeGroup, setActiveGroup] = useState('personal');
  const submit = async (event) => {
    event.preventDefault();
    if (!onValidate()) return;
    const saved = await savePerson(values);
    if (saved !== false) onNext();
  };
  return (
    <form onSubmit={submit} noValidate>
      <FormHeading
        title={title}
        eyebrow="Contrayente"
        description="Datos personales, filiación y documentos del expediente."
      />
      <SectionErrors errors={errors} prefixes={[`${errorPrefix}.`]} />
      <ProgressiveFieldGroup
        id="personal"
        title="Datos personales"
        expanded={activeGroup === 'personal'}
        onSelect={setActiveGroup}
        errorCount={prefixErrorCount(errors, [
          `${errorPrefix}.nombre`,
          `${errorPrefix}.apellido`,
          `${errorPrefix}.fecha_nacimiento`,
          `${errorPrefix}.genero`,
          `${errorPrefix}.familyStatus`,
          `${errorPrefix}.nationality`,
          `${errorPrefix}.oficio`,
          `${errorPrefix}.birthPlace`,
        ])}
        complete={valuesComplete(values, [
          'nombre',
          'apellido',
          'fecha_nacimiento',
          'genero',
          'familyStatus',
          'nationality',
          'oficio',
          'birthPlace',
        ])}
      >
        <Grid container spacing={2}>
          <PersonFields
            values={values}
            setValues={setValues}
            people={people}
            identityFlexible
            partyDetails
            errors={errors}
            errorPrefix={errorPrefix}
            section="personal"
          />
        </Grid>
      </ProgressiveFieldGroup>
      <ProgressiveFieldGroup
        id="identification"
        title="Identificación"
        expanded={activeGroup === 'identification'}
        onSelect={setActiveGroup}
        errorCount={prefixErrorCount(errors, [
          `${errorPrefix}.identityType`,
          `${errorPrefix}.documento`,
          `${errorPrefix}.familyStatusDocument`,
        ])}
        complete={valuesComplete(values, ['identityType', 'documento'])}
      >
        <Grid container spacing={2}>
          <PersonFields
            values={values}
            setValues={setValues}
            identityFlexible
            partyDetails
            errors={errors}
            errorPrefix={errorPrefix}
            section="identification"
          />
        </Grid>
      </ProgressiveFieldGroup>
      <ProgressiveFieldGroup
        id="domicile"
        title="Domicilio"
        expanded={activeGroup === 'domicile'}
        onSelect={setActiveGroup}
        errorCount={prefixErrorCount(errors, [
          `${errorPrefix}.departamento`,
          `${errorPrefix}.municipio`,
          `${errorPrefix}.domicilio`,
        ])}
        complete={valuesComplete(values, [
          'departamento',
          'municipio',
          'domicilio',
        ])}
      >
        <Grid container spacing={2}>
          <PersonFields
            values={values}
            setValues={setValues}
            errors={errors}
            errorPrefix={errorPrefix}
            section="domicile"
          />
        </Grid>
      </ProgressiveFieldGroup>
      <ProgressiveFieldGroup
        id="parents"
        title="Padres"
        expanded={activeGroup === 'parents'}
        onSelect={setActiveGroup}
        errorCount={prefixErrorCount(errors, [
          `${errorPrefix}.mother`,
          `${errorPrefix}.father`,
        ])}
        complete={valuesComplete(values, [
          'motherName',
          'motherJob',
          'motherSettlement',
          'fatherName',
          'fatherJob',
          'fatherSettlement',
        ])}
      >
        <Grid container spacing={2}>
          {[
            ['motherName', 'Nombre de la madre'],
            ['motherJob', 'Oficio de la madre'],
            ['motherSettlement', 'Domicilio de la madre'],
            ['fatherName', 'Nombre del padre'],
            ['fatherJob', 'Oficio del padre'],
            ['fatherSettlement', 'Domicilio del padre'],
          ].map(([name, label]) => (
            <Grid
              key={name}
              size={{
                xs: 12,
                sm: 4,
              }}
            >
              <TextField
                fullWidth
                required
                label={label}
                value={values[name]}
                onChange={update(setValues, name)}
                {...errorProps(errors, `${errorPrefix}.${name}`)}
              />
            </Grid>
          ))}
        </Grid>
      </ProgressiveFieldGroup>
      <ProgressiveFieldGroup
        id="birth-certificate"
        title="Partida de nacimiento"
        description="Debe haberse expedido dentro de los dos meses anteriores al acta prematrimonial."
        expanded={activeGroup === 'birth-certificate'}
        onSelect={setActiveGroup}
        errorCount={prefixErrorCount(errors, [
          `${errorPrefix}.birthCertificate`,
        ])}
        complete={valuesComplete(values, [
          'birthCertificateNumber',
          'birthCertificateRegistry',
          'birthCertificateIssueDate',
          'birthCertificateIssuedBy',
        ])}
      >
        <Grid container spacing={2}>
          {[
            ['birthCertificateNumber', 'Número', true],
            ['birthCertificateFolio', 'Folio', false],
            ['birthCertificateBook', 'Libro', false],
            ['birthCertificateRegistry', 'Registro del Estado Familiar', true],
          ].map(([name, label, required]) => (
            <Grid
              key={name}
              size={{
                xs: 12,
                sm: name.includes('Registry') ? 12 : 4,
              }}
            >
              <TextField
                fullWidth
                required={required}
                label={label}
                value={values[name]}
                onChange={update(setValues, name)}
                {...errorProps(errors, `${errorPrefix}.${name}`)}
              />
            </Grid>
          ))}
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <DateField
              fullWidth
              required
              label="Fecha de expedición"
              inputProps={{ max: premaritalDate }}
              name="birthCertificateIssueDate"
              value={values.birthCertificateIssueDate}
              onChange={update(setValues, 'birthCertificateIssueDate')}
              {...errorProps(
                errors,
                `${errorPrefix}.birthCertificateIssueDate`
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
              fullWidth
              required
              label="Expedida por"
              value={values.birthCertificateIssuedBy}
              onChange={update(setValues, 'birthCertificateIssuedBy')}
              {...errorProps(errors, `${errorPrefix}.birthCertificateIssuedBy`)}
            />
          </Grid>
        </Grid>
      </ProgressiveFieldGroup>
      <ProgressiveFieldGroup
        id="legal"
        title="Validación legal"
        description="Marque únicamente situaciones que existan. Revisión final corresponde al notario."
        expanded={activeGroup === 'legal'}
        onSelect={setActiveGroup}
        errorCount={prefixErrorCount(errors, [
          `${errorPrefix}.canConsent`,
          `${errorPrefix}.currentMarriage`,
          `${errorPrefix}.prohibited`,
        ])}
        complete={Boolean(values.canConsent)}
      >
        <Stack>
          <FormControlLabel
            sx={errorColor(errors, `${errorPrefix}.canConsent`)}
            control={
              <Checkbox
                checked={values.canConsent}
                onChange={update(setValues, 'canConsent')}
              />
            }
            label="Puede expresar consentimiento inequívoco"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={values.speaksSpanish}
                onChange={update(setValues, 'speaksSpanish')}
              />
            }
            label="Se expresa en castellano"
          />
          {[
            ['currentMarriage', 'Existe vínculo matrimonial vigente'],
            ['prohibitedKinship', 'Existe parentesco impediente'],
            [
              'prohibitedAdoptionRelationship',
              'Existe relación de adopción impediente',
            ],
            [
              'spouseHomicideRestriction',
              'Existe restricción por homicidio del cónyuge anterior',
            ],
            [
              'tutorRestriction',
              'Existe relación tutor o pupilo pendiente de revisión',
            ],
          ].map(([name, label]) => (
            <FormControlLabel
              key={name}
              sx={errorColor(errors, `${errorPrefix}.${name}`)}
              control={
                <Checkbox
                  checked={values[name]}
                  onChange={update(setValues, name)}
                />
              }
              label={label}
            />
          ))}
        </Stack>
      </ProgressiveFieldGroup>
      <FormActions buttons={actions(onBack)} />
    </form>
  );
}

export function MarriageDecisionsStructure({
  values,
  setValues,
  recognizedChildren,
  setRecognizedChildren,
  interpreterRequired,
  people,
  errors,
  onValidate,
  onBack,
  onNext,
}) {
  const [activeGroup, setActiveGroup] = useState('regime');
  const addChild = () =>
    setRecognizedChildren((current) => [
      ...current,
      { name: '', birthCertificate: '' },
    ]);
  const updateChild = (index, field, value) =>
    setRecognizedChildren((current) =>
      current.map((child, position) =>
        position === index ? { ...child, [field]: value } : child
      )
    );
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (onValidate()) onNext();
      }}
      noValidate
    >
      <FormHeading
        title="Régimen y decisiones"
        eyebrow="Expediente"
        description="Opciones patrimoniales y declaraciones que afectan el instrumento."
      />
      <SectionErrors
        errors={errors}
        prefixes={[
          'details.propertyRegime',
          'details.capitulationsDetails',
          'details.proxyDetails',
          'details.interpreter.',
          'recognizedChildren.',
        ]}
      />
      <ProgressiveFieldGroup
        id="regime"
        title="Régimen patrimonial"
        expanded={activeGroup === 'regime'}
        onSelect={setActiveGroup}
        errorCount={prefixErrorCount(errors, [
          'details.propertyRegime',
          'details.capitulationsDetails',
          'details.proxyDetails',
        ])}
        complete={Boolean(values.propertyRegime)}
      >
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextField
              fullWidth
              required
              select
              label="Régimen patrimonial"
              value={values.propertyRegime}
              onChange={update(setValues, 'propertyRegime')}
              {...errorProps(errors, 'details.propertyRegime')}
            >
              <MenuItem value="COMMUNITY_DEFERRED">Comunidad diferida</MenuItem>
              <MenuItem value="SEPARATION_OF_PROPERTY">
                Separación de bienes
              </MenuItem>
              <MenuItem value="PARTICIPATION_IN_GAINS">
                Participación en las ganancias
              </MenuItem>
            </TextField>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextField
              fullWidth
              label="Nombre que usará después del matrimonio"
              helperText="Opcional. Vacío significa conservar apellidos actuales."
              value={values.marriedName}
              onChange={update(setValues, 'marriedName')}
            />
          </Grid>
          <Grid size={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.capitulations}
                  onChange={update(setValues, 'capitulations')}
                />
              }
              label="Existen capitulaciones matrimoniales"
            />
          </Grid>
          {values.capitulations && (
            <Grid size={12}>
              <TextField
                fullWidth
                required
                label="Instrumento de capitulaciones"
                value={values.capitulationsDetails}
                onChange={update(setValues, 'capitulationsDetails')}
                {...errorProps(errors, 'details.capitulationsDetails')}
              />
            </Grid>
          )}
          <Grid size={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.marriageByProxy}
                  onChange={update(setValues, 'marriageByProxy')}
                />
              }
              label="Matrimonio por poder especial"
            />
          </Grid>
          {values.marriageByProxy && (
            <Grid size={12}>
              <TextField
                fullWidth
                required
                label="Poder especial"
                value={values.proxyDetails}
                onChange={update(setValues, 'proxyDetails')}
                {...errorProps(errors, 'details.proxyDetails')}
              />
            </Grid>
          )}
        </Grid>
      </ProgressiveFieldGroup>
      <ProgressiveFieldGroup
        id="children"
        title="Hijos que serán reconocidos"
        description="Agregue solamente hijos comunes reconocidos dentro del acto."
        expanded={activeGroup === 'children'}
        onSelect={setActiveGroup}
        errorCount={prefixErrorCount(errors, ['recognizedChildren.'])}
        complete={
          recognizedChildren.length > 0 &&
          recognizedChildren.every(
            (child) => child.name && child.birthCertificate
          )
        }
        optional
      >
        <Stack spacing={1.5}>
          {recognizedChildren.map((child, index) => (
            <Grid container spacing={1.5} key={index}>
              <Grid
                size={{
                  xs: 12,
                  sm: 5,
                }}
              >
                <TextField
                  fullWidth
                  required
                  label={'Nombre del hijo ' + (index + 1)}
                  value={child.name}
                  onChange={(event) =>
                    updateChild(index, 'name', event.target.value)
                  }
                  {...errorProps(errors, `recognizedChildren.${index}.name`)}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 5,
                }}
              >
                <TextField
                  fullWidth
                  required
                  label="Partida de nacimiento"
                  value={child.birthCertificate}
                  onChange={(event) =>
                    updateChild(index, 'birthCertificate', event.target.value)
                  }
                  {...errorProps(
                    errors,
                    `recognizedChildren.${index}.birthCertificate`
                  )}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 2,
                }}
              >
                <Button
                  color="error"
                  onClick={() =>
                    setRecognizedChildren((current) =>
                      current.filter((_item, position) => position !== index)
                    )
                  }
                >
                  Eliminar
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
            onClick={addChild}
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          >
            Agregar hijo
          </Button>
        </Stack>
      </ProgressiveFieldGroup>
      {interpreterRequired && (
        <ProgressiveFieldGroup
          id="interpreter"
          title="Intérprete requerido"
          description="Caso especial sujeto a revisión notarial y diligencias adicionales."
          expanded={activeGroup === 'interpreter'}
          onSelect={setActiveGroup}
          errorCount={prefixErrorCount(errors, ['details.interpreter.'])}
          complete={valuesComplete(values.interpreter, [
            'nombre',
            'apellido',
            'fecha_nacimiento',
            'genero',
            'oficio',
            'documento',
            'departamento',
            'municipio',
            'domicilio',
          ])}
        >
          <Alert severity="warning" sx={{ mb: 2 }}>
            Verifique nombramiento, juramentación e idoneidad del intérprete.
          </Alert>
          <Grid container spacing={2}>
            <PersonFields
              values={values.interpreter}
              setValues={(change) =>
                setValues((current) => ({
                  ...current,
                  interpreter:
                    typeof change === 'function'
                      ? change(current.interpreter)
                      : change,
                }))
              }
              people={people}
              identityFlexible
              errors={errors}
              errorPrefix="details.interpreter"
            />
          </Grid>
        </ProgressiveFieldGroup>
      )}
      <FormActions buttons={actions(onBack)} />
    </form>
  );
}

export function MarriageWitnessesStructure({
  witnesses,
  setWitnesses,
  people,
  savePerson,
  errors,
  onValidate,
  onBack,
  onNext,
}) {
  const [activeGroup, setActiveGroup] = useState('witness-0');
  const setWitness = (index) => (change) =>
    setWitnesses((current) =>
      current.map((witness, position) =>
        position === index
          ? typeof change === 'function'
            ? change(witness)
            : change
          : witness
      )
    );
  const submit = async (event) => {
    event.preventDefault();
    if (!onValidate()) return;
    for (const witness of witnesses) {
      if ((await savePerson(witness)) === false) return;
    }
    onNext();
  };
  return (
    <form onSubmit={submit} noValidate>
      <FormHeading
        title="Testigos"
        eyebrow="Celebración"
        description="Se requieren por lo menos dos. Puede agregar más cuando corresponda."
      />
      <SectionErrors errors={errors} prefixes={['witnesses']} />
      {witnesses.map((witness, index) => (
        <ProgressiveFieldGroup
          key={index}
          id={`witness-${index}`}
          title={'Testigo ' + (index + 1)}
          expanded={activeGroup === `witness-${index}`}
          onSelect={setActiveGroup}
          errorCount={prefixErrorCount(errors, [`witnesses.${index}.`])}
          complete={valuesComplete(witness, [
            'nombre',
            'apellido',
            'fecha_nacimiento',
            'genero',
            'oficio',
            'documento',
            'departamento',
            'municipio',
            'domicilio',
          ])}
        >
          <Grid container spacing={2}>
            <PersonFields
              values={witness}
              setValues={setWitness(index)}
              people={people}
              errors={errors}
              errorPrefix={`witnesses.${index}`}
            />
            <Grid size={12}>
              <FormControlLabel
                sx={errorColor(errors, `witnesses.${index}.readsWritesSpanish`)}
                control={
                  <Checkbox
                    checked={witness.readsWritesSpanish}
                    onChange={update(setWitness(index), 'readsWritesSpanish')}
                  />
                }
                label="Sabe leer y escribir castellano"
              />
              <FormControlLabel
                sx={errorColor(errors, `witnesses.${index}.knowsParties`)}
                control={
                  <Checkbox
                    checked={witness.knowsParties}
                    onChange={update(setWitness(index), 'knowsParties')}
                  />
                }
                label="Conoce a ambos contrayentes"
              />
              <FormControlLabel
                sx={errorColor(
                  errors,
                  `witnesses.${index}.prohibitedRelationship`
                )}
                control={
                  <Checkbox
                    checked={witness.prohibitedRelationship}
                    onChange={update(
                      setWitness(index),
                      'prohibitedRelationship'
                    )}
                  />
                }
                label="Está comprendido en una prohibición legal"
              />
            </Grid>
            {witnesses.length > 2 && (
              <Grid size={12}>
                <Button
                  color="error"
                  onClick={() =>
                    setWitnesses((current) =>
                      current.filter((_item, position) => position !== index)
                    )
                  }
                >
                  Eliminar testigo
                </Button>
              </Grid>
            )}
          </Grid>
        </ProgressiveFieldGroup>
      ))}
      <Button
        onClick={() =>
          setWitnesses((current) => [...current, emptyMarriageWitness()])
        }
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Agregar otro testigo
      </Button>
      <FormActions buttons={actions(onBack)} />
    </form>
  );
}

const Territory = ({ prefix, values, setValues, errors }) => {
  const state = values[prefix + 'State'];
  const municipality = values[prefix + 'Municipality'];
  return (
    <>
      <Grid
        size={{
          xs: 12,
          sm: 4,
        }}
      >
        <TextField
          fullWidth
          required
          select
          label="Departamento"
          value={state}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              [prefix + 'State']: event.target.value,
              [prefix + 'Municipality']: '',
              [prefix + 'District']: '',
            }))
          }
          {...errorProps(errors, `details.${prefix}State`)}
        >
          {Object.keys(DataTerritorialDivision).map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 4,
        }}
      >
        <TextField
          fullWidth
          required
          select
          disabled={!state}
          label="Municipio"
          value={municipality}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              [prefix + 'Municipality']: event.target.value,
              [prefix + 'District']: '',
            }))
          }
          {...errorProps(errors, `details.${prefix}Municipality`)}
        >
          {Object.keys(DataTerritorialDivision[state] || {}).map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 4,
        }}
      >
        <TextField
          fullWidth
          required
          select
          disabled={!municipality}
          label="Distrito"
          value={values[prefix + 'District']}
          onChange={update(setValues, prefix + 'District')}
          {...errorProps(errors, `details.${prefix}District`)}
        >
          {(DataTerritorialDivision[state]?.[municipality] || []).map(
            (option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            )
          )}
        </TextField>
      </Grid>
    </>
  );
};

export function MarriageCelebrationStructure({
  values,
  setValues,
  errors,
  onValidate,
  onBack,
  onNext,
}) {
  const [activeGroup, setActiveGroup] = useState('premarital');
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (onValidate()) onNext();
      }}
      noValidate
    >
      <FormHeading
        title="Acta y celebración"
        eyebrow="Lugar y momento"
        description="Acta prematrimonial, número de escritura y ceremonia."
      />
      <SectionErrors errors={errors} prefixes={['details.']} />
      <ProgressiveFieldGroup
        id="premarital"
        title="Acta prematrimonial"
        expanded={activeGroup === 'premarital'}
        onSelect={setActiveGroup}
        errorCount={prefixErrorCount(errors, ['details.premarital'])}
        complete={valuesComplete(values, [
          'premaritalState',
          'premaritalMunicipality',
          'premaritalDistrict',
          'premaritalDate',
          'premaritalTime',
        ])}
      >
        <Grid container spacing={2}>
          <Territory
            prefix="premarital"
            values={values}
            setValues={setValues}
            errors={errors}
          />
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <Grid container spacing={1}>
              <Grid size="grow">
                <DateField
                  fullWidth
                  required
                  label="Fecha del acta"
                  name="premaritalDate"
                  value={values.premaritalDate}
                  onChange={update(setValues, 'premaritalDate')}
                  {...errorProps(errors, 'details.premaritalDate')}
                />
              </Grid>
              <Grid size="auto">
                <Button
                  type="button"
                  onClick={() =>
                    setValues((current) => ({
                      ...current,
                      premaritalDate: todayValue(),
                    }))
                  }
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
                  fullWidth
                  required
                  type="time"
                  label="Hora del acta"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  value={values.premaritalTime}
                  onChange={update(setValues, 'premaritalTime')}
                  {...errorProps(errors, 'details.premaritalTime')}
                />
              </Grid>
              <Grid size="auto">
                <Button
                  type="button"
                  onClick={() =>
                    setValues((current) => ({
                      ...current,
                      premaritalTime: currentTimeValue(),
                    }))
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
        id="celebration"
        title="Celebración"
        expanded={activeGroup === 'celebration'}
        onSelect={setActiveGroup}
        errorCount={prefixErrorCount(errors, [
          'details.celebration',
          'details.deedNumber',
        ])}
        complete={valuesComplete(values, [
          'celebrationState',
          'celebrationMunicipality',
          'celebrationDistrict',
          'deedNumber',
          'celebrationDate',
          'celebrationTime',
        ])}
      >
        <Grid container spacing={2}>
          <Territory
            prefix="celebration"
            values={values}
            setValues={setValues}
            errors={errors}
          />
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <TextField
              fullWidth
              required
              type="number"
              inputProps={{ min: 1 }}
              label="Número de escritura"
              value={values.deedNumber}
              onChange={update(setValues, 'deedNumber')}
              {...errorProps(errors, 'details.deedNumber')}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <Grid container spacing={1}>
              <Grid size="grow">
                <DateField
                  fullWidth
                  required
                  label="Fecha de celebración"
                  inputProps={{ min: values.premaritalDate }}
                  name="celebrationDate"
                  value={values.celebrationDate}
                  onChange={update(setValues, 'celebrationDate')}
                  {...errorProps(errors, 'details.celebrationDate')}
                />
              </Grid>
              <Grid size="auto">
                <Button
                  type="button"
                  onClick={() =>
                    setValues((current) => ({
                      ...current,
                      celebrationDate: todayValue(),
                    }))
                  }
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
              sm: 4,
            }}
          >
            <Grid container spacing={1}>
              <Grid size="grow">
                <TextField
                  fullWidth
                  required
                  type="time"
                  label="Hora de celebración"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  value={values.celebrationTime}
                  onChange={update(setValues, 'celebrationTime')}
                  {...errorProps(errors, 'details.celebrationTime')}
                />
              </Grid>
              <Grid size="auto">
                <Button
                  type="button"
                  onClick={() =>
                    setValues((current) => ({
                      ...current,
                      celebrationTime: currentTimeValue(),
                    }))
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
      <FormActions buttons={actions(onBack)} />
    </form>
  );
}
import { useState } from 'react';
