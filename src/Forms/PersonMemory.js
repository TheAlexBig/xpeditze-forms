export const normalizeDui = (documento = '') =>
  documento
    .toString()
    .trim()
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '');

export const formatDui = (documento = '') => {
  const digits = documento.toString().replace(/\D/g, '').slice(0, 9);

  if (digits.length <= 8) {
    return digits;
  }

  return `${digits.slice(0, 8)}-${digits.slice(8)}`;
};

export const normalizeNit = (nit = '') =>
  nit.toString().replace(/\D/g, '').slice(0, 14);

export const formatNit = (nit = '') => {
  const digits = normalizeNit(nit);
  const groups = [
    digits.slice(0, 4),
    digits.slice(4, 10),
    digits.slice(10, 13),
    digits.slice(13, 14),
  ];
  return groups.filter(Boolean).join('-');
};
