import {
  replaceNumericSequences,
  toLegalDate,
  toLegalDecimal,
  toLegalIdentifier,
  toLegalNumber,
  toLegalTime,
  toLegalYear,
} from '../Functions/LegalDocumentText';

import {
  createAgentPayload,
  createPersonPayload,
  legalSettlement,
} from './LegalPayload';

export const createVehiclePayload = (vehicle) => {
  const heavyTruck = vehicle.clase?.toLocaleLowerCase() === 'camión pesado';
  return {
    placa: toLegalIdentifier(vehicle.placa),
    marca: replaceNumericSequences(vehicle.marca),
    modelo: replaceNumericSequences(vehicle.modelo),
    color: replaceNumericSequences(vehicle.color),
    fabricado: toLegalYear(vehicle.fabricado),
    capacidad: heavyTruck
      ? replaceNumericSequences(vehicle.tipo_capacidad)
      : `${toLegalDecimal(vehicle.capacidad)} ${vehicle.unidad_capacidad || 'ASS'}`,
    dominio: replaceNumericSequences(vehicle.dominio),
    clase: replaceNumericSequences(vehicle.clase),
    tipo: replaceNumericSequences(vehicle.tipo),
    ejes: toLegalNumber(vehicle.ejes),
    tara: toLegalDecimal(vehicle.tara),
    tipo_capacidad: replaceNumericSequences(vehicle.tipo_capacidad),
    cap_carga: toLegalDecimal(vehicle.cap_carga),
    cap_maxima: toLegalDecimal(vehicle.cap_maxima),
    traccion: replaceNumericSequences(vehicle.traccion),
    num_motor: toLegalIdentifier(vehicle.num_motor),
    num_chasis: toLegalIdentifier(vehicle.num_chasis),
    num_vin: toLegalIdentifier(vehicle.num_vin),
  };
};

export const createCompanyPayload = (person) =>
  person.actua_por_sociedad
    ? {
        nombre: replaceNumericSequences(person.sociedad_nombre),
        abreviatura: replaceNumericSequences(person.sociedad_abreviatura),
        nacionalidad: replaceNumericSequences(person.sociedad_nacionalidad),
        departamento: replaceNumericSequences(person.sociedad_departamento),
        domicilio: replaceNumericSequences(
          legalSettlement(person.sociedad_domicilio, person.sociedad_municipio)
        ),
        nit: toLegalIdentifier(person.sociedad_nit),
        cargo_representante: replaceNumericSequences(person.sociedad_cargo),
        personeria: replaceNumericSequences(person.sociedad_personeria),
      }
    : null;

const createCarSalePartyPayload = (person) => ({
  ...createPersonPayload(person),
  sociedad: createCompanyPayload(person),
});

export function createCarSalePayload(state) {
  return {
    vendedor: createCarSalePartyPayload(state.vendorStates),
    comprador: createCarSalePartyPayload(state.personStates),
    vehiculo: createVehiclePayload(state.carStates),
    documento: {
      calidad_de: replaceNumericSequences(state.detailStates.calidad_de),
      institucion: replaceNumericSequences(
        state.detailStates.institucion || ''
      ),
      precio: toLegalNumber(state.detailStates.precio),
      domicilio: replaceNumericSequences(
        legalSettlement(
          state.detailStates.domicilio,
          state.detailStates.municipio
        )
      ),
      departamento: replaceNumericSequences(state.detailStates.departamento),
      fecha_firma: toLegalDate(state.detailStates.fecha_firma),
      hora_firma: toLegalTime(state.detailStates.hora_firma),
      identifica_vendedor: state.detailStates.identifica_vendedor,
      identifica_comprador: state.detailStates.identifica_comprador,
    },
    agente_juridico: createAgentPayload(state.agentStates),
  };
}
