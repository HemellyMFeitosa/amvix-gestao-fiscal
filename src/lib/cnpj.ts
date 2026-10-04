export const formatCNPJ = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 14) {
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return value;
};

export const validateCNPJ = (cnpj: string): boolean => {
  const numbers = cnpj.replace(/\D/g, '');

  if (numbers.length !== 14) return false;
  if (/^(\d)\1+$/.test(numbers)) return false;

  let sum = 0;
  let pos = 5;
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers[i]) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(numbers[12]) !== digit) return false;

  sum = 0;
  pos = 6;
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers[i]) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return parseInt(numbers[13]) === digit;
};
