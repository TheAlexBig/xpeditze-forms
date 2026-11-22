import Box from '@mui/material/Box';
import { formatDate } from '../Functions/DateFormat';
import { ReviewSectionList, ReviewSummary } from './DocumentReviewScaffold';

const emptyValue = 'Pendiente';

const fullName = (person = {}) =>
  [person.nombre, person.apellido].filter(Boolean).join(' ') || emptyValue;
const optionalFullName = (person = {}) =>
  [person.nombre, person.apellido].filter(Boolean).join(' ') ||
  'No especificado';

const place = (values = {}) =>
  [values.domicilio, values.municipio, values.departamento]
    .filter(Boolean)
    .join(', ') || emptyValue;

const personGroups = (person) => [
  {
    title: 'Datos personales',
    values: [
      ['Nombre completo', fullName(person)],
      ['DUI', person.documento],
      ['Fecha de nacimiento', formatDate(person.fecha_nacimiento, emptyValue)],
      ['Edad', person.edad && `${person.edad} años`],
      ['Género', person.genero],
      ['Oficio', person.oficio],
    ],
  },
  {
    title: 'Domicilio',
    values: [['Domicilio completo', place(person), true]],
  },
  ...(person.sociedad
    ? [
        {
          title: 'Sociedad representada',
          values: [
            ['Razón social', person.sociedad.nombre],
            ['Nombre abreviado', person.sociedad.abreviatura || 'No indicado'],
            ['NIT', person.sociedad.nit],
            ['Nacionalidad', person.sociedad.nacionalidad],
            ['Domicilio', place(person.sociedad), true],
            ['Cargo o calidad', person.sociedad.cargo],
            ['Personería', person.sociedad.personeria, true],
          ],
        },
      ]
    : []),
];

const partyName = (person = {}) => person.sociedad?.nombre || fullName(person);

const CarSaleReview = ({ data, onEdit }) => {
  const vehicleTitle =
    [data.vehiculo.marca, data.vehiculo.modelo].filter(Boolean).join(' ') ||
    emptyValue;

  const heavyTruckValues =
    data.vehiculo.clase?.toLocaleLowerCase() === 'camión pesado'
      ? [
          ['Ejes', data.vehiculo.ejes],
          ['Tara', data.vehiculo.tara],
          ['Tipo de capacidad', data.vehiculo.tipo_capacidad],
          ['Capacidad de carga', data.vehiculo.cap_carga],
          ['Capacidad máxima', data.vehiculo.cap_maxima],
        ]
      : [];
  const sections = [
    {
      title: 'Responsables',
      accent: '#17695d',
      summary: fullName(data.agente_juridico),
      step: 0,
      values: [
        ['Preparado por', optionalFullName(data.preparado_por)],
        ['Notario responsable', fullName(data.agente_juridico)],
        ['Domicilio del notario', place(data.agente_juridico), true],
      ],
    },
    {
      title: 'Comprador',
      accent: '#2f7c70',
      summary: `${partyName(data.comprador)} · ${data.comprador.documento || emptyValue}`,
      step: 1,
      groups: personGroups(data.comprador),
    },
    {
      title: 'Vehículo',
      accent: '#b37d24',
      summary: `${data.vehiculo.placa || emptyValue} · ${vehicleTitle}`,
      step: 2,
      groups: [
        {
          title: 'Identificación del vehículo',
          values: [
            ['Placa', data.vehiculo.placa],
            ['Marca y modelo', vehicleTitle],
            ['Color', data.vehiculo.color],
            ['Año de fabricación', data.vehiculo.fabricado],
          ],
        },
        {
          title: 'Características',
          values: [
            ['Clase', data.vehiculo.clase],
            ['Tipo', data.vehiculo.tipo],
            ...(heavyTruckValues.length
              ? []
              : [['Capacidad', data.vehiculo.capacidad]]),
            ...heavyTruckValues,
            ...(data.vehiculo.traccion
              ? [['Tracción', data.vehiculo.traccion]]
              : []),
          ],
        },
        {
          title: 'Números de identificación',
          values: [
            ['Motor', data.vehiculo.num_motor],
            ['Chasis', data.vehiculo.num_chasis],
            ['VIN', data.vehiculo.num_vin],
          ],
        },
      ],
    },
    {
      title: 'Vendedor',
      accent: '#8a6540',
      summary: `${partyName(data.vendedor)} · ${data.vendedor.documento || emptyValue}`,
      step: 3,
      groups: personGroups(data.vendedor),
    },
    {
      title: 'Firma y venta',
      accent: '#52766e',
      summary: `${data.documento.precio || emptyValue} dólares`,
      step: 4,
      groups: [
        {
          title: 'Compraventa',
          values: [
            ['Precio', `${data.documento.precio || emptyValue} dólares`],
            ['Calidad en que se vende', data.documento.calidad_de],
            ...(data.documento.institucion
              ? [['Institución', data.documento.institucion]]
              : []),
            [
              'Fecha y hora de firma',
              `${formatDate(data.documento.fecha_firma, emptyValue)} · ${data.documento.hora_firma}`,
            ],
            ['Lugar de firma', place(data.documento), true],
          ],
        },
        {
          title: 'Identificación notarial',
          values: [
            [
              'El notario conoce al vendedor',
              data.documento.identifica_vendedor,
            ],
            [
              'El notario conoce al comprador',
              data.documento.identifica_comprador,
            ],
          ],
        },
      ],
    },
  ];

  return (
    <Box>
      <ReviewSummary
        title={`${data.vehiculo.placa || emptyValue}: ${partyName(data.vendedor)} → ${partyName(data.comprador)}`}
        chips={[
          `Precio: ${data.documento.precio || emptyValue} dólares`,
          `Firma: ${formatDate(data.documento.fecha_firma, emptyValue)}`,
        ]}
      />
      <ReviewSectionList sections={sections} onEdit={onEdit} />
    </Box>
  );
};

export default CarSaleReview;
