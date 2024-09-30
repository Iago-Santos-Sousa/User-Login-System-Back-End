const formatCpf = (cpf) => {
  // Remove todos os caracteres não são números do CPF
  cpf = cpf.replace(/\D/g, "");

  // Preenche com zeros na esquerda se o cpf for menor que 11 caracteres
  cpf = cpf.padStart(11, "0");

  // aplicando a expressão regular em cada grupo de caractere
  const formattedCpf = cpf.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4",
  );

  return formattedCpf;
};

function formatCnpj(cnpj) {
  // Remove todos os caracteres não são números do CNPJ
  cnpj = cnpj.replace(/\D/g, "");

  // Preenche com zeros na esquerda se for menor que 14 caracteres
  cnpj = cnpj.padStart(14, "0");

  // aplicando a expressão regular em cada grupo de caracter
  const formattedCnpj = cnpj.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5",
  );

  return formattedCnpj;
}

// máscara CEP
const formatCep = (inputCEP) => {
  if (!inputCEP) {
    return inputCEP;
  }

  // Remove caracteres não numéricos
  let onlyNums = inputCEP.replace(/[^\d]/g, "");

  // impede que digite mais que 8 caracteres
  if (onlyNums.length > 8) {
    return (onlyNums = onlyNums
      .slice(0, 8)
      .replace(/(\d{5})(\d{0,4})/, "$1-$2"));
  }

  if (onlyNums.length === 4) {
    return (onlyNums = onlyNums.replace(/(\d{5})(\d{0,4})/, "$1-$2"));
  }

  if (onlyNums.length > 5) {
    return (onlyNums = onlyNums.replace(/(\d{5})(\d{0,4})/, "$1-$2"));
  }

  if (onlyNums.length < 5) {
    return (onlyNums = onlyNums.replace(/(\d{5})(\d{0,4})/, "$1-$2"));
  }

  const maskedCEP = onlyNums.replace(/(\d{5})(\d{3})/, "$1-$2");
  return maskedCEP;
};

module.exports = {
  formatCep,
  formatCnpj,
  formatCpf,
};
