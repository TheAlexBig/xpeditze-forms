import Box from '@mui/material/Box';
import MutualPaymentPlanSummary from '../Forms/Structure/MutualPaymentPlanSummary';
import { ReviewSectionList, ReviewSummary } from './DocumentReviewScaffold';
import {
  calculateMutualPreview,
  formatMutualDate,
  formatMutualMoney,
} from '../Forms/MutualFinancialPreview';

const emptyValue = 'Pendiente';
const fullName = (person = {}) =>
  [person.nombre || person.nombres, person.apellido || person.apellidos]
    .filter(Boolean)
    .join(' ') || emptyValue;
const optionalFullName = (person = {}) =>
  [person.nombre || person.nombres, person.apellido || person.apellidos]
    .filter(Boolean)
    .join(' ') || 'No especificado';
const place = (values = {}) =>
  [values.domicilio || values.distrito, values.municipio, values.departamento]
    .filter(Boolean)
    .join(', ') || emptyValue;
const partyGroups = (person) => [
  {
    title: 'Datos personales',
    values: [
      ['Nombre completo', fullName(person)],
      ['DUI', person.documento],
      ['Fecha de nacimiento', formatMutualDate(person.fecha_nacimiento)],
      ['Edad', person.edad && `${person.edad} años`],
      ['Género', person.genero],
      ['Oficio', person.oficio],
    ],
  },
  {
    title: 'Domicilio',
    values: [['Domicilio completo', place(person), true]],
  },
  ...(person.actua_por_sociedad
    ? [
        {
          title: 'Sociedad representada',
          values: [
            ['Razón social', person.sociedad_nombre],
            ['Nombre abreviado', person.sociedad_abreviatura],
            ['NIT', person.sociedad_nit],
            ['Cargo y vigencia', person.sociedad_cargo, true],
            [
              'Personería',
              [person.sociedad_personeria_tipo, person.sociedad_personeria]
                .filter(Boolean)
                .join(': '),
              true,
            ],
          ],
        },
      ]
    : []),
];
const vehicleGroups = (vehicle = {}) => [
  {
    title: 'Identificación del vehículo',
    values: [
      ['Placa', vehicle.placa],
      [
        'Marca y modelo',
        [vehicle.marca, vehicle.modelo].filter(Boolean).join(' '),
      ],
      ['Año', vehicle.fabricado],
      ['Color', vehicle.color],
    ],
  },
  {
    title: 'Características e identificación',
    values: [
      ['Clase', vehicle.clase],
      ['Tipo', vehicle.tipo],
      [
        'Capacidad',
        `${vehicle.capacidad || ''} ${vehicle.unidad_capacidad || ''}`.trim(),
      ],
      ['Motor', vehicle.num_motor],
      ['Chasis', vehicle.num_chasis],
      ['VIN', vehicle.num_vin],
    ],
  },
];

