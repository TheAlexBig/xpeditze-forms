import Box from '@mui/material/Box';
import { formatDate } from '../Functions/DateFormat';
import { ReviewSectionList, ReviewSummary } from './DocumentReviewScaffold';

const name = (person) =>
  [person?.nombre || person?.nombres, person?.apellido || person?.apellidos]
    .filter(Boolean)
    .join(' ');
const regime = {
  COMMUNITY_DEFERRED: 'Comunidad diferida',
  SEPARATION_OF_PROPERTY: 'Separación de bienes',
  PARTICIPATION_IN_GAINS: 'Participación en las ganancias',
};
const status = {
  SINGLE: 'Soltero',
  DIVORCED: 'Divorciado',
  WIDOWED: 'Viudo',
  MARRIED: 'Casado',
};
const date = (value) => formatDate(value, 'Pendiente');
const yesNo = (value) => (value ? 'Sí' : 'No');
const place = (values = {}) =>
  [values.domicilio || values.distrito, values.municipio, values.departamento]
    .filter(Boolean)
    .join(', ');
const familyStatus = (party) => {
  const label = status[party.familyStatus];
  return party.genero === 'Femenino' && label
    ? label.replace(/o$/, 'a')
    : label;
};
const structuredPlace = (party, prefix, foreignField) =>
  party[`${prefix}Country`] === 'El Salvador'
    ? [
        party[`${prefix}Settlement`],
        party[`${prefix}Municipality`],
        party[`${prefix}State`],
        'El Salvador',
      ]
        .filter(Boolean)
        .join(', ')
    : [party[foreignField], party[`${prefix}Country`]]
        .filter(Boolean)
        .join(', ');
const parent = (party, prefix) =>
  [
    [party[`${prefix}Name`], party[`${prefix}LastName`]]
      .filter(Boolean)
      .join(' '),
    party[`${prefix}Job`],
    structuredPlace(party, prefix, `${prefix}Settlement`),
  ]
    .filter(Boolean)
    .join(' · ');
const partyGroups = (party) => [
  {
    title: 'Identidad y datos personales',
    values: [
      ['Nombre completo', name(party)],
      ['Fecha de nacimiento', date(party.fecha_nacimiento)],
      ['Edad', party.edad && `${party.edad} años`],
      ['Género', party.genero],
      ['Lugar de nacimiento', structuredPlace(party, 'birth', 'birthPlace')],
      ['Nacionalidad', party.nationality],
      ['Estado familiar', familyStatus(party)],
      ['Oficio', party.oficio],
    ],
  },
  {
    title: 'Identificación y domicilio',
    values: [
      ['Tipo de identificación', party.identityType],
      ['Número de identificación', party.documento],
      ['Domicilio completo', place(party), true],
    ],
  },
  {
    title: 'Partida de nacimiento',
    values: [
      ['Número', party.birthCertificateNumber],
      ['Folio', party.birthCertificateFolio],
      ['Libro', party.birthCertificateBook],
      ['Registro', party.birthCertificateRegistry],
      ['Fecha de expedición', date(party.birthCertificateIssueDate)],
      ['Expedida por', party.birthCertificateIssuedBy],
    ],
  },
  {
    title: 'Familia',
    values: [
      ['Madre', parent(party, 'mother'), true],
      ['Padre', parent(party, 'father'), true],
      ...(party.familyStatusDocument
        ? [['Documento del estado familiar', party.familyStatusDocument, true]]
        : []),
    ],
  },
  {
    title: 'Capacidad e impedimentos',
    values: [
      ['Puede consentir', yesNo(party.canConsent)],
      ['Vínculo matrimonial vigente', yesNo(party.currentMarriage)],
      ['Parentesco impediente', yesNo(party.prohibitedKinship)],
      [
        'Relación de adopción impediente',
        yesNo(party.prohibitedAdoptionRelationship),
      ],
      ['Restricción por homicidio', yesNo(party.spouseHomicideRestriction)],
      ['Restricción por tutela', yesNo(party.tutorRestriction)],
      ['Se expresa en castellano', yesNo(party.speaksSpanish)],
    ],
  },
];
const witnessGroups = (witnesses) =>
  witnesses.map((witness, index) => ({
    title: `Testigo ${index + 1}`,
    values: [
      ['Nombre completo', name(witness)],
      ['DUI', witness.documento],
      ['Fecha de nacimiento', date(witness.fecha_nacimiento)],
      ['Edad', witness.edad && `${witness.edad} años`],
      ['Género', witness.genero],
      ['Oficio', witness.oficio],
      ['Domicilio completo', place(witness), true],
      ['Lee y escribe en castellano', yesNo(witness.readsWritesSpanish)],
      ['Conoce a los contrayentes', yesNo(witness.knowsParties)],
      ['Relación prohibida', yesNo(witness.prohibitedRelationship)],
    ],
  }));

