const personReviewData = (person) => ({
  nombre: person.nombre,
  apellido: person.apellido,
  fecha_nacimiento: person.fecha_nacimiento,
  documento: person.documento,
  domicilio: person.domicilio,
  municipio: person.municipio,
  departamento: person.departamento,
  oficio: person.oficio,
  actua_por_sociedad: Boolean(person.actua_por_sociedad),
  sociedad: person.actua_por_sociedad
    ? {
        nombre: person.sociedad_nombre,
        abreviatura: person.sociedad_abreviatura,
        nacionalidad: person.sociedad_nacionalidad,
        departamento: person.sociedad_departamento,
        municipio: person.sociedad_municipio,
        domicilio: person.sociedad_domicilio,
        nit: person.sociedad_nit,
        cargo: person.sociedad_cargo,
        personeria: person.sociedad_personeria,
      }
    : null,
});

const agentReviewData = (agent = {}) => ({
  nombre: agent.nombre || agent.nombres,
  apellido: agent.apellido || agent.apellidos,
  domicilio: agent.domicilio || agent.distrito,
  municipio: agent.municipio,
  departamento: agent.departamento,
});

export function createCarSaleReviewData(state) {
  return {
    agente_juridico: agentReviewData(state.agentStates),
    preparado_por: agentReviewData(state.preparedByStates),
    comprador: personReviewData(state.personStates),
    vendedor: personReviewData(state.vendorStates),
    vehiculo: {
      ...state.carStates,
      capacidad: `${state.carStates.capacidad || ''} ${
        state.carStates.unidad_capacidad || ''
      }`.trim(),
    },
    documento: {
      ...state.detailStates,
    },
  };
}
