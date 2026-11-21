import { normalizeDui } from './PersonMemory';

export const isNotary = (agent) =>
  (agent?.rol || '').trim().toLocaleLowerCase() === 'notario';

export const hasSamePartyDui = (buyer, seller) => {
  const buyerDui = normalizeDui(buyer?.documento);
  const sellerDui = normalizeDui(seller?.documento);
  return Boolean(buyerDui && sellerDui && buyerDui === sellerDui);
};

const normalizedIdentifier = (value) =>
  (value || '').replace(/[^\p{L}\p{N}]/gu, '').toLocaleUpperCase();

export const hasSameCompanyNit = (buyer, seller) => {
  if (!buyer?.actua_por_sociedad || !seller?.actua_por_sociedad) return false;
  const buyerNit = normalizedIdentifier(buyer.sociedad_nit);
  const sellerNit = normalizedIdentifier(seller.sociedad_nit);
  return Boolean(buyerNit && sellerNit && buyerNit === sellerNit);
};

export function validateCarSaleState(state) {
  if (!isNotary(state.agentStates)) {
    return 'Seleccione un notario para autenticar la compraventa.';
  }
  if (hasSamePartyDui(state.personStates, state.vendorStates)) {
    return 'El comprador y el vendedor deben tener DUI diferentes.';
  }
  if (hasSameCompanyNit(state.personStates, state.vendorStates)) {
    return 'La sociedad compradora y la sociedad vendedora deben tener NIT diferentes.';
  }
  return '';
}