export default function MarriageReview({ data, onEdit }) {
  const sections = [
    {
      title: 'Responsables',
      summary: name(data.agent),
      step: 0,
      groups: [
        {
          title: 'Responsables del documento',
          values: [
            ['Notario responsable', name(data.agent)],
            ['Preparado por', name(data.preparer) || 'No especificado'],
            ['Domicilio del notario', place(data.agent), true],
          ],
        },
      ],
    },
    {
      title: 'Contrayente 1',
      summary: name(data.partyOne),
      step: 1,
      groups: partyGroups(data.partyOne),
    },
    {
      title: 'Contrayente 2',
      summary: name(data.partyTwo),
      step: 2,
      groups: partyGroups(data.partyTwo),
    },
    {
      title: 'Régimen y decisiones',
      summary: regime[data.details.propertyRegime],
      step: 3,
      groups: [
        {
          title: 'Decisiones del matrimonio',
          values: [
            ['Régimen patrimonial', regime[data.details.propertyRegime]],
            ['Capitulaciones', yesNo(data.details.capitulations)],
            ...(data.details.capitulations
              ? [
                  [
                    'Detalle de las capitulaciones',
                    data.details.capitulationsDetails,
                    true,
                  ],
                ]
              : []),
            [
              'Nombre posterior',
              data.details.marriedName || 'Conserva sus apellidos',
            ],
            ['Matrimonio por poder', yesNo(data.details.marriageByProxy)],
            ...(data.details.marriageByProxy
              ? [['Detalle del poder', data.details.proxyDetails, true]]
              : []),
          ],
        },
        {
          title: 'Hijos reconocidos',
          values: data.recognizedChildren.length
            ? data.recognizedChildren.map((child, index) => [
                `Hijo o hija ${index + 1}`,
                `${child.name} · Partida: ${child.birthCertificate}`,
                true,
              ])
            : [['Resultado', 'No se reconocerán hijos en el instrumento']],
        },
        {
          title: 'Intérprete',
          values:
            !data.partyOne.speaksSpanish || !data.partyTwo.speaksSpanish
              ? [
                  ['Nombre completo', name(data.details.interpreter)],
                  ['DUI', data.details.interpreter.documento],
                  ['Oficio', data.details.interpreter.oficio],
                  ['Domicilio', place(data.details.interpreter), true],
                ]
              : [['Resultado', 'No se requiere intérprete']],
        },
      ],
    },
    {
      title: 'Testigos',
      summary: data.witnesses.length + ' registrados',
      step: 4,
      groups: witnessGroups(data.witnesses),
    },
    {
      title: 'Acta y celebración',
      summary: date(data.details.celebrationDate),
      step: 5,
      groups: [
        {
          title: 'Acta prematrimonial',
          values: [
            [
              'Fecha y hora',
              `${date(data.details.premaritalDate)} · ${data.details.premaritalTime}`,
            ],
            [
              'Lugar',
              [
                data.details.premaritalDistrict,
                data.details.premaritalMunicipality,
                data.details.premaritalState,
              ]
                .filter(Boolean)
                .join(', '),
              true,
            ],
          ],
        },
        {
          title: 'Celebración y escritura',
          values: [
            ['Número de escritura', data.details.deedNumber],
            [
              'Fecha y hora',
              `${date(data.details.celebrationDate)} · ${data.details.celebrationTime}`,
            ],
            [
              'Lugar',
              [
                data.details.celebrationDistrict,
                data.details.celebrationMunicipality,
                data.details.celebrationState,
              ]
                .filter(Boolean)
                .join(', '),
              true,
            ],
            [
              'Documentos generados',
              'Acta, escritura y control registral',
              true,
            ],
          ],
        },
      ],
    },
  ];
  return (
    <Box>
      <ReviewSummary
        title={`${name(data.partyOne)} y ${name(data.partyTwo)}`}
        chips={[
          regime[data.details.propertyRegime],
          `Celebración: ${date(data.details.celebrationDate)}`,
          `${data.witnesses.length} testigos`,
        ]}
      />
      <ReviewSectionList sections={sections} onEdit={onEdit} />
    </Box>
  );
}
