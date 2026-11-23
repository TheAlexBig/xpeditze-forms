const draftSection = (historyItem, section) =>
  historyItem.draft?.[section] || {};

const carSalePresentation = (item) => {
  const buyer = draftSection(item, 'personStates');
  const seller = draftSection(item, 'vendorStates');
  const vehicle = draftSection(item, 'carStates');
  const agent = draftSection(item, 'agentStates');
  const preparer = draftSection(item, 'preparedByStates');
  const vehicleDescription = [vehicle.marca, vehicle.modelo, vehicle.placa]
    .filter(Boolean)
    .join(' ');
  const buyerName =
    buyer.sociedad_nombre ||
    [buyer.nombre, buyer.apellido].filter(Boolean).join(' ') ||
    item.buyerName;
  const sellerName =
    seller.sociedad_nombre ||
    [seller.nombre, seller.apellido].filter(Boolean).join(' ') ||
    item.sellerName;
  return {
    title: vehicleDescription
      ? `Compra venta - ${vehicleDescription}`
      : item.title,
    parties: `${buyerName} / ${sellerName}`,
    responsible: {
      notary: [agent.nombres, agent.apellidos].filter(Boolean).join(' '),
      preparer: [preparer.nombres, preparer.apellidos]
        .filter(Boolean)
        .join(' '),
    },
    searchable: [
      item.title,
      item.buyerName,
      item.sellerName,
      item.vehicle,
      buyer.nombre,
      buyer.apellido,
      buyer.documento,
      buyer.sociedad_nombre,
      buyer.sociedad_abreviatura,
      buyer.sociedad_nit,
      seller.nombre,
      seller.apellido,
      seller.documento,
      seller.sociedad_nombre,
      seller.sociedad_abreviatura,
      seller.sociedad_nit,
      vehicle.marca,
      vehicle.modelo,
      vehicle.placa,
      agent.nombre,
      agent.apellido,
      agent.nombres,
      agent.apellidos,
      agent.tipo,
      agent.role,
      agent.rol,
      preparer.nombres,
      preparer.apellidos,
      preparer.rol,
    ],
  };
};

const mutualPresentation = (item) => {
  const debtor = draftSection(item, 'debtor');
  const creditor = draftSection(item, 'creditor');
  const terms = draftSection(item, 'terms');
  const agent = draftSection(item, 'agent');
  const preparer = draftSection(item, 'preparer');
  const debtorName =
    debtor.sociedad_nombre ||
    [debtor.nombre, debtor.apellido].filter(Boolean).join(' ') ||
    item.buyerName;
  const creditorName =
    creditor.sociedad_nombre ||
    [creditor.nombre, creditor.apellido].filter(Boolean).join(' ') ||
    item.sellerName;
  return {
    title: item.title || `Mutuo - ${creditorName} / ${debtorName}`,
    parties: `${debtorName} / ${creditorName}`,
    responsible: {
      notary: [agent.nombres || agent.nombre, agent.apellidos || agent.apellido]
        .filter(Boolean)
        .join(' '),
      preparer: [
        preparer.nombres || preparer.nombre,
        preparer.apellidos || preparer.apellido,
      ]
        .filter(Boolean)
        .join(' '),
    },
    searchable: [
      item.title,
      debtorName,
      creditorName,
      debtor.documento,
      creditor.documento,
      debtor.sociedad_nombre,
      debtor.sociedad_nit,
      creditor.sociedad_nombre,
      creditor.sociedad_nit,
      terms.amount,
      terms.paymentBank,
      terms.paymentAccount,
      terms.paymentDetails,
      agent.nombres,
      agent.apellidos,
      preparer.nombres,
      preparer.apellidos,
    ],
  };
};

const marriagePresentation = (item) => {
  const one = draftSection(item, 'partyOne');
  const two = draftSection(item, 'partyTwo');
  const agent = draftSection(item, 'agent');
  const preparer = draftSection(item, 'preparer');
  const oneName =
    [one.nombre, one.apellido].filter(Boolean).join(' ') || item.buyerName;
  const twoName =
    [two.nombre, two.apellido].filter(Boolean).join(' ') || item.sellerName;
  return {
    title: item.title || 'Matrimonio - ' + oneName + ' / ' + twoName,
    parties: oneName + ' / ' + twoName,
    responsible: {
      notary: [agent.nombres || agent.nombre, agent.apellidos || agent.apellido]
        .filter(Boolean)
        .join(' '),
      preparer: [
        preparer.nombres || preparer.nombre,
        preparer.apellidos || preparer.apellido,
      ]
        .filter(Boolean)
        .join(' '),
    },
    searchable: [
      item.title,
      oneName,
      twoName,
      one.documento,
      two.documento,
      agent.nombres,
      agent.apellidos,
      preparer.nombres,
      preparer.apellidos,
    ],
  };
};

const presenters = {
  'car-sale': carSalePresentation,
  mutual: mutualPresentation,
  marriage: marriagePresentation,
};

export function presentDocumentHistory(item) {
  const presentation = presenters[item.type]?.(item) || {
    title: item.title || 'Documento',
    parties: [item.buyerName, item.sellerName].filter(Boolean).join(' / '),
    searchable: Object.values(item).filter(
      (value) => typeof value === 'string'
    ),
  };
  return {
    ...presentation,
    searchableText: presentation.searchable
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase(),
  };
}

export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'car-sale', label: 'Compraventa' },
  { value: 'mutual', label: 'Mutuo' },
  { value: 'marriage', label: 'Matrimonio' },
];
