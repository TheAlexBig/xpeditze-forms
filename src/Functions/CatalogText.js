const collapseSpaces = (value = '') =>
  value.toString().trim().replace(/\s+/g, ' ');

const lowercaseConnectors = new Set([
  'de',
  'del',
  'la',
  'las',
  'el',
  'los',
  'y',
  'en',
]);

const normalizeToken = (token, index) => {
  if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(token)) return token;
  if (/\d/.test(token) || token.includes('-'))
    return token.toLocaleUpperCase('es-SV');
  if (/^[A-ZÁÉÍÓÚÜÑ]{2,4}$/.test(token)) return token;

  const lower = token.toLocaleLowerCase('es-SV');
  if (index > 0 && lowercaseConnectors.has(lower)) return lower;
  return lower.charAt(0).toLocaleUpperCase('es-SV') + lower.slice(1);
};

export const normalizeCatalogText = (value = '') =>
  collapseSpaces(value)
    .split(' ')
    .filter(Boolean)
    .map(normalizeToken)
    .join(' ');
