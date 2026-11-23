import {
  replaceNumericSequences,
  toLegalIdentifier,
  toLegalNumber,
} from '../Functions/LegalDocumentText';

export const legalSettlement = (district, municipality) =>
  municipality ? district + ', Municipio de ' + municipality : district;

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
        personeria: replaceNumericSequences(
          [person.sociedad_personeria_tipo, person.sociedad_personeria]
            .filter(Boolean)
            .join(': ')
        ),
      }
    : null;

export const createPersonPayload = (person) => ({
  nombre: replaceNumericSequences(person.nombre),
  apellido: replaceNumericSequences(person.apellido),
  departamento: replaceNumericSequences(person.departamento),
  domicilio: replaceNumericSequences(
    legalSettlement(person.domicilio, person.municipio)
  ),
  documento: toLegalIdentifier(person.documento),
  genero: person.genero,
  edad: toLegalNumber(person.edad),
  oficio: replaceNumericSequences(person.oficio),
  sociedad: createCompanyPayload(person),
});

export const createAgentPayload = (agent) => ({
  nombre: replaceNumericSequences(agent.nombre || agent.nombres),
  apellido: replaceNumericSequences(agent.apellido || agent.apellidos),
  departamento: replaceNumericSequences(agent.departamento),
  domicilio: replaceNumericSequences(
    legalSettlement(agent.domicilio || agent.distrito, agent.municipio)
  ),
  genero: agent.genero,
  rol: agent.rol || 'Notario',
});