export default function MutualReview({ data, onEdit }) {
  const preview = calculateMutualPreview(data.terms);
  const signingPlace = [
    data.terms.signingDistrict,
    data.terms.signingMunicipality,
    data.terms.signingState,
  ]
    .filter(Boolean)
    .join(', ');
  const instrumentLabels = {
    PRIVATE_AUTHENTICATED: 'Documento privado autenticado',
    PUBLIC_DEED: 'Escritura pública',
  };
  const guaranteeLabels = {
    NONE: 'Sin garantía',
    PERSONAL_GUARANTOR: 'Fiador o garante personal',
    VEHICLE_PLEDGE: 'Prenda sin desplazamiento sobre vehículo',
    MOVABLE: 'Garantía mobiliaria',
    MORTGAGE: 'Garantía hipotecaria',
  };
  const paymentMethodLabels = {
    BANK_TRANSFER: 'Depósito o transferencia',
    CASH: 'Efectivo',
    OTHER: 'Otra forma pactada',
  };
  const sections = [
    {
      title: 'Responsables',
      accent: '#17695d',
      summary: fullName(data.agent),
      step: 0,
      values: [
        ['Preparado por', optionalFullName(data.preparer)],
        ['Notario responsable', fullName(data.agent)],
        ['Domicilio del notario', place(data.agent), true],
      ],
    },
    {
      title: 'Deudor',
      accent: '#2f7c70',
      summary: `${fullName(data.debtor)} · ${data.debtor.documento || emptyValue}`,
      step: 1,
      groups: partyGroups(data.debtor),
    },
    {
      title: 'Acreedor',
      accent: '#8a6540',
      summary: `${fullName(data.creditor)} · ${data.creditor.documento || emptyValue}`,
      step: 2,
      groups: partyGroups(data.creditor),
    },
    {
      title: 'Condiciones del mutuo',
      accent: '#52766e',
      summary: `${
        data.terms.amount ? formatMutualMoney(data.terms.amount) : emptyValue
      } · ${data.terms.term || emptyValue}`,
      step: 3,
      groups: [
        {
          title: 'Préstamo y plazo',
          values: [
            [
              'Monto mutuado',
              data.terms.amount && formatMutualMoney(data.terms.amount),
            ],
            ['Plazo', data.terms.term],
            [
              'Fecha de vencimiento',
              formatMutualDate(preview?.dueDate || data.terms.dueDate),
            ],
            [
              'Número de cuotas',
              data.terms.paymentScheduleMode === 'CUSTOM'
                ? data.terms.customInstallments.length
                : data.terms.installmentCount,
            ],
            [
              'Monto por cuota',
              preview
                ? formatMutualMoney(preview.installmentAmount)
                : data.terms.installmentAmount &&
                  formatMutualMoney(data.terms.installmentAmount),
            ],
            ['Destino de los fondos', data.terms.fundsPurpose, true],
            [
              'Modalidad del plan',
              data.terms.paymentScheduleMode === 'CUSTOM'
                ? 'Fechas y montos pactados individualmente'
                : 'Cuotas calculadas',
            ],
          ],
        },
        {
          title: 'Pago e intereses',
          values: [
            ['Forma de pago', paymentMethodLabels[data.terms.paymentMethod]],
            ...(data.terms.paymentMethod === 'BANK_TRANSFER'
              ? [
                  ['Banco para el pago', data.terms.paymentBank],
                  ['Número de cuenta', data.terms.paymentAccount],
                ]
              : [['Lugar y condiciones', data.terms.paymentDetails, true]]),
            [
              'Interés mensual',
              data.terms.monthlyInterest
                ? `${data.terms.monthlyInterest}%`
                : 'Sin interés ordinario',
            ],
            [
              'Interés por mora',
              data.terms.defaultInterest
                ? `${data.terms.defaultInterest}% ${
                    data.terms.defaultInterestPeriod === 'ANNUAL'
                      ? 'anual'
                      : 'mensual'
                  }`
                : 'Sin interés por mora',
            ],
            [
              'Gastos administrativos',
              data.terms.administrativeExpenses
                ? `${data.terms.administrativeExpenses}%`
                : 'No aplica',
            ],
            [
              'Abonos anticipados',
              data.terms.allowsEarlyPayments
                ? data.terms.earlyPaymentTerms
                : 'No pactados',
              true,
            ],
          ],
        },
        {
          title: 'Instrumento y garantía',
          values: [
            ['Instrumento', instrumentLabels[data.terms.instrumentType]],
            ...(data.terms.instrumentType === 'PUBLIC_DEED'
              ? [['Número de escritura', data.terms.deedNumber]]
              : []),
            ['Garantía', guaranteeLabels[data.terms.guaranteeType]],
            ...(data.terms.guaranteeDetails
              ? [['Bien dado en garantía', data.terms.guaranteeDetails, true]]
              : []),
            [
              'Garantía con letra de cambio',
              data.terms.billOfExchangeGuarantee ? 'Sí' : 'No',
            ],
            ...(data.terms.billOfExchangeGuarantee
              ? [
                  [
                    'Vencimiento de la garantía',
                    formatMutualDate(data.terms.guaranteeDueDate),
                  ],
                ]
              : []),
          ],
        },
        {
          title: 'Firma e identificación notarial',
          values: [
            ['Lugar de firma', signingPlace, true],
            [
              'Fecha y hora',
              `${formatMutualDate(data.terms.signingDate)} · ${data.terms.signingTime}`,
            ],
            ['El notario conoce al deudor', data.terms.identifiesDebtor],
            ['El notario conoce al acreedor', data.terms.identifiesCreditor],
          ],
        },
      ],
    },
    ...(data.terms.guaranteeType === 'PERSONAL_GUARANTOR'
      ? [
          {
            title: 'Fiador o garante',
            accent: '#735c91',
            summary: fullName(data.guarantor),
            step: 4,
            groups: partyGroups(data.guarantor),
          },
        ]
      : []),
    ...(data.terms.guaranteeType === 'VEHICLE_PLEDGE'
      ? [
          {
            title: 'Vehículo en garantía',
            accent: '#735c91',
            summary: `${data.pledgedVehicle?.placa || emptyValue} · ${[
              data.pledgedVehicle?.marca,
              data.pledgedVehicle?.modelo,
            ]
              .filter(Boolean)
              .join(' ')}`,
            step: 4,
            groups: [
              {
                title: 'Valor de la garantía',
                values: [['Valor convenido', `$${data.terms.pledgeValue}`]],
              },
              ...vehicleGroups(data.pledgedVehicle),
            ],
          },
        ]
      : []),
    ...(preview
      ? [
          {
            title: 'Plan de pagos',
            accent: '#17695d',
            summary: `${formatMutualMoney(preview.total)} · ${preview.periodicity}`,
            step: 3,
            content: <MutualPaymentPlanSummary preview={preview} />,
          },
        ]
      : []),
  ];

  return (
    <Box>
      <ReviewSummary
        title={`${fullName(data.creditor)} presta a ${fullName(data.debtor)}`}
        chips={[
          `Monto: ${
            data.terms.amount
              ? formatMutualMoney(data.terms.amount)
              : emptyValue
          }`,
          `Vencimiento: ${
            formatMutualDate(preview?.dueDate || data.terms.dueDate) ||
            emptyValue
          }`,
        ]}
      />
      <ReviewSectionList sections={sections} onEdit={onEdit} />
    </Box>
  );
}
