const numberToLetter = (number) => {
  const units = [
    'cero ',
    'uno ',
    'dos ',
    'tres ',
    'cuatro ',
    'cinco ',
    'seis ',
    'siete ',
    'ocho ',
    'nueve ',
  ];
  let Lnumber = '';
  for (let i = 0; i < number.length; i += 1) {
    Lnumber += units[parseInt(number.charAt(i))];
  }
  return Lnumber;
};
export default numberToLetter;
